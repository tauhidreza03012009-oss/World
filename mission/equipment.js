import * as THREE from "three"
import { moveSingleCar } from "../engine/world/car.js"
import { world } from "../engine/main.js"


export function bringBack(player,mission,no){
  for(let r of mission.equipment){
    if(r.type=="car"){
      let a = (!no)?1000:0;
      if(!no){
        player.driving=false;
        player.vehicle = null;
        let outBtn=document.getElementById("out")
        if(outBtn){
          outBtn.dataset.fromMission = "true";
          outBtn.click()
        }
      }
      moveSingleCar(player.resolvedCarMeshes,r.index,new THREE.Vector3(r.x, r.y+a, r.z),Math.PI/2)
    }
    if(r.type=="npc"){
      console.log("ok")
      let a = (!no)?1000:0;
      let k=world.npc.filter(x=>x.id==r.id)[0]
      k.setPosition(no,r.x, r.y+a, r.z)
    }
  }
}