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
  const geton = document.createElement("div");
  const get1 = document.createElement("div");
  const get2 = document.createElement("div");
  const get3 = document.createElement("div");
  const get4 = document.createElement("div");

  run.className = "run";
  run.id = "run";
  get.className = "getter";
  get.innerText = "<—";
  jumb.className = "run";
  shoot.className = "run";
  zoom.className = "run";
  geton.className = "run";
  get1.className = "run";
  get2.className = "sq";
  get3.className = "run";
  get4.className = "sq";
  box.className="bx"

  run.innerHTML = "RUN";
  jumb.innerHTML = "JUMP";
  shoot.innerHTML = "SHOT";
  zoom.innerHTML = "ZOOM";
  geton.innerHTML = "GET";
  get1.innerHTML = "OUT";
  get2.innerHTML = "SPEED";
  get3.innerHTML = "HORN";
  get4.innerHTML = "BREAK";
  
  [run, jumb, zoom, shoot,geton,get1,get2,get3,get4].forEach((x) => {
    let inf = BTN[x.innerHTML];
    let k=(x.className=="sq")?0.5:1;
    x.style.position = "absolute";
    x.style.height = `${inf.height}px`;
    x.style.width = `${inf.width*k}px`;
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

  mine.append(run, jumb, shoot, zoom, get,box,geton,get1,get2,get3,get4);
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
    let wn=(selected.className=="sq")?num*0.5:num
    BTN[selected.innerHTML].height=num
    BTN[selected.innerHTML].width=wn;
    selected.style.height = `${num}px`;
    selected.style.width = `${wn}px`;
  })
  let turn2 =document.getElementById("volume2")
  turn2.addEventListener("input",(e)=>{
    let num= e.target.value
    BTN[selected.innerHTML].opacity=num
    selected.style.opacity = num;
  })
  return turn
  }