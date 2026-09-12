export const places = {
  "CITY DELI":{
    id: "city_deli",
    name: "CITY DELI",
    x: 82,
    y: 10,
    z: -45,
    size: { x: 8, y: 6, z: 10 },
    district: "Downtown"
  },
   "PARKING":{
    id: "parking",
    name: "PARKING",
    x: 155,
    y: 9,
    z: -110,
    size: { x: 70, y: 60, z: 100 },
    district: "Downtown"
  },
  "BRIDGE":{
    id: "bridge",
    name: "East Bridge",
    x: 115,
    y: 9,
    z: 224,
    size: { x: 10, y: 60, z: 120 },
    district: "River"
  },
  "BOARD":{
    id: "parking",
    name: "PARKING",
    x: 124,
    y: 9,
    z: -154,
    size: { x: 5, y: 60, z: 5 },
    district: "Downtown"
  }
}

export function returnPlace(player,posi){
  let pos=player.position;
  let pl= places[posi]??dataMaker(posi)
  if(Math.abs(pos.x-pl.x)>pl.size.x/2)return false;
  if(Math.abs(pos.y-pl.y)>pl.size.y/2)return false;
  if(Math.abs(pos.z-pl.z)>pl.size.z/2)return false;

  return true
}

function dataMaker(data){
  return{
    x: data?.x??0,
    y: data?.y??10,
    z: data?.z??0,
    size: { x: data?.l??2, y: 60, z: data?.w??2 },
  }
}