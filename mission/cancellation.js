import { writeInBoard } from "../engine/world/MissionBoard.js"
import { bringBack } from "./equipment.js"

export function cancel(player,mission,win=false){
  player.onmission=false;
  player.mission=null
  bringBack(player,mission,false)
  mission.missionStat=0
  mission.talkingStat=0
  writeInBoard("Hello world");
  mission.time=mission.timeTemp
  mission.completed=win
  mission.counting=false
}