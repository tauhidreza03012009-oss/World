import * as THREE from "three";

let cachedRoadGeometry = null;

function getRoadGeometry() {
  if (cachedRoadGeometry) return cachedRoadGeometry;
  cachedRoadGeometry = new THREE.BoxGeometry(1, 1, 1);
  return cachedRoadGeometry;
}

export function Bridge(scene) {
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const roadsData = [
    { size: [10, 1, 574], pos: [115, 9.65, 31.325], rotY: 0 },
    { size: [10, 1, 406], pos: [270, 9.65, -53], rotY: 0 },
    { size: [10, 1, 406], pos: [-310, 9.65, -53], rotY: 0 },
    { size: [10, 1, 270], pos: [243.5, 9.65, 336.89], rotY: 1.4162 },
    { size: [10, 1, 580], pos: [-20, 9.65, -53], rotY: Math.PI / 2 },
    { size: [10, 1, 406], pos: [-15, 9.65, -53], rotY: 0 },
    { size: [10, 1, 406], pos: [-115, 9.65, -53], rotY: 0 },
    { size: [10, 1, 406], pos: [194, 9.65, -53], rotY: 0 },
    { size: [10, 1, 580], pos: [-20, 9.65, 145], rotY: Math.PI / 2 },
    { size: [10, 1, 580], pos: [-20, 9.65, -251], rotY: Math.PI / 2 },
    { size: [10, 1, 580], pos: [-20, 9.65, -165], rotY: Math.PI / 2 },
    { size: [15, 1, 15], pos: [115, 9.67, 145], rotY: Math.PI / 2 },
    { size: [10, 1, 90], pos: [70, 9.65, 316.2], rotY: Math.PI / 2 },
    { size: [10, 1, 70], pos: [0, 9.65, 428], rotY: Math.PI / 2 },
    { size: [10, 1, 70], pos: [0, 9.65, 393.5], rotY: Math.PI / 2 },
    { size: [10, 1, 30], pos: [15, 9.65, 333], rotY: Math.PI / 2 },
    { size: [10, 1, 65], pos: [0, 9.65, 360.5], rotY: 0 },
    { size: [10, 1, 113], pos: [30, 9.65, 371.5], rotY: 0 },
    { size: [10, 1, 35], pos: [-30, 9.65, 410.5], rotY: 0 },
    { size: [10, 1, 112], pos: [-358, 9.65, -251], rotY: Math.PI / 2 },
    { size: [10, 1, 31], pos: [-35, 9.65, 35.5], rotY: Math.PI / 2 },
    { size: [10, 1, 30], pos: [-51, 9.65, 25.5], rotY: 0 }
  ];

  const roadGeometry = getRoadGeometry();
  const instancedRoads = new THREE.InstancedMesh(roadGeometry, roadMat, roadsData.length);
  const dummy = new THREE.Object3D();

  let totalStripes = 0;

  roadsData.forEach(({ size, pos, rotY }, i) => {
    dummy.position.set(...pos);
    dummy.rotation.y = rotY;
    dummy.scale.set(...size);
    dummy.updateMatrix();
    instancedRoads.setMatrixAt(i, dummy.matrix);

    totalStripes += Math.floor(size[2] / 6);
  });

  instancedRoads.instanceMatrix.needsUpdate = true;
  instancedRoads.name = "Road";
  scene.add(instancedRoads);

  const stripeGeo = new THREE.PlaneGeometry(0.4, 2);
  const instancedStripes = new THREE.InstancedMesh(stripeGeo, stripeMat, totalStripes);
  const stripeDummy = new THREE.Object3D();

  let count = 0;
  roadsData.forEach(({ size, pos, rotY }) => {
    const length = size[2];
    for (let z = -length / 2 + 2; z < length / 2 - 2; z += 6) {
      stripeDummy.position.set(0, 0.51, z);
      stripeDummy.rotation.x = -Math.PI / 2;
      stripeDummy.rotation.y = 0;
      stripeDummy.rotation.z = 0;

      const parentDummy = new THREE.Object3D();
      parentDummy.position.set(...pos);
      parentDummy.rotation.y = rotY;
      parentDummy.add(stripeDummy);
      parentDummy.updateMatrixWorld(true);

      instancedStripes.setMatrixAt(count++, stripeDummy.matrixWorld);
    }
  });

  instancedStripes.instanceMatrix.needsUpdate = true;
  instancedStripes.name = "STRIPE";
  scene.add(instancedStripes);
}
