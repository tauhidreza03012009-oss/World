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
import {data} from "../Info/yourself.js"
import {change} from "./control/addition.js"

export const { scene , camera , renderer } = initSetup()
const play = document.getElementById("play")
const settings = document.getElementById("settings")
const setting = document.getElementById("setting")
const show = document.getElementById("screen")
const mine = document.getElementById("myCanvas")
const ret = document.getElementById("return")
const retac = document.getElementById("returnAc")
const custom = document.getElementById("customize")
const bar = document.getElementById("sense")
const zoombar = document.getElementById("zoomsense")
const account = document.getElementById("account")
const accountsh = document.getElementById("accountshow")
const namebox = document.getElementById("namebox")
const levelbox = document.getElementById("levelno")
const experiencebox = document.getElementById("experienceno")
const moneybox = document.getElementById("moneyno")

export let world = null
export let player = null
export let gravity = null
export let animationFrameId = null

play.addEventListener("click", () => {
  
  show.style.display = "none"
  mine.style.display = "block"
  start()
})
account.addEventListener("click", () => {
  
  show.style.display = "none"
  accountsh.style.display = "block"
  namebox.value=data.name
  moneybox.innerHTML=`$ ${data.money}`
  levelbox.innerHTML=`Lev ${data.level}`
  experiencebox.innerHTML=data.experience
})
settings.addEventListener("click", () => {
  show.style.display = "none"
  setting.style.display = "flex"
  bar.value=Sensitivity["NORM"]
  zoombar.value=Sensitivity["ZOOM"]
})
ret.addEventListener("click", () => {
  show.style.display = "flex"
  setting.style.display = "none"
})
retac.addEventListener("click", () => {
  show.style.display = "flex"
  accountsh.style.display = "none"
})
custom.addEventListener("click",()=>{
  setting.style.display = "none"
  customWindow(setting)
})


world = createWorld(scene)
player = new Player({ scene: scene, object: world })
gravity = new Gravity({ object: world })


let then = 0
change()

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
    world.npc.forEach(x=>x.update())
    if(player.onmission){
      player.mission.start(player,dt)
    }
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