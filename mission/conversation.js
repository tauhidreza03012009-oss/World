import { writeInBoard } from "../engine/world/MissionBoard.js"
import {StateHandlers} from "./Keywords.js"
import {marking,deleteMesh} from "./marker.js"
import {cancel} from "./cancellation.js"

let pre=null;
let ins = document.getElementById("instact")

export function conversation(main,spch,btn1,btn2,player,mission,start,end){
  
  if(start===pre)return;
  
  else{ pre = start }
  marking()
  main.style.display = "flex";
  console.log(main,btn1,btn2)
  const currentDialogue = mission.description[start];
  if(start>end){
    let future= mission.description.filter(x=>x.req==mission.missionStat+1)[0]?.Board??"";
    ins.innerHTML=future
    mission.missionStat++;
    mission.conversation=false;
    pre=null;
    main.style.display = "none";
    return 0
    
  }
    if (currentDialogue ) {
      writeInBoard(currentDialogue.Board);

      if (currentDialogue.btnnext === "AUTO") {
        btn1.innerHTML = "NEXT"
        btn2.innerHTML = "EXIT"

        btn1.onclick = () => {
          mission.talkingStat++;
          conversation(main, spch, btn1, btn2, player,mission,start+1,end);
        };

        btn2.onclick = () => {
          main.style.display = "none";
          player.conversation = false;
          pre=null
          cancel(player,mission)
        };
      }

      if (currentDialogue.btnnext === "GAME") {
        btn1.innerHTML = "START";
        btn2.innerHTML = "EXIT"

        btn1.onclick = () => {
          conversation(main, spch, btn1, btn2, player,mission,start+1,end);
          main.style.display = "none";
          player.conversation = false;
          
        };

        btn2.onclick = () => {
          main.style.display = "none";
          player.conversation = false;
          pre=null
          cancel(player,mission)
        };
      }
    }
}