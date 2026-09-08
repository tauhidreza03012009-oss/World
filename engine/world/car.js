import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let cachedGltf = null;

export function loadCarModel(url = './public/car.glb') {
  if (cachedGltf) {
    return Promise.resolve(cachedGltf);
  }

  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        cachedGltf = gltf;
        resolve(gltf);
      },
      undefined,
      (err) => reject(err)
    );
  });
}

export async function createInstancedCarsFromGLTF(scene, transforms, color = 0xd93838, modelUrl = './public/car.glb') {
  const gltf = await loadCarModel(modelUrl);
  const count = transforms.length;
  const instancedMeshes = [];

  const dummy = new THREE.Object3D();
  const parsedColor = new THREE.Color();

  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      const material = child.material.clone();
      const instancedMesh = new THREE.InstancedMesh(child.geometry, material, count);
      
      // Store initial scale so updates don't shrink sub-meshes
      instancedMesh.userData.initialScale = transforms[0]?.scale ?? 0.1;

      // Fix frustum culling inside the mesh creation loop
      instancedMesh.frustumCulled = false;

      transforms.forEach((transform, i) => {
        dummy.position.set(transform.x, transform.y, transform.z);
        dummy.rotation.y = transform.rotation || 0;
        const currentScale = transform.scale ?? 0.1;
        dummy.scale.set(currentScale, currentScale, currentScale);
        dummy.updateMatrix();

        instancedMesh.setMatrixAt(i, dummy.matrix);

        const itemColor = Array.isArray(color) ? color[i] : color;
        parsedColor.set(itemColor);
        instancedMesh.setColorAt(i, parsedColor);
      });

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) {
        instancedMesh.instanceColor.needsUpdate = true;
      }

      instancedMesh.name = "Car";
      scene.add(instancedMesh);
      instancedMeshes.push(instancedMesh);
    }
  });

  return instancedMeshes;
}

const dummy = new THREE.Object3D();

export function moveSingleCar(instancedMeshes, indexToMove, newPosition, newRotation = 0, scale = null) {
  if (!instancedMeshes) return;

  if (instancedMeshes instanceof Promise) {
    instancedMeshes.then((resolvedMeshes) => {
      moveSingleCar(resolvedMeshes, indexToMove, newPosition, newRotation, scale);
    });
    return;
  }

  if (Array.isArray(instancedMeshes)) {
    instancedMeshes.forEach((mesh) => {
      if (mesh && mesh.isInstancedMesh) {
        const meshScale = scale ?? mesh.userData.initialScale ?? 0.1;

        dummy.position.copy(newPosition);
        dummy.rotation.set(0, newRotation, 0);
        dummy.scale.set(meshScale, meshScale, meshScale);
        dummy.updateMatrix();

        mesh.setMatrixAt(indexToMove, dummy.matrix);
        mesh.instanceMatrix.needsUpdate = true;
        mesh.computeBoundingSphere();
      }
    });
  }
}
