import * as THREE from "three"
import { box } from "./room.js"

export function Chair(scene,ground,x,z){
  const chair = new THREE.Group()
  chair.doing=true;
  chair.updatePosition=()=>{
    if (ground.heightData) {
    chair.doing = false
    let y=ground.height(x,z)
    box(chair,x,y+0.75,z,2.5,0.1,2.5,0xbbaaaa)
    box(chair,x+1,y+0.25,z+1,0.1,0.5,0.1,0xbbaaaa)
    box(chair,x-1,y+0.25,z+1,0.1,0.5,0.1,0xbbaaaa)
    box(chair,x-1,y+0.25,z-1,0.1,0.5,0.1,0xbbaaaa)
    box(chair,x+1,y+0.25,z-1,0.1,0.5,0.1,0xbbaaaa)
      chair.rotation.x=1
    scene.add(chair)}
  }
  console.log(chair)
  return chair
}