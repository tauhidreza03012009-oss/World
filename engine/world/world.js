import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { Ground } from "./ground.js";
import { Box } from "./test.js";
import { Tower } from "./tower.js";
import { Room } from "./room.js";
import { Chair } from "./chair.js";
import { jumper } from "./jumper.js";
import { Cont } from "./cont.js";
import { NPC } from "./class.js";
import { bushes } from "./bush.js";
import { Bridge } from "./bridge.js";
import { createInstancedTrees } from "./tree.js";
import { createInstancedFences } from "./fence.js";
import { createInstancedLamps } from "./lamppost.js";
import { createInstancedCarsFromGLTF } from "./car.js";
import { whiteboard, writeInBoard  } from "./MissionBoard.js";

const textureLoader = new THREE.TextureLoader();
const hp = textureLoader.load('./public/hosp.jpg');
let bd = new THREE.MeshBasicMaterial({ map: textureLoader.load('./public/build.jpg') });
let mw = new THREE.MeshBasicMaterial({ map: textureLoader.load('./public/Mwall.jpg') });
let multi = new THREE.MeshBasicMaterial({ map: textureLoader.load('./public/multi.jpg') });
let bar = new THREE.MeshBasicMaterial({ map: textureLoader.load('./public/bar.jpg') });
let office = new THREE.MeshBasicMaterial({ map: textureLoader.load('./public/office.jpg') });
let resident = new THREE.MeshBasicMaterial({ map: textureLoader.load('./public/resident.jpg') });
const tin = textureLoader.load('./public/tin.jpg');
const norm = new THREE.MeshBasicMaterial({ color: 0x488e84 });
const flur= new THREE.MeshBasicMaterial({ color: 0x999999 });
let h=textureLoader.load('./public/park.png')
h.center.set(0.5, 0.5);
h.rotation = -Math.PI / 2;
const flr = new THREE.MeshBasicMaterial({ map: h});

let tn = new THREE.MeshBasicMaterial({ map: tin });
const fnl = new THREE.MeshStandardMaterial({ map: hp });

const materials = [
  new THREE.MeshBasicMaterial({ map: textureLoader.load('./public/colfr.jpg') }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load('./public/colbr.jpg') }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load('./public/colrf.jpg') }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load('./public/colsd.jpg') }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load('./public/colsd.jpg') }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load('./public/colsd.jpg') })
];

function createSeparateBoxes(scene, boxesData, material) {
  const meshes = [];
  boxesData.forEach(({ pos, size, rotZ, rotY, mats, name }) => {
    const geo = new THREE.BoxGeometry(...size);
    const useMat = mats || material;
    const mesh = new THREE.Mesh(geo, useMat);
    if (name) mesh.name = name;
    mesh.position.set(pos[0], pos[1] + size[1] / 2, pos[2]);
    if (rotZ) mesh.rotation.z = rotZ;
    if (rotY) mesh.rotation.y = rotY;
    mesh.name = "CUSTOM";
    scene.add(mesh);
    meshes.push(mesh);
  });
  return meshes;
}

let world = {};
export function createWorld(scene) {
  world.ground = new Ground({ scene: scene });
  world.box = Box(scene);

  const fnlBoxes = [
    { pos: [-40, 9.2, 0], size: [10, 20, 50] },
    { pos: [-100, 10, 0], size: [10, 20, 50] },
    { pos: [-70, 10, -20], size: [50, 20, 10] },
    { pos: [-80, 10, 20], size: [30, 20, 10] }
  ];
  world.board=whiteboard(scene)
  writeInBoard("HELLO WORLD !")
  world.fnlHospital = createSeparateBoxes(scene, fnlBoxes, fnl);

  const collegeBox = [
    { pos: [-35, 10, 120], size: [20, 20, 30], mats: materials },
    { pos: [-90, 10, 87.5], size: [30, 20, 35], mats: materials }
  ];
  world.hospitalu = createSeparateBoxes(scene, collegeBox)[0];

  const bdBoxes = [
    { pos: [-35, 10, 80], size: [20, 28, 40] },
    { pos: [-77.5, 10, 120], size: [20, 28, 55], rotY: -Math.PI / 2 },
    { pos: [70, 10, 120], size: [20, 28, 40], rotY: -Math.PI / 2 },
    { pos: [-35, 10, -80], size: [20, 28, 40] }
  ];
  world.bdHospital = createSeparateBoxes(scene, bdBoxes, bd);

  const offbox = [
    { pos: [50, 10, -85], size: [110, 60, 40] },
    { pos: [-145.0, 10, 15], size: [40, 40, 110] },
    { pos: [20, 10, 85], size: [40, 40, 100] },
    { pos: [175, 10, -110], size: [22, 20, 90] },
  ];

  world.office = createSeparateBoxes(scene, offbox, office);
  const normbox2 = [
    { pos: [155, 9.525, -110], size: [75, 0.6, 105] },
  ];

  world.normal2 = createSeparateBoxes(scene, normbox2, flr);
  const normbox3 = [
    { pos: [155, 29.525, -110], size: [70, 0.6, 100] },
    { pos: [120, 9.525, -58], size: [0.4, 20, 0.1] },
    { pos: [120, 9.525, -160], size: [0.4, 20, 0.1] },
    { pos: [190, 9.525, -160], size: [0.4, 20, 0.1] },
    { pos: [190, 9.525, -58], size: [0.4, 20, 0.1] },
    { pos: [155, 9.525, -47], size: [66, 5, 0.5] },
    { pos: [155, 9.525, 19], size: [66, 5, 0.5] },
    { pos: [188, 9.525, -14], size: [0.5, 5, 66] },
    { pos: [122, 9.525, -14], size: [0.5, 5, 66] },
  ];

  world.normal3 = createSeparateBoxes(scene, normbox3, flur);

  const resbox = [
    { pos: [20, 10, 15], size: [40, 20, 30] },
  ];

  world.resident = createSeparateBoxes(scene, resbox, resident);

  const mixbox = [
    { pos: [50, 10, -25], size: [110, 40, 40] },
    { pos: [-85, 10, 50], size: [40, 40, 30] },
  ];

  world.multi = createSeparateBoxes(scene, mixbox, multi);
  
  const carPositions = [
    { x: 150, y: 10, z: -125, rotation: Math.PI / 2 },
    { x: 150, y: 10, z: -135, rotation: Math.PI / 2 },
    { x: 150, y: 10, z: -70, rotation: Math.PI / 2 },
    { x: 150, y: 10, z: -80, rotation: Math.PI / 2 },
    { x: 150, y: 1000, z: -145, rotation: Math.PI / 2 },
    { x: 150, y: 10, z: -90, rotation: Math.PI / 2 }
  ];

  const carColors = [
    0xff0000,
    0x00ff00,
    0x0000ff,
    0x0000ff,
    0xffff00
  ];

  world.car = createInstancedCarsFromGLTF(scene, carPositions, carColors);

  const normbox = [
    { pos: [120.5, 0, 224], size: [1, 50, 1] },
    { pos: [115, 50, 224], size: [11, 0.5, 1] },
    { pos: [115, 30, 234], size: [11, 0.5, 1] },
    { pos: [115, 30, 214], size: [11, 0.5, 1] },
    { pos: [115, 22, 204], size: [11, 0.5, 1] },
    { pos: [115, 22, 244], size: [11, 0.5, 1] },
    { pos: [115, 20, 254], size: [11, 0.5, 1] },
    { pos: [115, 18, 264], size: [11, 0.5, 1] },
    { pos: [115, 16, 274], size: [11, 0.5, 1] },
    { pos: [115, 16, 284], size: [11, 0.5, 1] },
    { pos: [115, 20, 194], size: [11, 0.5, 1] },
    { pos: [115, 18, 184], size: [11, 0.5, 1] },
    { pos: [115, 16, 174], size: [11, 0.5, 1] },
    { pos: [115, 16, 164], size: [11, 0.5, 1] },
    { pos: [120.5, 0, 234], size: [1, 30, 1] },
    { pos: [120.5, 0, 214], size: [1, 30, 1] },
    { pos: [120.5, 0, 244], size: [1, 22, 1] },
    { pos: [120.5, 0, 204], size: [1, 22, 1] },
    { pos: [120.5, 0, 254], size: [1, 20, 1] },
    { pos: [120.5, 0, 194], size: [1, 20, 1] },
    { pos: [120.5, 0, 184], size: [1, 18, 1] },
    { pos: [120.5, 0, 174], size: [1, 16, 1] },
    { pos: [120.5, 0, 164], size: [1, 16, 1] },
    { pos: [120.5, 0, 264], size: [1, 18, 1] },
    { pos: [120.5, 0, 274], size: [1, 16, 1] },
    { pos: [120.5, 0, 284], size: [1, 16, 1] },
    { pos: [109.5, 0, 224], size: [1, 50, 1] },
    { pos: [109.5, 0, 214], size: [1, 30, 1] },
    { pos: [109.5, 0, 234], size: [1, 30, 1] },
    { pos: [109.5, 0, 244], size: [1, 22, 1] },
    { pos: [109.5, 0, 204], size: [1, 22, 1] },
    { pos: [109.5, 0, 254], size: [1, 20, 1] },
    { pos: [109.5, 0, 194], size: [1, 20, 1] },
    { pos: [109.5, 0, 184], size: [1, 18, 1] },
    { pos: [109.5, 0, 174], size: [1, 16, 1] },
    { pos: [109.5, 0, 164], size: [1, 16, 1] },
    { pos: [109.5, 0, 264], size: [1, 18, 1] },
    { pos: [109.5, 0, 274], size: [1, 16, 1] },
    { pos: [109.5, 0, 284], size: [1, 16, 1] },
    { pos: [109.5, 11, 224], size: [1, 1, 120] },
    { pos: [120.5, 11, 224], size: [1, 1, 120] },
  ];

  world.norm = createSeparateBoxes(scene, normbox, norm);

  const verticalPoles = normbox.filter(b => b.size[0] === 1 && b.size[2] === 1);
  const zGroups = {};
  verticalPoles.forEach(b => {
    const z = b.pos[2];
    if (!zGroups[z]) zGroups[z] = [];
    zGroups[z].push(b);
  });

  const sortedZKeys = Object.keys(zGroups).map(Number).sort((a, b) => a - b);
  const leftPoints = [];
  const midPoints = [];
  const rightPoints = [];

  sortedZKeys.forEach(z => {
    const poles = zGroups[z];
    let leftPole = poles.find(p => Math.abs(p.pos[0] - 109.5) < 0.5);
    let rightPole = poles.find(p => Math.abs(p.pos[0] - 120.5) < 0.5);

    if (leftPole) {
      leftPoints.push(new THREE.Vector3(leftPole.pos[0], leftPole.pos[1] + leftPole.size[1], z));
    }
    if (rightPole) {
      rightPoints.push(new THREE.Vector3(rightPole.pos[0], rightPole.pos[1] + rightPole.size[1], z));
    }
    if (leftPole && rightPole) {
      const midY = (leftPole.pos[1] + leftPole.size[1] + rightPole.pos[1] + rightPole.size[1]) / 2;
      midPoints.push(new THREE.Vector3(115, midY, z));
    }
  });

  function createWireMesh(points, radius = 0.15, color = 0x111111) {
    if (points.length < 2) return;
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, points.length * 8, radius, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.4 });
    const mesh = new THREE.Mesh(tubeGeo, tubeMat);
    mesh.name = "CUSTOM_WIRE";
    scene.add(mesh);
    return mesh;
  }

  world.wires = [
    createWireMesh(leftPoints),
    createWireMesh(midPoints),
    createWireMesh(rightPoints)
  ];

  const mwBoxes = [
    { pos: [15, 10, 352], size: [10, 5, 20] }
  ];
  world.mwHospital = createSeparateBoxes(scene, mwBoxes, mw);

  const tnBoxes = [
    { pos: [12, 16, 360], size: [6.5, 0.05, 35.5], rotZ: 0.40, name: "mvabl" },
    { pos: [18, 16, 360], size: [6.5, 0.05, 35.5], rotZ: -0.40, name: "mvabl" }
  ];
  world.tnHospital = createSeparateBoxes(scene, tnBoxes, tn);

  const roofBoxes = [
    { pos: [-70, 29.2, 0], size: [72, 2, 52] }
  ];
  world.hospitalroof2 = createSeparateBoxes(scene, roofBoxes, new THREE.MeshStandardMaterial());

  const darkRoofBoxes = [
    { pos: [-70, 9.1, 0], size: [72, 1, 52] }
  ];
  world.hospitalroof3 = createSeparateBoxes(scene, darkRoofBoxes, new THREE.MeshStandardMaterial({ color: 0x555555 }));

  const treePositions = [
    { x: -31, y: 9.2, z: 47 },
    { x: 63, y: 9.6, z: 377 },
    { x: 83, y: 11, z: 368 },
    { x: 55, y: 10, z: 400 },
    { x: 22, y: 9.2, z: 342 },
    { x: 22, y: 9.2, z: 378 }
  ];
  world.treeMesh = createInstancedTrees(scene, treePositions);
  
  const bushPositions = [
    { x: -31, y: 9.2, z: 47 },
    { x: 51, y: 6, z: 418 },
    { x: 62, y: 10.5, z: 385 },
    { x: 82, y: 23, z: 183 },
    { x: 73, y: 13.6, z: 390 },
    { x: 10.6, y: 9.2, z: 386 },
    { x: 70, y: 9.5, z: 367 },
    { x: 14, y: 9.2, z: 382 },
    { x: 16, y: 9.2, z: 341 },
    { x: 22, y: 9.2, z: 384 },
    { x: -8.5, y: 9.5, z: -12 },
    { x: -8.4, y: 9.5, z: -26 },
    { x: -48.7, y: 9.5, z: -43.5 },
    { x: -88.4, y: 9.5, z: -40 },
    { x: -60, y: 9.5, z: -60.5 },
    { x: -75, y: 9.5, z: -31 },
    { x: -75, y: 9.5, z: -60 },
    { x: -65.5, y: 9.5, z: -37.5 },
    { x: -92, y: 9.5, z: -61 },
    { x: -43, y: 9.5, z: -62 },
    { x: -34, y: 9.5, z: -60 },
    { x: -22, y: 9.5, z: -62 },
    { x: -6, y: 9.5, z: -80 },
    { x: -7, y: 9.5, z: -90 },
    { x: -6.5, y: 9.5, z: -100 },
    { x: -7.5, y: 9.5, z: -34.47 },
    { x: -23.65, y: 9.5, z: -36 },
    { x: -39.6, y: 9.5, z: -43.5 },
    { x: -47.5, y: 9.5, z: -34.8 },
  ];
  world.bushMesh = bushes(scene, bushPositions);

  const fencePositions = [
    { x: -70, y: 9.2, z: 35, rt: 0 },
    { x: -80, y: 9.2, z: 35, rt: 0 },
    { x: -90, y: 9.2, z: 35, rt: 0 },
    { x: -100, y: 9.2, z: 35, rt: 0 },
    { x: -105, y: 9.2, z: 35, rt: 0 },
    { x: -105, y: 9.2, z: -45, rt: 0 },
    { x: -100, y: 9.2, z: -45, rt: 0 },
    { x: -90, y: 9.2, z: -45, rt: 0 },
    { x: -65, y: 9.2, z: 40, rt: Math.PI / 2 },
    { x: -110, y: 9.2, z: 30, rt: Math.PI / 2 },
    { x: -110, y: 9.2, z: 20, rt: Math.PI / 2 },
    { x: -110, y: 9.2, z: 10, rt: Math.PI / 2 },
    { x: -110, y: 9.2, z: 0, rt: Math.PI / 2 },
    { x: -110, y: 9.2, z: -10, rt: Math.PI / 2 },
    { x: -110, y: 9.2, z: -20, rt: Math.PI / 2 },
    { x: -110, y: 9.2, z: -30, rt: Math.PI / 2 },
    { x: -110, y: 9.2, z: -40, rt: Math.PI / 2 },
    { x: -65, y: 9.2, z: 50, rt: Math.PI / 2 },
    { x: -65, y: 9.2, z: 60, rt: Math.PI / 2 },
    { x: -65, y: 9.2, z: 60, rt: Math.PI / 2 },
    { x: 24, y: 9.2, z: 345, rt: Math.PI / 2 },
    { x: 6, y: 9.2, z: 345, rt: Math.PI / 2 },
    { x: 6, y: 9.2, z: 355, rt: Math.PI / 2 },
    { x: 6, y: 9.2, z: 365, rt: Math.PI / 2 },
    { x: 24, y: 9.2, z: 365, rt: Math.PI / 2 },
    { x: 6, y: 9.2, z: 365, rt: Math.PI / 2 },
    { x: 24, y: 9.2, z: 375, rt: Math.PI / 2 },
    { x: 6, y: 9.2, z: 375, rt: Math.PI / 2 },
    { x: 19, y: 9.2, z: 340, rt: 0 },
    { x: 19, y: 9.2, z: 380, rt: 0 },
    { x: 11, y: 9.2, z: 340, rt: 0 },
    { x: 11, y: 9.2, z: 380, rt: 0 },
    { x: -60, y: 9.2, z: 65, rt: 0 },
    { x: -50, y: 9.2, z: 65, rt: 0 },
    { x: -47, y: 9.2, z: 110, rt: 0 },
    { x: -45, y: 9.2, z: 102.7, rt: Math.PI / 2 },
    { x: -35, y: 9.2, z: -30, rt: Math.PI / 2 },
    { x: -35, y: 9.2, z: -40, rt: Math.PI / 2 },
    { x: 120, y: 9.2, z: -63, rt: Math.PI / 2 },
    { x: 120, y: 9.2, z: -69, rt: Math.PI / 2 },
    { x: 120, y: 9.2, z: -79, rt: Math.PI / 2 },
    { x: 120, y: 9.2, z: -89, rt: Math.PI / 2 },
    { x: 120, y: 9.2, z: -99, rt: Math.PI / 2 },
    { x: 120, y: 9.2, z: -115, rt: Math.PI / 2 },
    { x: 120, y: 9.2, z: -125, rt: Math.PI / 2 },
    { x: 120, y: 9.2, z: -135, rt: Math.PI / 2 },
    { x: 120, y: 9.2, z: -145, rt: Math.PI / 2 },
    { x: 120, y: 9.2, z: -155, rt: Math.PI / 2 },
    { x: -40, y: 9.2, z: -45, rt: 0 },
    { x: -50, y: 9.2, z: -45, rt: 0 },
    { x: -70, y: 9.2, z: -45, rt: 0 },
    { x: -80, y: 9.2, z: -45, rt: 0 },
    { x: -90, y: 9.2, z: -45, rt: 0 },
    { x: -100, y: 9.2, z: -45, rt: 0 },
    { x: 125, y: 9.2, z: -58, rt: 0 },
    { x: 135, y: 9.2, z: -58, rt: 0 },
    { x: 145, y: 9.2, z: -58, rt: 0 },
    { x: 155, y: 9.2, z: -58, rt: 0 },
    { x: 165, y: 9.2, z: -58, rt: 0 },
    { x: 175, y: 9.2, z: -58, rt: 0 },
    { x: 185, y: 9.2, z: -58, rt: 0 },
    { x: 190, y: 9.2, z: -63, rt: Math.PI / 2 },
    { x: 190, y: 9.2, z: -73, rt: Math.PI / 2 },
    { x: 190, y: 9.2, z: -83, rt: Math.PI / 2 },
    { x: 190, y: 9.2, z: -93, rt: Math.PI / 2 },
    { x: 190, y: 9.2, z: -103, rt: Math.PI / 2 },
    { x: 190, y: 9.2, z: -113, rt: Math.PI / 2 },
    { x: 190, y: 9.2, z: -123, rt: Math.PI / 2 },
    { x: 190, y: 9.2, z: -133, rt: Math.PI / 2 },
    { x: 190, y: 9.2, z: -143, rt: Math.PI / 2 },
    { x: 190, y: 9.2, z: -153, rt: Math.PI / 2 },
    { x: 190, y: 9.2, z: -155, rt: Math.PI / 2 },
    { x: 125, y: 9.2, z: -160, rt: 0 },
    { x: 135, y: 9.2, z: -160, rt: 0 },
    { x: 145, y: 9.2, z: -160, rt: 0 },
    { x: 155, y: 9.2, z: -160, rt: 0 },
    { x: 165, y: 9.2, z: -160, rt: 0 },
    { x: 175, y: 9.2, z: -160, rt: 0 },
    { x: 185, y: 9.2, z: -160, rt: 0 },
  ];
  world.fenceMesh = createInstancedFences(scene, fencePositions);

  const lampPositions = [
    { x: -21, y: 9.2, z: 139 },
    { x: -9, y: 9.2, z: 139 },
    { x: 108, y: 9.2, z: 136 },
    { x: 122, y: 9.2, z: 136 },
    { x: 108, y: 9.2, z: 154 },
    { x: 122, y: 9.2, z: 154 },
    { x: -21, y: 9.2, z: -46 },
    { x: -9, y: 9.2, z: -46 },
    { x: -21, y: 9.2, z: 29 },
    { x: -21, y: 9.2, z: 41 },
    { x: -21, y: 9.2, z: -60 },
    { x: -9, y: 9.2, z: -60 },
    { x: 108, y: 9.2, z: -46 },
    { x: 122, y: 9.2, z: -46 },
    { x: 108, y: 9.2, z: -60 },
    { x: 122, y: 9.2, z: -60 },
    { x: 24, y: 9.2, z: 387 },
    { x: -24, y: 9.2, z: 422 },
    { x: 24, y: 9.2, z: 400 },
    { x: 24, y: 9.2, z: 422 },
    { x: -24, y: 9.2, z: 400 },
    { x: 6, y: 9.2, z: 387 },
    { x: 108, y: 9.2, z: 310 },
    { x: 122, y: 9.2, z: 310 },
    { x: 36, y: 9.2, z: 323 },
    { x: 36, y: 9.2, z: 310 },
    { x: 24, y: 9.2, z: 310 },
    { x: 24, y: 9.2, z: 326 },
    { x: 5.5, y: 9.2, z: 339 },
  ];
  const npcData=[
    {scene:scene,name:"Charles",job:"Inspector",id:1000}
  ]
  world.npc = npcData.map(data => new NPC(data));
  world.lampMeshes = createInstancedLamps(scene, lampPositions);

  world.tower = Tower(scene);
  world.bridge = Bridge(scene);
  world.jumper = jumper(scene, world.ground, 6, 410);
  world.room = Room(scene, world.ground, 13, 410, Math.PI);
  world.room1 = Room(scene, world.ground, -13, 410);
  world.room2 = Room(scene, world.ground, 15, 370);

  world.chair = Chair(scene, world.ground, 0, 0);
  world.cont = Cont(scene, world.ground, 0, 410);

  return world;
}
