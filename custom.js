import { BTN } from "./constant.js";

const mine = document.getElementById("custom");
let movement = {};
let selected= null;
let turn= null

export function customWindow(btn) {
  mine.innerHTML = "";
  mine.style.display = "block";

  const run = document.createElement("div");
  const jumb = document.createElement("div");
  const shoot = document.createElement("div");
  const zoom = document.createElement("div");
  const get = document.createElement("div");
  const box = document.createElement("div");

  run.className = "run";
  run.id = "run";
  get.className = "getter";
  get.innerText = "<—";
  jumb.className = "run";
  shoot.className = "run";
  zoom.className = "run";
  box.className="bx"

  run.innerHTML = "RUN";
  jumb.innerHTML = "JUMP";
  shoot.innerHTML = "SHOT";
  zoom.innerHTML = "ZOOM";

  [run, jumb, zoom, shoot].forEach((x) => {
    let inf = BTN[x.innerHTML];

    x.style.position = "absolute";
    x.style.height = `${inf.height}px`;
    x.style.width = `${inf.width}px`;
    x.style.bottom = `${inf.bottom}%`;
    x.style.left = `${inf.left}%`;
    x.style.opacity = inf.opacity;

    x.addEventListener("pointerdown", (e) => {
      selected=x;
      turn=showSelect(box)

      touchStart(e, x);
    });
  });

  document.addEventListener("pointermove", touchMove);
  document.addEventListener("pointerup", touchEnd);
  document.addEventListener("pointercancel", touchEnd);

  get.addEventListener("click", () => {
    btn.style.display = "flex";
    mine.style.display = "none";
  });

  mine.append(run, jumb, shoot, zoom, get,box);
}

function touchStart(e, btn) {
  btn.setPointerCapture(e.pointerId);

  movement[e.pointerId] = {
    elem: btn,
    key: btn.innerHTML
  };
}

function touchMove(e) {
  let pointer = movement[e.pointerId];
  if (!pointer) return;

  const { elem, key } = pointer;

  const leftPercent = (e.clientX / window.innerWidth) * 100;
  const bottomPercent = ((window.innerHeight - e.clientY) / window.innerHeight) * 100;

  elem.style.left = `${leftPercent}%`;
  elem.style.bottom = `${bottomPercent}%`;

  BTN[key].left = leftPercent;
  BTN[key].bottom = bottomPercent;
}

function touchEnd(e) {
  if (movement[e.pointerId]) {
    try {
      movement[e.pointerId].elem.releasePointerCapture(e.pointerId);
    } catch (err) {}
    delete movement[e.pointerId];

    localStorage.setItem("custom_btn_positions", JSON.stringify(BTN));
  }
}


function showSelect(x){
  x.style.display="flex";
  x.innerHTML=`
  <h2>${selected.innerHTML}</h2>
  <input type="range" id="volume" name="volume" min="10" max="200" value="${BTN[selected.innerHTML].height}" step="0.5">
  <input type="range" id="volume2" name="volume" min="0.1" max="1.0" value="${BTN[selected.innerHTML].opacity}" step="0.005">
  `
  console.log(x)
  let turn =document.getElementById("volume")
  turn.addEventListener("input",(e)=>{
    let num= e.target.value
    BTN[selected.innerHTML].height=num
    BTN[selected.innerHTML].width=num
    selected.style.height = `${num}px`;
    selected.style.width = `${num}px`;
  })
  let turn2 =document.getElementById("volume2")
  turn2.addEventListener("input",(e)=>{
    let num= e.target.value
    BTN[selected.innerHTML].opacity=num
    selected.style.opacity = num;
  })
  return turn
  }