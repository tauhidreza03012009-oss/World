import * as THREE from "three"

const textureLoader = new THREE.TextureLoader();
const tr = textureLoader.load("./public/water.jpg")
tr.wrapS = THREE.RepeatWrapping;
tr.wrapT = THREE.RepeatWrapping;
tr.repeat.set(10, 10);
export function Box(scene){
  const geo = new THREE.BoxGeometry(1500,1,1500)
  const mat = new THREE.MeshStandardMaterial({map:tr,side:THREE.DoubleSide,metalness:1.0})
  const mesh = new THREE.Mesh(geo,mat)
  mesh.name="SEA"
  mesh.position.set(0,-3,0)
  scene.add(mesh)
}