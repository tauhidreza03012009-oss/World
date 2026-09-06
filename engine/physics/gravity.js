export class Gravity {
  constructor({
    dir = { x: 0, y: -0.005, z: 0 },
    object = null
  } = {}) {
    this.value = dir;
    this.obj = object;
    this.ground = object?.ground;
  }

  charge(obj) {
    const spd = obj.speed;
    let rest = obj.size.h / 2 + this.ground.height(obj.position.x, obj.position.z);
    
    rest = Math.max(rest, -2);
    if (rest >= obj.position.y && spd.y <= 0.0) {
      obj.position.y = rest;
      spd.y = 0;
      obj.grounded = true;
      if(obj.jmp){obj.speed.z=0;obj.speed.x=0}
      obj.jmp = false;
    } else {
        spd.y += this.value.y;
    }
  }
}
