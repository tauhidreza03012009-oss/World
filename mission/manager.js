import {mission_1} from "./mission1.js"
import {returnPlace,places} from "./places.js"
import {data} from "../Info/yourself.js"
import {StateHandlers} from "./Keywords.js"
import {cancel} from "./cancellation.js"
import {marking,deleteMesh} from "./marker.js"
import {scene} from "../engine/main.js"
import { conversation } from "./conversation.js"

let diver = document.getElementById("counter")
let ins = document.getElementById("instact")
let div = document.getElementById("count")
let missionAvailable = [[],[mission_1]]
let reward = document.getElementById("reward")
let rewardbtn = document.getElementById("accept")
let rewardtext = document.getElementById("rewpoi")

export function mission(){
  let missions = missionAvailable[data.level]
  missions = missions.filter(x=>!data.missionIds.includes(x.idno))
  return missions[0]
}

export function rewardgiver(rewards){
  reward.style.display="flex";
  div.style.display="none"
  rewardtext.innerHTML=`You have got ${rewards.money} money`
  rewards.completed=true
  rewardbtn.onclick=()=>{
    reward.style.display="none"
    data.money+=rewards.money
    data.experience+=rewards.experience
    
    data.missionIds.push(rewards.idno)
    localStorage.setItem("pl",JSON.stringify(data))
  }
}

export function stateManager(player,mission,dt){
  let state=mission.missionFlow[mission.missionStat]
  let future= mission.description.filter(x=>x.req==mission.missionStat+1)[0]?.Board??"";
  if(state.state=="START"){mission.missionStat=1;ins.innerHTML=future;diver.style.display="flex"}
  else if(state.state=="CONVERSATION"&&!mission.conversation){conversation(...mission.usables,state.start,state.end);mission.conversation=true;}
  else if(state.state=="WALK")walker(player,state,mission,future);
  else if(state.state=="DRIVING")driver(player,state,mission,future);
  else if(state.state=="END"){cancel(player,mission,true);rewardgiver(mission);deleteMesh(scene);diver.style.display="none"}
  if(!status(player,state.statNeeded??[],state.forbidden??[])){cancel(player,mission,false);diver.style.display="none";deleteMesh(scene);div.style.display="none";this.counting=false}
  if(state.countdown!==null)counter(state.countdown,player,mission,dt);
}

function walker(player,data,mission,future){
  if(data.destinetype=="STATE"){
    
    let stateName=data.destine
    let func=StateHandlers[stateName]
    let flag= func(player)
    marking(scene,"out",0,10000,0,0,0,0)
    for(let i of data.destExtra){
      let func=StateHandlers[i.type]
      flag= func(player,...i.params)
      if(!flag) return 0;
    }
    if(flag){mission.missionStat++;ins.innerHTML=future}
  }
  
  if(data.destinetype=="PLACE"){
    let place= data.destine
    let pl=places[place]
    marking(scene,place,pl.x,pl.y,pl.z,pl.size.x,pl.size.y,pl.size.z)
    if(returnPlace(player,place)){console.log('okey');mission.missionStat++;ins.innerHTML=future}
  }
}

function driver(player,data,mission,future){
  
  if(data.destinetype=="PLACE"){
    let place= data.destine
    let pl=places[place]
    marking(scene,place,pl.x,pl.y,pl.z,pl.size.x,pl.size.y,pl.size.z)
    if(returnPlace(player,place)){mission.missionStat++;ins.innerHTML=future}
  }
}

function counter(inst,player,mission,dt){
  
  if(inst=="START" && !mission.counting){
    
    div.style.display="flex";
    mission.time=mission.timeTemp
    mission.counting=true
    div.innerHTML=Math.floor(mission.time)
  }
  else if(inst=="END"){
    div.style.display="none";
    mission.time=mission.timeTemp
    mission.counting=false;
  
  }
 else if(inst=="RESUME"||mission.counting){
   mission.counting=true;
   mission.time-=dt
   if(mission.time<=0){
      mission.counting = false;
      diver.style.display = "none";
      div.style.display = "none";
      mission.time = mission.timeTemp;
      cancel(player, mission, false);
      deleteMesh(scene)
      return;
   }
   div.innerHTML=Math.floor(mission.time)
 }
 
 else if(inst=="TACTIC"){
    div.style.display="flex";
    mission.time=mission.timeTemp
    mission.missionStat++;
}
 else if(inst=="PAUSE"){
   mission.counting=false;
 }
}

function status(player,states=[],negs=[]){
  let k=null
  for(let i of states){
    k=StateHandlers[i]
    if(!k(player))return false
  }
  for(let i of negs){
    k=StateHandlers[i]
    if(k(player))return false
  }
  return true
}