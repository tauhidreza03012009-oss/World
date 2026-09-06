import { joyStick } from "./joystick.js";
import { createMap,runner } from "./map.js";

const movement = {};
export function initControls(player, camera, scene, object) {
  createMap()
  runner(camera,player,scene)
  const viewPort = document.getElementById("myCanvas");
  const rot = player.rotspeed;
  const spd = player.speed;
  
  let btns = joyStick();
  const maxRadius = 70;

  function jsStart(e) {
    btns[1].setPointerCapture(e.pointerId);
    movement[e.pointerId] = {
      sx: e.clientX,
      sy: e.clientY,
      type: 'joystick'
    };
  }
  
  function touchStart(e) {
  
    movement[e.pointerId] = {
      sx: e.clientX,
      sy: e.clientY,
      type: 'screen'
    };
  }

  function touchMove(e) {
    let pointer = movement[e.pointerId];
    if (!pointer) return;

    let mx = e.clientX - pointer.sx;
    let my = e.clientY - pointer.sy;

    if (pointer.type === "joystick") {
      let dist = Math.hypot(mx, my);
      let angle = Math.atan2(my, mx);

      if (dist > maxRadius) {
        mx = Math.cos(angle) * maxRadius;
        my = Math.sin(angle) * maxRadius;
      }

      if(!player.jmp){spd.x = -mx*0.5 / maxRadius;
      spd.z = -my*0.5 / maxRadius;}

      btns[0].style.transform = `translate(${mx}px, ${my}px)`;
    }
    else if (pointer.type === "screen") {
      if (my > 5 || my < -5) rot.x += my*camera.fov*camera.fov / 36000000;
      if (mx > 5 || mx < -5) rot.y += mx*camera.fov*camera.fov / 21600000;
    }
  }

  function touchEnd(e) {
    let pointer = movement[e.pointerId];
    if (pointer) {
        if (pointer.type === 'joystick') {
        if(!player.jmp){spd.x = 0;
        spd.z = 0;}
        btns[0].style.transform = `translate(0px, 0px)`;
        btns[1].releasePointerCapture(e.pointerId);
      } 
    }
    delete movement[e.pointerId];
  }

  viewPort.addEventListener("pointerdown", touchStart);
  btns[1].addEventListener("pointerdown", jsStart);
  window.addEventListener("pointermove", touchMove);
  window.addEventListener("pointerup", touchEnd);
  window.addEventListener("pointercancel", touchEnd);
}