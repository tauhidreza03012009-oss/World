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
  const jumb = getOrCreate("break", "sq");
  const shoot = getOrCreate("speed", "sq");
  const zoom = getOrCreate("horn", "run");
  


  run.innerHTML = "OUT";
  jumb.innerHTML = "BREAK";
  shoot.innerHTML = "SPEED";
  zoom.innerHTML = "HORN";
  

  [run, jumb, zoom, shoot].forEach((x) => {
    let inf = BTN[x.innerHTML];
    let k=(x.className=="sq")?0.5:1;
    x.style.height = `${inf.height}px`;
    x.style.width = `${inf.width*k}px`;
    x.style.bottom = `${inf.bottom}%`;
    x.style.left = `${inf.left}%`;
    x.style.opacity = inf.opacity;
  });


  zoom.addEventListener("click", () => {
    
  });

  run.addEventListener("click", () => {
    
  });

  let accelInterval = null;

function startAcceleration(changeAmount) {
  stopAcceleration();
  const updateSpeed = () => {
    Speed.car = Math.min(50, Math.max(-20, Speed.car + changeAmount));
    accelInterval = requestAnimationFrame(updateSpeed);
  };
  updateSpeed();
}

function stopAcceleration() {
  if (accelInterval) {
    cancelAnimationFrame(accelInterval);
    accelInterval = null;
  }
}

jumb.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  startAcceleration(-0.5);
});

jumb.addEventListener("pointerup", stopAcceleration);
jumb.addEventListener("pointerleave", stopAcceleration);
jumb.addEventListener("pointercancel", stopAcceleration);

shoot.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  startAcceleration(0.5);
});

shoot.addEventListener("pointerup", stopAcceleration);
shoot.addEventListener("pointerleave", stopAcceleration);
shoot.addEventListener("pointercancel", stopAcceleration);

  geton.style.display = "none"
  mine.append(run, jumb, shoot, zoom, get, geton);

  return [run, jumb, shoot, zoom]
}