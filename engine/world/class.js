import { playerMesh,playAnimation,updatePlayerAnimation } from "../player/playerMesh.js"

export class NPC{
  constructor({
    scene=null,
    name="UNKNOWN",
    job="UNKNOWN",
    position={x:130,y:1100,z:-120},
    id=Math.floor(Math.random()*1000)
  }={}){
    this.name=name;
    this.job=job;
    this.id=id;
    this.onaction=false;
    this.mesh=playerMesh(scene)
    this.mesh.position.set(position.x,position.y,position.z)
  }
  setPosition(flg,x, y, z) {
    if (this.mesh) {
      this.mesh.position.set(x, y, z);
      this.onaction=flg
    }
  }

  update(dt){
    if(!this.onaction)return;
    playAnimation("Man_Idle","Man_Idle")
    updatePlayerAnimation(this.mesh.mixer)
}
}