import * as THREE from "three";
import { joyStick } from "./joystick.js";
import { createMap, runner } from "./map.js";
import { rider } from "./vehicle.js";
import { Sensitivity, Speed } from "../../constant.js";
import { getClickedObjectOnUp } from './reycast.js';
import { moveSingleCar } from '../world/car.js';
import { writeInBoard } from '../world/MissionBoard.js';
import { data } from "../../Info/yourself.js";
import { mission } from "../../mission/manager.js";

let btnst = null;
const movement = {};

export function initControls(player, camera, scene, object) {
  createMap();
  let bt = runner(camera, player, scene);
  let btn1 = document.getElementById("div1");
  let btn2 = document.getElementById("div2");
  const viewPort = document.getElementById("myCanvas");
  const sense = document.getElementById("sense");
  const zoomsense = document.getElementById("zoomsense");
  const talk = document.getElementById("talker");
  const spch = document.getElementById("speech");

  let activeCarPos = null;
  let activeInstanceId = null;

  sense.addEventListener("input", e => {
    let num = e.target.value;
    Sensitivity["NORM"] = num;
    localStorage.setItem("custom_sense", JSON.stringify(Sensitivity));
  });

  zoomsense.addEventListener("input", e => {
    let num = e.target.value;
    Sensitivity["ZOOM"] = num;
    localStorage.setItem("custom_sense", JSON.stringify(Sensitivity));
  });

  const rot = player.rotspeed;
  const spd = player.speed;
  
  let btns = joyStick();
  const maxRadius = 70;

  function jsStart(e) {
    e.stopPropagation();
    e.preventDefault();
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

  function checkCarDistance() {
    if (!activeCarPos || player.driving) return;
    const distance = player.mesh.position.distanceTo(activeCarPos);
    if (distance > 7) {
      const getonBtn = document.getElementById("geton");
      if (getonBtn) getonBtn.style.display = "none";
      activeCarPos = null;
      activeInstanceId = null;
    }
  }

  function touchMove(e) {
    checkCarDistance();

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

      if (!player.jmp) {
        spd.x = -mx * 0.5 / maxRadius;
        spd.z = -my * 0.5 / maxRadius;
      }
      
      btns[0].style.transform = `translate(${mx}px, ${my}px)`;
    } 
    else if (pointer.type === "screen") {
      let Sense = (camera.fov > 30) ? Sensitivity["NORM"] : Sensitivity['NORM'] * Sensitivity["ZOOM"];
      if (my > 5 || my < -5) rot.x += my * camera.fov * camera.fov * Sense / 36000000;
      if (mx > 5 || mx < -5) rot.y += mx * camera.fov * camera.fov * Sense / 21600000;
    }
  }

  function touchEnd(e) {
    let pointer = movement[e.pointerId];
    if (pointer) {
      if (pointer.type === 'joystick') {
        if (!player.jmp) {
          spd.x = 0;
          spd.z = 0;
        }
        btns[0].style.transform = `translate(0px, 0px)`;
        try {
          btns[1].releasePointerCapture(e.pointerId);
        } catch (err) {}
      } 
    }
    delete movement[e.pointerId];
  }

  bt[4].addEventListener("click", () => {
    if (!activeCarPos || activeInstanceId === null) return;

    player.position.x = activeCarPos.x;
    player.position.y = activeCarPos.y + 2;
    player.position.z = activeCarPos.z;

    player.setDriving(true, activeInstanceId);

    btns[1].style.display = "none";
    
    ["run", "jump", "shoot", "zoom", "geton"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });

    if (!btnst) {
      btnst = rider(camera, player, scene);
      btnst[0].addEventListener("click", (e) => {
        const isMission = e.currentTarget.dataset.fromMission === "true";
        
        btnst.forEach(x => x.style.display = "none");

        ["run", "jump", "shoot", "zoom"].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = "flex";
        });

        const getonBtn = document.getElementById("geton");
        if (getonBtn) getonBtn.style.display = "none";

        if (!isMission) {
          moveSingleCar(
            player.resolvedCarMeshes,
            player.vehicle,
            new THREE.Vector3(player.position.x, player.position.y - 0.5, player.position.z),
            player.rotation.y
          );
          player.position.y += 3;
        }
        
        player.setDriving(false, null);
        btns[1].style.display = "block";
        player.speed.x = 0;
        player.speed.z = 0;
        activeCarPos = null;
        activeInstanceId = null;
        e.currentTarget.dataset.fromMission = "false";
      });
    }
    btnst.forEach(x => x.style.display = "flex");
  });

  viewPort.addEventListener("pointerdown", touchStart);
  btns[1].addEventListener("pointerdown", jsStart);
  
  window.addEventListener("pointerup", (e) => {
    if (player.driving) return;

    const clickedObj = getClickedObjectOnUp(camera, scene, e);
    if (!clickedObj) return;

    let hit = clickedObj.object;
    const objectName = hit.name || clickedObj.object.name;

    if (objectName === "BOARD" && clickedObj.distance < 7) {
      if (player.conversation) {
        return;
      } else {
        let missionname = mission();
        if (missionname) {
          talk.style.display = "flex";
          player.conversation = true;
          player.mission = missionname;
          player.mission.step(talk, spch, btn2, btn1, player);
          writeInBoard(`Hello ${data.name}, today's missions :`);
        } else {
          writeInBoard("No mission available, today");
        }
      }
    }

    if (objectName === "Car" && clickedObj.distance < 7) {
      const instancedMesh = clickedObj.object;
      const instanceId = clickedObj.instanceId;

      const matrix = new THREE.Matrix4();
      instancedMesh.getMatrixAt(instanceId, matrix);

      const position = new THREE.Vector3();
      position.setFromMatrixPosition(matrix);

      activeCarPos = position;
      activeInstanceId = instanceId;
      const getonBtn = document.getElementById("geton");
      if (getonBtn) getonBtn.style.display = "flex";
    }
  });

  window.addEventListener("pointermove", touchMove);
  window.addEventListener("pointerup", touchEnd);
  window.addEventListener("pointercancel", touchEnd);
}
