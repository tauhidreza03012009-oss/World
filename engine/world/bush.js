import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

let cachedLargeBushesGeo = null;

function getLargeBushesGeometry() {
  if (cachedLargeBushesGeo) {
    return cachedLargeBushesGeo;
  }

  const center = new THREE.DodecahedronGeometry(1.5, 1);
  center.scale(1.8, 1.3, 1.4);
  center.translate(0, 1.2, 0);

  const left = new THREE.DodecahedronGeometry(1.2, 1);
  left.scale(1.5, 1.1, 1.2);
  left.translate(-1.6, 0.9, 0.2);

  const right = new THREE.DodecahedronGeometry(1.3, 1);
  right.scale(1.6, 1.2, 1.3);
  right.translate(1.6, 1.0, -0.2);

  const top = new THREE.DodecahedronGeometry(1.1, 1);
  top.scale(1.3, 1.2, 1.2);
  top.translate(0.3, 2.1, -0.1);

  const front = new THREE.DodecahedronGeometry(1.0, 1);
  front.scale(1.4, 1.0, 1.3);
  front.translate(-0.4, 0.8, 1.1);

  const back = new THREE.DodecahedronGeometry(1.0, 1);
  back.scale(1.4, 1.0, 1.3);
  back.translate(0.4, 0.8, -1.1);

  cachedLargeBushesGeo = BufferGeometryUtils.mergeGeometries([
    center,
    left,
    right,
    top,
    front,
    back
  ]);

  return cachedLargeBushesGeo;
}

export function bushes(scene, positions) {
  const bushGeo = getLargeBushesGeometry();
  const bushMaterial = new THREE.MeshLambertMaterial({ 
    color: 0x2e6f40, 
    flatShading: true 
  });

  const bushInstanced = new THREE.InstancedMesh(bushGeo, bushMaterial, positions.length);
  const dummy = new THREE.Object3D();

  positions.forEach((pos, i) => {
    dummy.position.set(pos.x, pos.y, pos.z);
    
    dummy.rotation.y = (Math.sin(i * 12.34) + 1) * Math.PI;
    const scale =  0.45+ Math.abs(Math.sin(i * 56.78)) * 0.1;
    dummy.scale.set(scale, scale, scale);

    dummy.updateMatrix();
    bushInstanced.setMatrixAt(i, dummy.matrix);
  });

  bushInstanced.instanceMatrix.needsUpdate = true;
  bushInstanced.name = "Bushes";

  scene.add(bushInstanced);
  return bushInstanced;
}
