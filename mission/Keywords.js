export const StateHandlers = {
  "DRIVING": (player) => {
    if(player.driving)return true;
    return false;
  },
  "COLLID": (player) => {
    if(player.colliding)return true;
    return false;
  },
  "VEHICLE": (player, data) =>{
    if(player.vehicle==data)return true;
    return false;
    },
};