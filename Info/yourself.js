//======================DATA=======================//

let defaultValue ={
    name:"PLAYER",
    id:1012743,
    level:1,
    experience:0,
    money:1000,
    stage:"AMETURE",
    missionsCompleted:0,
    missionIds:[]
 }

let value= localStorage.getItem("pl")

export let data = value ? JSON.parse(value) : defaultValue;