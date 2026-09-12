import * as THREE from "three"
import {scene} from "../engine/main.js"

let mesh = null;
let current= null

export function marking(scene=null,name="",x=0,y=10000,z=0,w=0,h=0,l=0){
  if(current==name)return mesh;
  deleteMesh(scene)
  current=name
  const geo = new THREE.BoxGeometry(w,h,l)
  const mat = new THREE.MeshStandardMaterial({
    color:0x00faff,
    transparent:true,
    opacity:0.5
  })
  mesh = new THREE.Mesh( geo,mat )
  mesh.position.set(x,y,z)
  mesh.name="G"
 if(scene)scene.add(mesh);

  return mesh
}

export function deleteMesh(){
 if(mesh&&scene)scene.remove(mesh);
 mesh=null
 current=null
}
