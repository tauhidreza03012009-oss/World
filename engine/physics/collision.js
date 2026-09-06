import * as THREE from 'three';
import { OBB } from 'three/addons/math/OBB.js';

const entityOBB = new OBB();
const itemOBB = new OBB();
const center = new THREE.Vector3();
const size = new THREE.Vector3();
const instanceMatrix = new THREE.Matrix4();
const worldMatrix = new THREE.Matrix4();

const scale = new THREE.Vector3();
const rotation = new THREE.Quaternion();
const translation = new THREE.Vector3();
const pureRotationMatrix = new THREE.Matrix4();

export function getCollidingObject(entity, objects, stepTolerance = 0.3) {
  if (!entity || !Array.isArray(objects) || objects.length === 0) return null;

  const targetEntity = (entity.isGroup && entity.children.length > 0) ? entity.children[0] : entity;
  setupOBB(targetEntity, entityOBB);

  for (let i = 0; i < objects.length; i++) {
    const item = objects[i];
    if (!item || (!item.isMesh && !item.isInstancedMesh)) continue;

    if (item.isInstancedMesh) {
      if (!item.geometry.boundingBox) item.geometry.computeBoundingBox();
      item.geometry.boundingBox.getCenter(center);
      item.geometry.boundingBox.getSize(size);
      size.multiplyScalar(0.5);

      item.updateWorldMatrix(true, false);

      for (let instanceIdx = 0; instanceIdx < item.count; instanceIdx++) {
        item.getMatrixAt(instanceIdx, instanceMatrix);
        worldMatrix.multiplyMatrices(item.matrixWorld, instanceMatrix);

        worldMatrix.decompose(translation, rotation, scale);
        pureRotationMatrix.makeRotationFromQuaternion(rotation);

        itemOBB.center.copy(center).applyMatrix4(worldMatrix);
        itemOBB.halfSize.copy(size).multiply(scale);
        itemOBB.rotation.setFromMatrix4(pureRotationMatrix);

        if (entityOBB.intersectsOBB(itemOBB)) {
          const entityBottom = entityOBB.center.y - entityOBB.halfSize.y;
          const itemTop = itemOBB.center.y + itemOBB.halfSize.y;

          if (itemTop - entityBottom <= stepTolerance) continue;

          return item;
        }
      }
    } else {
      setupOBB(item, itemOBB);

      if (entityOBB.intersectsOBB(itemOBB)) {
        const entityBottom = entityOBB.center.y - entityOBB.halfSize.y;
        const itemTop = itemOBB.center.y + itemOBB.halfSize.y;

        if (itemTop - entityBottom <= stepTolerance) continue;

        return item;
      }
    }
  }

  return null;
}

function setupOBB(mesh, obb) {
  if (!mesh.geometry.boundingBox) {
    mesh.geometry.computeBoundingBox();
  }

  mesh.geometry.boundingBox.getCenter(center);
  mesh.geometry.boundingBox.getSize(size);
  size.multiplyScalar(0.5);

  mesh.updateWorldMatrix(true, false);
  const localWorldMatrix = mesh.matrixWorld;

  localWorldMatrix.decompose(translation, rotation, scale);
  pureRotationMatrix.makeRotationFromQuaternion(rotation);

  obb.center.copy(center).applyMatrix4(localWorldMatrix);
  obb.halfSize.copy(size).multiply(scale);
  obb.rotation.setFromMatrix4(pureRotationMatrix);
}
