import { cameraControl } from "../control/camera.js";

export let dist = 5;
const map = document.createElement("div");
map.className = "map";
map.innerHTML = "♦";

export function createMap() {
  document.body.appendChild(map);
}

export function setMapPosition(x, y, deg) {
  map.style.backgroundPosition = `${x - 40}px ${y - 50}px`;
  map.style.transform = `rotate(${-deg * 180 / Math.PI}deg)`;
}

export function runner(camera, player, scene) {
  const run = document.createElement("div");
  const jumb = document.createElement("div");
  const shoot = document.createElement("div");
  const zoom = document.createElement("div");
  run.className = "run";
  run.id = "run";
  
  jumb.className = "jmp";
  shoot.className = "jmp";
  zoom.className = "run";
  shoot.style.bottom = "40%";
  zoom.style.bottom = "40%";
  run.innerHTML = "RUN";
  jumb.innerHTML = "JUMP";
  shoot.innerHTML = "SHOT";
  zoom.innerHTML = "ZOOM";

  zoom.addEventListener("click", () => {
    dist = (dist == 5) ? 20 : 5;
    zoom.style.backgroundColor = (dist == 5)?  "#00faff": "#00ffaf";
  });

  run.addEventListener("click", () => {
    let k = player.speed.z;
    player.speed.z = (k == 0.75) ? 0 : 0.75;
    player.speed.x = (k == 0.75) ? 0 : 0;
    run.style.backgroundColor = (k == 0.75)?  "#00faff": "#00ffaf";
  });

  jumb.addEventListener("click", () => {
    if (player.grounded == true) {
      player.speed.y = 0.125;
      player.grounded = false;
    }
  });

  shoot.addEventListener("click", () => {
    const currentShootTarget = cameraControl(camera, player, scene);
    player.shoot(currentShootTarget);
  });

  document.body.appendChild(run);
  document.body.appendChild(jumb);
  document.body.appendChild(shoot);
  document.body.appendChild(zoom);
}
