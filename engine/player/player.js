import * as THREE from "three";
import { playerMesh,playAnimation,updatePlayerAnimation } from "./playerMesh.js";
import { setMapPosition } from "../control/map.js";
import { getCollidingObject } from "../physics/collision.js";
import { moveSingleCar } from "../world/car.js";
import { Speed } from "../../constant.js";

function returner(x, z) {
  if (z > 342.5 && z < 377.5) {
    if (x > 9.5 && x < 20.5) {
      return 18 - 0.5 * Math.abs(x - 15);
    }
  }
  return 0;
}

const shot = new THREE.Mesh(
  new THREE.CylinderGeometry(0.05, 0.05, 0.05),
  new THREE.MeshStandardMaterial({ color: 0x555555 })
);
shot.visible = false;

let obstacleCache = [];
let lastCacheTime = 0;

const groundRaycaster = new THREE.Raycaster();
const downVector = new THREE.Vector3(0, -1, 0);

export class Player {
  constructor({
    scene = null,
    object = null,
    position = { x: 130.0, y: 13, z: -120 },
    size = { w: 0.5, h: 1, l: 0.5 }
  } = {}) {
    this.moveSpeed = 7.5;
    this.maxPitch = Math.PI / 3;
    this.size = size;
    this.object = object;
    this.position = position;
    this.scene = scene;
    this.jmpAnim=false
    this.scene.add(shot);
    this.colliding=false;
    this.mesh = playerMesh(scene)
    this.currentAnimation="Man_Idle"
    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.castShadow = true;

    const carBoxGeo = new THREE.BoxGeometry(2.0, 1.0, 4.2);
    const carBoxMat = new THREE.MeshBasicMaterial({ visible: false });
    this.carCollider = new THREE.Mesh(carBoxGeo, carBoxMat);
    this.scene.add(this.carCollider);

    this.speed = { x: 0, y: 0, z: 0 };
    this.power = 100;
    this.stamina = 100;
    this.rotation = { x: 0, y: 0, z: 0 };
    this.running = false;
    this.rotspeed = { x: 0, y: 0, z: 0 };
    this.grounded = false;
    this.jmp = false;

    this.driving = false;
    this.vehicle = null;
    this.resolvedCarMeshes = null;

    this.shooting = false;
    this.shotSpeed = 1.5;
    this.shotDirection = new THREE.Vector3();
    this.shootTarget = new THREE.Vector3();

    this.maintain(0);
  }

  setDriving(isDriving, vehicleInstanceId = null) {
    this.driving = isDriving;
    this.vehicle = vehicleInstanceId;
    lastCacheTime = 0;
    obstacleCache = [];
  }

  jump() {
    if (this.grounded && !this.driving) {
      this.speed.y = 0.35;
      this.grounded = false;
      this.jmp = false;
    }
  }

  update(dt, gravity) {
    if (gravity && typeof gravity.charge === "function") {
      gravity.charge(this);
    }

    this.updateShot();
    this.maintain(dt);
  }

  updateShot() {
    if (!this.shooting) return;

    shot.position.addScaledVector(this.shotDirection, this.shotSpeed);

    const distanceToTarget = shot.position.distanceTo(this.shootTarget);
    if (distanceToTarget < this.shotSpeed) {
      shot.position.copy(this.shootTarget);
      shot.visible = false;
      this.shooting = false;
    }
  }

  isPlayerMesh(obj) {
    let current = obj;
    while (current) {
      if (current === this.mesh || current === this.carCollider) return true;
      current = current.parent;
    }
    return false;
  }

  maintain(dt = 0) {
    if (!this.resolvedCarMeshes && this.object?.car) {
      if (this.object.car instanceof Promise) {
        this.object.car.then((meshes) => {
          this.resolvedCarMeshes = meshes;
        });
      } else {
        this.resolvedCarMeshes = this.object.car;
      }
    }

    const now = performance.now();

    if (now - lastCacheTime > 1000) {
      obstacleCache = [];
      const groundMesh = this.object?.ground?.mesh;

      this.scene.traverse((child) => {
        if (
          (child.isMesh || child.isInstancedMesh) &&
          !this.isPlayerMesh(child) &&
          child !== groundMesh &&
          child !== shot &&
          child.name !== "TREE" &&
          child.name !== "Bushes" &&
          child.name !== "T" &&
          child.name !== "G" &&
          child.name !== "CUSTOM_WIRE"
        ) {
          obstacleCache.push(child);
        }
      });
      lastCacheTime = now;
    }

    this.rotspeed.x *= 0.9;
    this.rotspeed.y *= 0.9;
    this.rotspeed.z *= 0.9;

    this.rotation.x += this.rotspeed.x;
    this.rotation.y += this.rotspeed.y;
    this.rotation.z += this.rotspeed.z;

    const yaw = this.rotation.y;
    const spd = this.speed;

    let moveX = 0;
    let moveZ = 0;
    let xch=false
    let zch=false

    if (this.driving) {
      spd.x = 0;
      spd.z = Speed.car * 0.75;

      moveX = Math.sin(yaw) * spd.z * dt;
      moveZ = Math.cos(yaw) * spd.z * dt;
    } else if (this.jmp) {
      moveX = spd.x;
      moveZ = spd.z;
    } else {
      moveX = (spd.x * Math.cos(yaw) + spd.z * Math.sin(yaw)) * this.moveSpeed * dt;
      moveZ = (-spd.x * Math.sin(yaw) + spd.z * Math.cos(yaw)) * this.moveSpeed * dt;
    }

    const pos = this.position;
    const activeMesh = this.driving ? this.carCollider : this.mesh;
    const hitTolerance = this.driving ? 0.8 : 0.3;
    const ignoreInstance = this.driving ? this.vehicle : null;

    pos.x += moveX;

    if (this.driving) {
      this.carCollider.position.set(pos.x, pos.y + 0.3, pos.z);
      this.carCollider.rotation.y = yaw;
      this.carCollider.updateMatrixWorld(true);
    } else {
      this.mesh.position.x = pos.x;
      this.mesh.rotation.y = yaw;
      this.mesh.updateMatrixWorld(true);
    }
    xch=true;
    let xHit = getCollidingObject(activeMesh, obstacleCache, hitTolerance, ignoreInstance);
    if (xHit) {
      if (xHit.name === "mvabl") {
        let y = returner(pos.x, pos.z);
        if (y) {
          pos.y = y + 0.55;
          this.grounded = true;
        }
      } else if (xHit.name === "TIRE") {
        this.jmp = true;
        this.grounded = false;
        this.speed.x = 0.075;
        this.speed.z = 0;
        this.speed.y = 0.34;
      } else {
        pos.x -= moveX;
        if (this.driving) {
          this.carCollider.position.x = pos.x;
          this.carCollider.updateMatrixWorld(true);
          Speed.car = 0;
          this.colliding=true
          xch=false
        } else {
          this.mesh.position.x = pos.x;
          this.mesh.updateMatrixWorld(true);
        }
      }
    }

    pos.z += moveZ;
    zch=true
    if (this.driving) {
      this.carCollider.position.set(pos.x, pos.y + 0.3, pos.z);
      this.carCollider.rotation.y = yaw;
      this.carCollider.updateMatrixWorld(true);
    } else {
      this.mesh.position.z = pos.z;
      this.mesh.rotation.y = yaw;
      this.mesh.updateMatrixWorld(true);
    }

    let zHit = getCollidingObject(activeMesh, obstacleCache, hitTolerance, ignoreInstance);
    if (zHit) {
      if (zHit.name === "mvabl") {
        let y = returner(pos.x, pos.z);
        if (y) {
          pos.y = y + 0.55;
          this.grounded = true;
        }
      } else if (zHit.name === "TIRE") {
        this.jmp = true;
        this.grounded = false;
        this.speed.x = 0.075;
        this.speed.z = 0;
        this.speed.y = 0.34;
      } else {
        pos.z -= moveZ;
        if (this.driving) {
          this.carCollider.position.z = pos.z;
          this.carCollider.updateMatrixWorld(true);
          Speed.car = 0;
          zch=false
          this.colliding=true;
        } else {
          this.mesh.position.z = pos.z;
          this.mesh.updateMatrixWorld(true);
        }
      }
    }
    if(xch && zch)this.colliding=false;
    if (!this.grounded) {
      pos.y += spd.y;
      this.mesh.position.y = pos.y;
      this.mesh.updateMatrixWorld(true);
      const yHit = getCollidingObject(this.mesh, obstacleCache, 0.0, ignoreInstance);
      if (yHit) {
        if (yHit.name === "TIRE") {
          this.jmp = true;
          this.grounded = false;
          this.speed.x = 0.075;
          this.speed.z = 0;
          this.speed.y = 0.34;
        } else if (spd.y <= 0) {
          if (!this.vehicle) {
            pos.y -= spd.y;
            this.speed.y = 0;
            this.grounded = true;
            this.jmp = false;
          }
        }
      }
    }

    let maxGroundY = -Infinity;

    if (spd.y <= 0) {
      if (this.object && this.object.ground) {
        maxGroundY = this.object.ground.height(pos.x, pos.z);
      }

      if (obstacleCache.length > 0) {
        groundRaycaster.set(new THREE.Vector3(pos.x, pos.y + 0.5, pos.z), downVector);
        groundRaycaster.far = 2.0;
        const intersects = groundRaycaster.intersectObjects(obstacleCache, true);

        if (intersects.length > 0) {
          const ptY = intersects[0].point.y;
          if (ptY > maxGroundY) {
            maxGroundY = ptY;
          }
        }
      }

      if (maxGroundY !== -Infinity) {
        const targetPosY = maxGroundY + this.size.h / 2;
        if (pos.y - this.size.h / 2 <= maxGroundY + 0.2) {
          pos.y = targetPosY;
          this.speed.y = 0;
          this.grounded = true;
          this.jmp = false;
          this.jum = false;
        } else {
          this.grounded = false;
        }
      } else {
        this.grounded = false;
      }
    }

    this.mesh.position.set(pos.x, pos.y, pos.z);
    this.mesh.rotation.y = this.rotation.y;
    this.mesh.updateMatrixWorld(true);
    
    if (this.driving) {
      this.carCollider.position.set(pos.x, pos.y + 0.3, pos.z);
      this.carCollider.rotation.y = this.rotation.y;
      this.carCollider.updateMatrixWorld(true);
    }

    const lookAtY = this.vehicle !== null ? pos.y + 12 : pos.y + 6;
    const distance = 7.5;

    let minHeight = 0;
    if (this.object && this.object.ground) {
      const camX = pos.x - Math.sin(yaw) * distance;
      const camZ = pos.z - Math.cos(yaw) * distance;
      minHeight = this.object.ground.height(camX, camZ) + 2;
    }

    const maxUpAngle = Math.asin(
      Math.min(0.99, Math.max(-0.99, (lookAtY - minHeight) / distance))
    );

    this.rotation.x = Math.max(-this.maxPitch, Math.min(maxUpAngle, this.rotation.x));

    setMapPosition(-this.mesh.position.x * 5 / 2, -this.mesh.position.z * 10 / 4, this.rotation.y);
    
    if(this.speed.x||this.speed.z){
      if(this.jum){playAnimation(this.currentAnimation,"Man_RunningJump");this.currentAnimation="Man_RunningJump"}
      else {playAnimation(this.currentAnimation,"Man_Run");this.currentAnimation="Man_Run"}
    }
    else{
        if(this.jum){playAnimation(this.currentAnimation,"Man_Jump");this.currentAnimation="Man_Jump"}
        else {playAnimation(this.currentAnimation,"Man_Idle");this.currentAnimation="Man_Idle"}
    }
    updatePlayerAnimation(this.mesh.mixer)
    if (this.vehicle !== null && this.vehicle !== undefined && this.resolvedCarMeshes) {
      moveSingleCar(
        this.resolvedCarMeshes,
        this.vehicle,
        new THREE.Vector3(this.position.x, this.position.y, this.position.z),
        this.rotation.y
      );
    }
  }

  shoot(targetPoint) {
    if (!targetPoint) return;
    console.log("Viewport Width: " + window.innerWidth + "px");
console.log("Viewport Height: " + window.innerHeight + "px");
    const origin = new THREE.Vector3(this.position.x, this.position.y + 0.7, this.position.z);
    this.shootTarget.copy(targetPoint);
    this.shotDirection.subVectors(this.shootTarget, origin).normalize();
    shot.position.copy(origin);
    shot.visible = true;
    this.shooting = true;
    console.log(this.position.x, this.position.z);
  }
}
