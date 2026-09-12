import { writeInBoard } from "../engine/world/MissionBoard.js"
import { returnPlace } from "./places.js"
import { rewardgiver } from "./manager.js"


export const mission_1 = {
  idno: 2,
  id: "bridge_test",
  experience: 500,
  money: 100,
  times: 1,
  levelRequirement: 1,
  stateRequirement: ["DRIVING","WALKING","DRIVING"],
  startPos: "PARKING",
  type: ["DRIVE", "TIME MANAGEMENT"],
  endPos: "PARKING",
  path: ["PARKING", "BRIDGE", "PARKING"],
  talkingStat: 0,
  missionStat: 0,
  completed: false,
  outable:true,
    description: [
    { Board: "Hey there, You have to inspect....", req: 0, btnnext: "AUTO" },
    { Board: "Just go to the bridge.....", req: 0, btnnext: "AUTO" },
    { Board: "inspect any problem.....", req: 0, btnnext: "AUTO" },
    { Board: "and My car is expensive....", req: 0, btnnext: "AUTO" },
    { Board: "try to not hurt it at all.", req: 0, btnnext: "GAME" },
    { Board: "Damn bro, that was clean. Not just car, you are good too", req: 1, btnnext: "AUTO" },
    { Board: "Here is your promised money", req: 1, btnnext: "END" }
  ],
chat: [
    {
      text: "Go ahead",
      btns: [
        { text: "Next", onclick: true },
        { text: "End", onclick: false }
      ]
    }
  ],
  
step(main, spch, btn1, btn2, player) {
    const currentDialogue = this.description[this.talkingStat];

    if (currentDialogue && currentDialogue.req === this.missionStat) {
      writeInBoard(currentDialogue.Board);

      if (currentDialogue.btnnext === "AUTO") {
        btn1.innerHTML = this.chat[0].btns[0].text;
        btn2.innerHTML = this.chat[0].btns[1].text;

        btn1.onclick = () => {
          this.talkingStat++;
          this.step(main, spch, btn1, btn2, player);
        };

        btn2.onclick = () => {
          main.style.display = "none";
          player.conversation = false;
          this.talkingStat = 0;
          writeInBoard("Hello world");
        };
      }

      if (currentDialogue.btnnext === "GAME") {
        btn1.innerHTML = "Start";
        btn2.innerHTML = this.chat[0].btns[1].text;

        btn1.onclick = () => {
          player.onmission = true;
          main.style.display = "none";
          player.conversation = false;
          this.missionStat=1;
          
        };

        btn2.onclick = () => {
          main.style.display = "none";
          this.talkingStat = 0;
          player.conversation = false;
          writeInBoard("Hello world");
        };
      }
    }
  },
}