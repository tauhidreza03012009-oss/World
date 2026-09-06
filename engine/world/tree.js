import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

let cachedTreeGeometry = null;

function getTreeGeometry() {
  if (cachedTreeGeometry) return cachedTreeGeometry;

  const trunkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.08, 1.0, 0.03),
    new THREE.Vector3(-0.04, 2.0, -0.02),
    new THREE.Vector3(0, 2.8, 0)
  ]);
  const trunkGeometry = new THREE.TubeGeometry(trunkCurve, 24, 0.18, 12, false).toNonIndexed();
  const woodGeometries = [trunkGeometry];

  const createBranchGeo = (startPos, dirRotation, scale = 1) => {
    const geo = new THREE.CylinderGeometry(0.05 * scale, 0.09 * scale, 1.2, 8).toNonIndexed();
    geo.translate(0, 0.6, 0);
    const dummy = new THREE.Object3D();
    dummy.position.copy(startPos);
    dummy.rotation.set(...dirRotation);
    dummy.updateMatrix();
    geo.applyMatrix4(dummy.matrix);
    return geo;
  };

  woodGeometries.push(createBranchGeo(new THREE.Vector3(0.05, 1.5, 0.02), [0.4, 0.8, -0.7], 1.1));
  woodGeometries.push(createBranchGeo(new THREE.Vector3(-0.03, 1.8, -0.01), [-0.5, -1.1, 0.8], 1.0));
  woodGeometries.push(createBranchGeo(new THREE.Vector3(0.01, 2.2, 0.03), [0.8, -0.4, -0.5], 0.85));

  const mergedWoodGeo = BufferGeometryUtils.mergeGeometries(woodGeometries);
  woodGeometries.forEach(g => g.dispose());

  const canopyGeometries = [];
  const createCanopyGeo = (position, scale) => {
    const geo = new THREE.DodecahedronGeometry(0.65, 1).toNonIndexed();
    geo.scale(...scale);
    geo.translate(position.x, position.y, position.z);
    return geo;
  };

  canopyGeometries.push(createCanopyGeo(new THREE.Vector3(0.9, 2.1, 0.4), [1.2, 0.9, 1.1]));
  canopyGeometries.push(createCanopyGeo(new THREE.Vector3(-0.8, 2.4, -0.3), [1.1, 1.0, 1.2]));
  canopyGeometries.push(createCanopyGeo(new THREE.Vector3(0.4, 2.8, -0.5), [1.0, 1.1, 1.0]));
  canopyGeometries.push(createCanopyGeo(new THREE.Vector3(-0.3, 3.0, 0.5), [1.1, 0.9, 1.1]));
  canopyGeometries.push(createCanopyGeo(new THREE.Vector3(0, 3.4, 0), [1.4, 1.2, 1.4]));

  const mergedCanopyGeo = BufferGeometryUtils.mergeGeometries(canopyGeometries);
  canopyGeometries.forEach(g => g.dispose());

  cachedTreeGeometry = BufferGeometryUtils.mergeGeometries([mergedWoodGeo, mergedCanopyGeo], true);
  cachedTreeGeometry.scale(2, 2, 2);
  mergedWoodGeo.dispose();
  mergedCanopyGeo.dispose();

  return cachedTreeGeometry;
}

export function createInstancedTrees(scene, positions) {
  const geometry = getTreeGeometry();
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.9 });
  const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x2e6f40, roughness: 0.6 });

  const instancedMesh = new THREE.InstancedMesh(geometry, [trunkMaterial, foliageMaterial], positions.length);
  const dummy = new THREE.Object3D();

  positions.forEach((pos, i) => {
    dummy.position.set(pos.x, pos.y, pos.z);
    dummy.rotation.y = Math.random() * Math.PI * 2;
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  });

  instancedMesh.instanceMatrix.needsUpdate = true;
  instancedMesh.castShadow = true;
  instancedMesh.name="TREE"
  scene.add(instancedMesh);
  return instancedMesh;
}
