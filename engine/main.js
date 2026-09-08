import * as THREE from "three"
import {initSetup} from "./render/render.js"
import {createWorld} from "./world/world.js"
import {Player} from "./player/player.js"
import {Gravity} from "./physics/gravity.js"
import {initControls} from "./control/touch.js"
import {cameraControl} from "./control/camera.js"
import {dist} from "./control/map.js"
import {customWindow} from "../custom.js"
import {Sensitivity} from "../constant.js"

const { scene , camera , renderer } = initSetup()
const play = document.getElementById("play")
const settings = document.getElementById("settings")
const setting = document.getElementById("setting")
const show = document.getElementById("screen")
const mine = document.getElementById("myCanvas")
const ret = document.getElementById("return")
const custom = document.getElementById("customize")
const bar = document.getElementById("sense")
const zoombar = document.getElementById("zoomsense")

export let world = null
export let player = null
export let gravity = null
export let animationFrameId = null

play.addEventListener("click", () => {
  
  show.style.display = "none"
  mine.style.display = "block"
  start()
})
settings.addEventListener("click", () => {
  show.style.display = "none"
  setting.style.display = "flex"
  bar.value=Sensitivity["NORM"]
  zoom.value=Sensitivity["ZOOM"]
})
ret.addEventListener("click", () => {
  show.style.display = "flex"
  setting.style.display = "none"
})
custom.addEventListener("click",()=>{
  setting.style.display = "none"
  customWindow(setting)
})


world = createWorld(scene)
player = new Player({ scene: scene, object: world })
gravity = new Gravity({ object: world })


let then = 0

function start() {
initControls(player, camera, scene, world)
let then=0

  function frame(now) {
    animationFrameId = requestAnimationFrame(frame)
    if(!then) then =0;
    let dt = (now - then) / 1000;
    dt = Math.min(dt, 0.05)
    then = now
    cameraControl(camera, player, scene, dist)
    player.update(dt, gravity)
    
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
    renderer.render(scene, camera)
  }
  
  animationFrameId = requestAnimationFrame(frame)
}

export function token() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}