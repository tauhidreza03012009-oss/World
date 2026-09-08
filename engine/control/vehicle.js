import { BTN } from "../../constant.js";
const mine = document.getElementById("myCanvas");
import {Speed} from "../../constant.js"

export function rider(camera, player, scene) {
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

  const run = getOrCreate("out", "run");
  const jumb = getOrCreate("break", "run");
  const shoot = getOrCreate("speed", "run");
  const zoom = getOrCreate("horn", "run");
  


  run.innerHTML = "OUT";
  jumb.innerHTML = "BREAK";
  shoot.innerHTML = "SPEED";
  zoom.innerHTML = "HORN";
  

  [run, jumb, zoom, shoot].forEach((x) => {
    let inf = BTN[x.innerHTML];

    x.style.height = `${inf.height}px`;
    x.style.width = `${inf.width}px`;
    x.style.bottom = `${inf.bottom}%`;
    x.style.left = `${inf.left}%`;
    x.style.opacity = inf.opacity;
  });


  zoom.addEventListener("click", () => {
    
  });

  run.addEventListener("click", () => {
    
  });

  jumb.addEventListener("click", () => {
    Speed.car=Math.min(50,Math.max(-20,Speed.car-2))
  });

  shoot.addEventListener("click", () => {
    Speed.car=Math.min(50,Math.max(-20,Speed.car+2))
    console.log(Speed)
  });
  geton.style.display = "none"
  mine.append(run, jumb, shoot, zoom, get, geton);

  return [run, jumb, shoot, zoom]
}