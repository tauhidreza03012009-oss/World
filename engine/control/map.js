import { cameraControl } from "../control/camera.js";
import { token } from "../main.js";
import { BTN } from "../../constant.js";

export let dist = 5;
const map = document.createElement("div");
const mapShow = document.createElement("div");
mapShow.style.display="none"
const cross = document.createElement("div");
const pos = document.createElement("div");
pos.innerHTML="♦"
pos.style.position="absolute"
cross.className="get"
cross.innerHTML="x"
cross.addEventListener("click",()=>{
  mapShow.style.display="none"
})
map.addEventListener("click",()=>{
  mapShow.style.display="flex"
})
mapShow.appendChild(cross)
mapShow.appendChild(pos)
map.className = "map";
mapShow.className = "maps";
map.innerHTML = " ♠ ";
const play = document.getElementById("play");
const setting = document.getElementById("settings");
const show = document.getElementById("screen");
const mine = document.getElementById("myCanvas");

export function createMap() {
  mine.appendChild(map);
  mine.appendChild(mapShow);
}

export function setMapPosition(x, y, deg) {
  map.style.backgroundPosition = `${x - 1160}px ${y - 1160}px`;
  map.style.transform = `rotate(${-deg * 180 / Math.PI}deg)`;
  pos.style.top= `${-y/25+50}%`
  pos.style.left= `${-x/25+50}%`
}

export function runner(camera, player, scene) {
  function getOrCreate(id, className) {
    let el = document.getElementById(id);
    if (el) {
      const cleanEl = el.cloneNode(true);
      el.replaceWith(cleanEl);
      return cleanEl;
    }
    el = document.createElement("div");
    el.id = id;
    el.className = className;
    return el;
  }

  const run = getOrCreate("run", "run");
  const jumb = getOrCreate("jump", "run");
  const shoot = getOrCreate("shoot", "run");
  const zoom = getOrCreate("zoom", "run");
  const geton = getOrCreate("geton", "run");
  const get = getOrCreate("get", "get");

  get.innerText = "<—";
  get.innerText = "<—";
  get.style.position = "absolute";
  get.style.top = "0";
  get.style.left = "0";
  run.innerHTML = "RUN";
  jumb.innerHTML = "JUMP";
  shoot.innerHTML = "SHOT";
  zoom.innerHTML = "ZOOM";
  geton.innerHTML = "GET";
  

  [run, jumb, zoom, shoot,geton].forEach((x) => {
    let inf = BTN[x.innerHTML];

    x.style.height = `${inf.height}px`;
    x.style.width = `${inf.width}px`;
    x.style.bottom = `${inf.bottom}%`;
    x.style.left = `${inf.left}%`;
    x.style.opacity = inf.opacity;
  });

  get.addEventListener("click", () => {
    show.style.display = "flex";
    mine.style.display = "none";
    token();
  });
  
  zoom.addEventListener("click", () => {
    dist = dist === 5 ? 20 : 5;
    zoom.style.backgroundColor = dist === 5 ? "#00faff" : "#00ffaf";
  });

  run.addEventListener("click", () => {
    let k = player.speed.z;
    player.speed.z = k === 0.75 ? 0 : 0.75;
    player.speed.x = k === 0.75 ? 0 : 0;
    run.style.backgroundColor = k === 0.75 ? "#00faff" : "#00ffaf";
  });

  jumb.addEventListener("click", () => {
    if (player.grounded === true) {
      player.speed.y = 0.125;
      player.grounded = false;
      player.jum=true;
    }
  });

  shoot.addEventListener("click", () => {
    const currentShootTarget = cameraControl(camera, player, scene);
    player.shoot(currentShootTarget);
  });
  geton.style.display = "none"
  console.log(get)
  mine.append(run, jumb, shoot, zoom, get, geton);

  return [run, jumb, shoot, zoom, geton]
}