import * as THREE from 'three';

export function lighting(scene) {

  const light1 = new THREE.AmbientLight(0xffffff,1.0)
  const light2 = new THREE.DirectionalLight(0xffffff,2.0)
  light2.position.set(10,20,30)
  

  scene.add(light1,light2)
  
}