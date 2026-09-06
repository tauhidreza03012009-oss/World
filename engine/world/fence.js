import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

let cachedFenceGeometry = null;

function getFenceGeometry() {
  if (cachedFenceGeometry) return cachedFenceGeometry;

  const width = 10;
  const height = 5;
  const barRadius = 0.08;
  const railRadius = 0.1;
  const postRadius = 0.2;
  const spacing = 0.5; 

  const geometries = [];
  const postGeo = new THREE.CylinderGeometry(postRadius, postRadius, height, 12);
  
  const leftPost = postGeo.clone();
  leftPost.translate(-width / 2, height / 2, 0);
  geometries.push(leftPost);

  const rightPost = postGeo.clone();
  rightPost.translate(width / 2, height / 2, 0);
  geometries.push(rightPost);
  postGeo.dispose();

  const railGeo = new THREE.CylinderGeometry(railRadius, railRadius, width, 12);
  railGeo.rotateZ(Math.PI / 2); 

  const bottomRail = railGeo.clone();
  bottomRail.translate(0, 0.5, 0);
  geometries.push(bottomRail);

  const topRail = railGeo.clone();
  topRail.translate(0, height - 0.5, 0);
  geometries.push(topRail);
  railGeo.dispose();

  const picketGeo = new THREE.CylinderGeometry(barRadius, barRadius, height, 8);
  const startX = -(width / 2) + spacing;
  const endX = (width / 2) - spacing;

  for (let posX = startX; posX <= endX; posX += spacing) {
    const picket = picketGeo.clone();
    picket.translate(posX, height / 2, 0);
    geometries.push(picket);
  }
  picketGeo.dispose();

  cachedFenceGeometry = BufferGeometryUtils.mergeGeometries(geometries);
  geometries.forEach(g => g.dispose());
  return cachedFenceGeometry;
}

export function createInstancedFences(scene, positions) {
  const geometry = getFenceGeometry();
  const ironMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.8,
    roughness: 0.3
  });

  const instancedMesh = new THREE.InstancedMesh(geometry, ironMaterial, positions.length);
  const dummy = new THREE.Object3D();

  positions.forEach((data, i) => {
    dummy.position.set(data.x, data.y, data.z);
    dummy.rotation.y = data.rt || 0;
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  });

  instancedMesh.instanceMatrix.needsUpdate = true;
  instancedMesh.castShadow = true;
  instancedMesh.receiveShadow = true;
  instancedMesh.name="F"
  scene.add(instancedMesh);
  return instancedMesh;
}
