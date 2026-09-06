import * as THREE from 'three';
import { lighting } from "./light.js"

export function initSetup() {
  const canvas = document.getElementById("myCanvas")
  const scene = new THREE.Scene();
  const skyColor = 0x87ceed;
  scene.background = new THREE.Color(skyColor);
  scene.fog = new THREE.Fog(skyColor,50,400)

  const camera = new THREE.PerspectiveCamera(
                     75,
                     window.innerWidth / window.innerHeight,
                     0.1,
                     1000
                     );
  
  camera.position.set(0, 40, 40);
  camera.lookAt(0,3,0);
  lighting(scene)

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  return { scene, camera, renderer };
}
