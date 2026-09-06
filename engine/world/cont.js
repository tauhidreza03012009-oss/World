import * as THREE from "three"
import { box } from "./room.js"
const textureLoader = new THREE.TextureLoader();
const grass = textureLoader.load("./public/cont.png") 

export function Cont(scene,ground,x,z){
  const chair = new THREE.Group()
  chair.doing=true;
  chair.updatePosition=()=>{
    if (ground.heightData) {
    chair.doing = false
    let y=ground.height(x,z)
      let grassTexture= new THREE.MeshStandardMaterial({map:grass})
    box(chair,x+2,y,z,0.15,3,8,null,grassTexture)
    box(chair,x-2,y,z,0.15,3,8,null,grassTexture)
    box(chair,x,y,z+4,4,3,0.15,null,grassTexture)
    box(chair,x,y+3,z,4,0.1,8,null,grassTexture)
    scene.add(chair)}
  }
  console.log(chair)
  return chair
}