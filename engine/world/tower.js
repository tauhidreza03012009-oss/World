import * as THREE from "three"

const textureLoader = new THREE.TextureLoader();
const tr = textureLoader.load("./public/tower.png")
export function Tower(scene){
  const geo = new THREE.CylinderGeometry(6,12,100,16,1,true)
  const mat = new THREE.MeshStandardMaterial({map:tr,side:THREE.DoubleSide})
  const mesh = new THREE.Mesh(geo,mat)
  mesh.position.set(115,55.0,404)
  mesh.name="T"
  scene.add(mesh)
 const geo1= new THREE.CylinderGeometry(12,12,0.75,16,1,true,0,1.75*Math.PI)
  const mesh1 = new THREE.Mesh(geo1,mat)
  mesh1.position.set(115,1,404)
  scene.add(mesh1)
  
  const mesh2 = new THREE.Mesh(geo1,mat)
  mesh2.position.set(115,2.5,404)
  scene.add(mesh2)

  const mesh3 = new THREE.Mesh(geo1,mat)
  mesh3.position.set(115,4.0,404)
  mesh3.position.set(115,4.0,404)
  scene.add(mesh3)
  
  const geoy = new THREE.BoxGeometry(32,6,32)
  const maty = new THREE.MeshStandardMaterial({color:0x999999})

  const mesh0 = new THREE.Mesh(geoy,maty)
  mesh0.position.set(115,20,404)
  scene.add(mesh0)

  const geoyi = new THREE.BoxGeometry(2,6,4)
  const matyi = new THREE.MeshStandardMaterial({color:0x9999aa})

  const mesh0i = new THREE.Mesh(geoyi,matyi)
  const mesh0j = new THREE.Mesh(geoyi,matyi)
  mesh0i.position.set(98,19,404)
  mesh0j.position.set(96,18.6,404)
  scene.add(mesh0i)
  scene.add(mesh0j)
  mesh1.name="T"
  mesh2.name="T"
  mesh3.name="T"
}