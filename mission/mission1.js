import { conversation } from "./conversation.js"
import { stateManager} from "./manager.js"
import { bringBack } from "./equipment.js"

export const mission_1 = {
  idno: 1,
  id: "car_test",
  experience: 500,
  money: 100,
  times: 1,
  levelRequirement: 1,
  stateRequirement: ["DRIVING"],
  startPos: "PARKING",
  type: ["DRIVE", "TIME MANAGEMENT"],
  endPos: "PARKING",
  path: ["PARKING", "BRIDGE", "PARKING"],
  time: 40,
  equipment:[{type:"car",index:4,x:150,y:10,z:-145},
             {type:"npc",id:1000,x:130,y:11,z:-145}],
  counting:false,
  timeTemp:40,
  talkingStat: 0,
  missionStat: 0,
  completed: false,
  conversation:false,
  missionFlow:[
    {state:"START"},
    {state:"CONVERSATION",start:0,end:4},
    {state:"WALK",destinetype:"STATE",destine:"DRIVING",destExtra:[{type:"VEHICLE",params:[4]}],neglectable:false},
    {state:"DRIVING",destinetype:"PLACE",destine:"BRIDGE",neglectable:false,countdown:"START",statNeeded:["DRIVING"],forbidden:["COLLID"]},
    {state:"DRIVING",destinetype:"PLACE",destine:"PARKING",neglectable:false,countdown:"RESUME",statNeeded:["DRIVING"]},
    {state:"WALK",destinetype:"PLACE",destine:"BOARD",neglectable:true,countdown:"END"},
    {state:"CONVERSATION",start:9 ,end:9,neglectable:true,countdown:"END"},
    {state:"END"}
  ],
  description: [
    { Board: "Hey there, You have to test my car....", req: 0, btnnext: "AUTO" },
    { Board: "Just go to the bridge.....", req: 0, btnnext: "AUTO" },
    { Board: "return to my this parking.....", req: 0, btnnext: "AUTO" },
    { Board: "Time is limited....", req: 0, btnnext: "AUTO" },
    { Board: "you have to do it within 40 secounds.", req: 0, btnnext: "GAME" },
    { Board: "Get into the car.", req: 2, btnnext: "GAME" },
    { Board: "Go to the bridge.", req: 3, btnnext: "GAME" },
    { Board: "Come back to the parking.", req: 4, btnnext: "GAME" },
    { Board: "Come back to the board.", req: 5, btnnext: "GAME" },
    { Board: "Well done. here's your promiseed money", req: 0, btnnext: "AUTO" },
  ],

  step(main, spch, btn1, btn2, player) {
    player.onmission = true
    bringBack(player,this,true)
    this.usables=[main,spch,btn1,btn2,player,this]
  },

  start(player, dt) {
    stateManager(player,this,dt)
      }
};