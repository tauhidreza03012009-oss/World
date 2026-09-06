import * as THREE from 'three';

const currentTarget = { x: 0, y: 0, z: 0 };
let isInitialized = false;

const cameraRaycaster = new THREE.Raycaster();
const aimRaycaster = new THREE.Raycaster();

let obstacleCache = [];
let lastCacheTime = 0;

let pointerMesh = null;
let crosshairMesh = null;
let crosshairLines = [];
let zoomed = false;

function ensureSinglePointerMesh(camera, scene) {
  if (camera.parent !== scene) {
    scene.add(camera);
  }

  if (pointerMesh) {
    if (pointerMesh.parent !== camera) {
      camera.add(pointerMesh);
    }
  } else {
    const existing = camera.getObjectByName("reticlePointerMesh");
    if (existing) {
      pointerMesh = existing;
    } else {
      const geometry = new THREE.RingGeometry(0.005, 0.01, 32);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff88, 
        side: THREE.DoubleSide, 
        depthTest: false 
      });
      pointerMesh = new THREE.Mesh(geometry, material);
      pointerMesh.name = "reticlePointerMesh";
      pointerMesh.renderOrder = 999;
      
      pointerMesh.position.set(0, 0, -1);
      camera.add(pointerMesh);
    }
  }

  if (!crosshairMesh) {
    const existingCross = camera.getObjectByName("scopeCrosshairMesh");
    if (existingCross) {
      crosshairMesh = existingCross;
    } else {
      const group = new THREE.Group();
      group.name = "scopeCrosshairMesh";

      const mat = new THREE.LineBasicMaterial({ 
        color: 0x00ff88, 
        depthTest: false, 
        transparent: true, 
        opacity: 0 
      });

      const linePoints = [
        [new THREE.Vector3(-10, 0, 0), new THREE.Vector3(-0.02, 0, 0)],
        [new THREE.Vector3(0.02, 0, 0), new THREE.Vector3(10, 0, 0)],
        [new THREE.Vector3(0, -10, 0), new THREE.Vector3(0, -0.02, 0)],
        [new THREE.Vector3(0, 0.02, 0), new THREE.Vector3(0, 10, 0)],
        [new THREE.Vector3(-0.08, -0.01, 0), new THREE.Vector3(-0.08, 0.01, 0)],
        [new THREE.Vector3(-0.04, -0.01, 0), new THREE.Vector3(-0.04, 0.01, 0)],
        [new THREE.Vector3(0.04, -0.01, 0), new THREE.Vector3(0.04, 0.01, 0)],
        [new THREE.Vector3(0.08, -0.01, 0), new THREE.Vector3(0.08, 0.01, 0)],
        [new THREE.Vector3(-0.01, -0.08, 0), new THREE.Vector3(0.01, -0.08, 0)],
        [new THREE.Vector3(-0.01, -0.04, 0), new THREE.Vector3(0.01, -0.04, 0)],
        [new THREE.Vector3(-0.01, 0.04, 0), new THREE.Vector3(0.01, 0.04, 0)],
        [new THREE.Vector3(-0.01, 0.08, 0), new THREE.Vector3(0.01, 0.08, 0)]
      ];

      crosshairLines = [];
      linePoints.forEach(pts => {
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const lineMat = mat.clone();
        const line = new THREE.Line(geo, lineMat);
        group.add(line);
        crosshairLines.push(line);
      });

      group.renderOrder = 1000;
      group.position.set(0, 0, -0.99);

      crosshairMesh = group;
      camera.add(crosshairMesh);
    }
  }
}

export function cameraControl(camera, player, scene, distance = 5) {
  ensureSinglePointerMesh(camera, scene);

  const lookAtY = player.position.y + 1.2;

  if (!isInitialized) {
    currentTarget.x = player.position.x;
    currentTarget.y = lookAtY;
    currentTarget.z = player.position.z;
    isInitialized = true;
  }

  zoomed = distance > 10;

  const targetFOV = zoomed ? 18 : 75;
  const targetfar = zoomed ? 600 : 400;
  scene.fog.far=targetfar
  if (camera.fov !== targetFOV) {
    camera.fov += (targetFOV - camera.fov) * 0.25;
    camera.updateProjectionMatrix();
  }

  const baseFOV = 60;
  const scaleFactor = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / Math.tan(THREE.MathUtils.degToRad(baseFOV / 2));
  pointerMesh.scale.set(scaleFactor, scaleFactor, 1);

  if (crosshairMesh) {
    const targetOpacity = zoomed ? 0.85 : 0;
    crosshairLines.forEach(line => {
      line.material.opacity += (targetOpacity - line.material.opacity) * 0.25;
    });
    pointerMesh.visible = !zoomed;
  }

  const actualDistance = 5;

  let pitch = player.rotation.x;
  let yaw = player.rotation.y;

  const cosPitch = Math.cos(pitch);
  const idealX = player.position.x - actualDistance * Math.sin(yaw) * cosPitch;
  const idealY = lookAtY - actualDistance * Math.sin(pitch);
  const idealZ = player.position.z - actualDistance * Math.cos(yaw) * cosPitch;

  const now = performance.now();
  if (now - lastCacheTime > 1000) {
    obstacleCache = [];
    scene.traverse((child) => {
      if (
        (child.isMesh || child.isInstancedMesh) && 
        child.geometry && 
        child !== player.mesh?.children[0] && 
        child.name !== "reticlePointerMesh" &&
        child.name !== "scopeCrosshairMesh" &&
        child.name !== "shot" &&
        child.name !== "SEA" &&
        child.name !== "Bushes" &&
        child.name !== "F" &&
        !child.isShot
      ) {
        const params = child.geometry.parameters;
        if (!params || params.widthSegments !== 128) {
          obstacleCache.push(child);
        }
      }
    });
    lastCacheTime = now;
  }

  const playerTargetVec = new THREE.Vector3(player.position.x, lookAtY, player.position.z);
  const idealCamVec = new THREE.Vector3(idealX, idealY, idealZ);
  
  const rayDir = new THREE.Vector3().subVectors(idealCamVec, playerTargetVec).normalize();
  
  cameraRaycaster.set(playerTargetVec, rayDir);
  cameraRaycaster.far = actualDistance;

  const wallHits = cameraRaycaster.intersectObjects(obstacleCache, false);

  let targetX = idealX;
  let targetY = idealY;
  let targetZ = idealZ;

  if (wallHits.length > 0) {
    const hitDistance = Math.max(0.2, wallHits[0].distance - 0.3); 
    const adjustedPos = playerTargetVec.clone().add(rayDir.multiplyScalar(hitDistance));
    
    targetX = adjustedPos.x;
    targetY = adjustedPos.y;
    targetZ = adjustedPos.z;
  }

  const lerpFactor = 0.25;

  camera.position.x += (targetX - camera.position.x) * lerpFactor;
  camera.position.y += (targetY - camera.position.y) * lerpFactor;
  camera.position.z += (targetZ - camera.position.z) * lerpFactor;

  currentTarget.x += (player.position.x - currentTarget.x) * lerpFactor;
  currentTarget.y += (lookAtY - currentTarget.y) * lerpFactor;
  currentTarget.z += (player.position.z - currentTarget.z) * lerpFactor;

  camera.lookAt(currentTarget.x, currentTarget.y, currentTarget.z);

  const camDir = new THREE.Vector3();
  camera.getWorldDirection(camDir);

  aimRaycaster.set(camera.position, camDir);
  const aimHits = aimRaycaster.intersectObjects(obstacleCache, false);

  let shootTarget = null;
  const targetColor = (aimHits.length > 0) ? 0x000088 : 0x00ff88;

  pointerMesh.material.color.setHex(targetColor);
  crosshairLines.forEach(line => {
    line.material.color.setHex(targetColor);
  });

  if (aimHits.length > 0) {
    shootTarget = aimHits[0].point;
  } else {
    shootTarget = camera.position.clone().add(camDir.multiplyScalar(20));
  }

  return shootTarget;
}
