import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

let cachedLampMetalGeo = null;
let cachedLampBulbGeo = null;

function getLampGeometries() {
  if (cachedLampMetalGeo && cachedLampBulbGeo) {
    return { metalGeo: cachedLampMetalGeo, bulbGeo: cachedLampBulbGeo };
  }

  const baseGeo = new THREE.CylinderGeometry(0.35, 0.5, 0.4, 6);
  baseGeo.translate(0, 0.2, 0);

  const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 3.8, 6);
  poleGeo.translate(0, 2.3, 0);

  const collarGeo = new THREE.CylinderGeometry(0.2, 0.08, 0.2, 6);
  collarGeo.translate(0, 4.3, 0);

  const capGeo = new THREE.ConeGeometry(0.38, 0.3, 6);
  capGeo.translate(0, 5.15, 0);

  cachedLampMetalGeo = BufferGeometryUtils.mergeGeometries([
    baseGeo,
    poleGeo,
    collarGeo,
    capGeo
  ]);

  cachedLampBulbGeo = new THREE.CylinderGeometry(0.22, 0.15, 0.6, 6);
  cachedLampBulbGeo.translate(0, 4.7, 0);

  return { metalGeo: cachedLampMetalGeo, bulbGeo: cachedLampBulbGeo };
}

export function createInstancedLamps(scene, positions) {
  const { metalGeo, bulbGeo } = getLampGeometries();
  
  const metalMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const bulbMaterial = new THREE.MeshBasicMaterial({ color: 0xffeab3 });

  const metalInstanced = new THREE.InstancedMesh(metalGeo, metalMaterial, positions.length);
  const bulbInstanced = new THREE.InstancedMesh(bulbGeo, bulbMaterial, positions.length);

  const dummy = new THREE.Object3D();

  positions.forEach((pos, i) => {
    dummy.position.set(pos.x, pos.y, pos.z);
    dummy.updateMatrix();
    metalInstanced.setMatrixAt(i, dummy.matrix);
    bulbInstanced.setMatrixAt(i, dummy.matrix);
  });

  metalInstanced.instanceMatrix.needsUpdate = true;
  bulbInstanced.instanceMatrix.needsUpdate = true;

  scene.add(metalInstanced);
  scene.add(bulbInstanced);
  metalInstanced.name="Lamp"
  bulbInstanced.name="Lamp"
  return { metalInstanced, bulbInstanced };
}
