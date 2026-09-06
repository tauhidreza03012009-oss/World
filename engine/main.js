import * as THREE from "three"
import {initSetup} from "./render/render.js"
import {createWorld} from "./world/world.js"
import {Player} from "./player/player.js"
import {Gravity} from "./physics/gravity.js"
import {initControls} from "./control/touch.js"
import {cameraControl} from "./control/camera.js"
import {dist} from "./control/map.js"

const { scene , camera , renderer } = initSetup()

export const world = createWorld(scene)
export const player= new Player({scene:scene,object:world})
export const gravity= new Gravity({object:world})
initControls(player, camera, scene, world)
let then =0

function frame(now){
  requestAnimationFrame(frame)
  let dt=(now - then) / 1000 ;
  dt = Math.min(dt, 0.05);
  then = now
  cameraControl(camera,player,scene,dist)
  player.update(dt,gravity)
  
  if (world.room && world.room.doing) {
    world.room.updatePosition()
  }
  if (world.chair && world.chair.doing) {
    world.chair.updatePosition()
  }
  if (world.room1 && world.room1.doing) {
    world.room1.updatePosition()
  }
  if (world.room2 && world.room2.doing) {
    world.room2.updatePosition()
  }
  if (world.jumper && world.jumper.doing) {
    world.jumper.updatePosition()
    }
  if (world.cont && world.cont.doing) {
    world.cont.updatePosition()
  }
  renderer.render(scene,camera)
}

requestAnimationFrame(frame)