import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();
const wl = textureLoader.load("./public/wall.png");

export function box(parent, x, y, z, w, h, l, c = null, mat = null) {
  const geo = new THREE.BoxGeometry(w, h, l);
  const uvs = geo.attributes.uv;
  for (let i = 4; i < 8; i++) {
    uvs.setX(i, 1 - uvs.getX(i));
  }
  uvs.needsUpdate = true;

  if (!mat) mat = new THREE.MeshStandardMaterial({ color: c });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y + h / 2, z);
  parent.add(mesh);
  return mesh;
}

function createBoxMesh(x, y, z, w, h, l, material, parent) {
  const geo = new THREE.BoxGeometry(w, h, l);
  const uvs = geo.attributes.uv;
  for (let i = 4; i < 8; i++) {
    uvs.setX(i, 1 - uvs.getX(i));
  }
  uvs.needsUpdate = true;

  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y + h / 2, z);
  parent.add(mesh);
  return mesh;
}

export function Room(scene, ground, x, z, rt = 0, text = wl) {
  const group = new THREE.Group();

  group.position.set(x, 0, z);
  group.rotation.y = rt;
  scene.add(group);

  let placeholder = box(group, 0, 0, 0, 1, 1, 1);

  group.doing = true;
  group.updatePosition = () => {
    if (!group.doing) return;

    if (ground.heightData) {
      group.remove(placeholder);
      let h = ground.height(x, z);

      const wallMat = new THREE.MeshStandardMaterial({ map: text });
      const redMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x999999 });

      createBoxMesh(0, h, 7.5, 10, 5, 0.1, wallMat, group);
      createBoxMesh(0, h, -7.5, 10, 5, 0.1, wallMat, group);

      createBoxMesh(-5, h, 1.5, 0.1, 5, 12, wallMat, group);
      createBoxMesh(-5, h + 4, -6, 0.1, 1, 3, wallMat, group);

      createBoxMesh(5, h, -5, 0.1, 5, 5, wallMat, group);
      createBoxMesh(5, h + 4, 0, 0.1, 1, 5, wallMat, group);
      createBoxMesh(5, h, 0, 0.1, 1, 5, wallMat, group);
      createBoxMesh(5, h, 5, 0.1, 5, 5, wallMat, group);

      createBoxMesh(-5, h + 3.9, -6, 0.1, 0.1, 3, redMat, group);
      createBoxMesh(-5, h, -4.6, 0.1, 4, 0.1, redMat, group);
      createBoxMesh(-5, h, -7.4, 0.1, 4, 0.1, redMat, group);
      createBoxMesh(5, h + 1, 0, 0.1, 0.1, 5, redMat, group);
      createBoxMesh(5, h + 4, 0, 0.1, 0.1, 5, redMat, group);
      createBoxMesh(5, h + 1, 2.5, 0.1, 3, 0.2, redMat, group);
      createBoxMesh(5, h + 1, -2.5, 0.1, 3, 0.2, redMat, group);

      createBoxMesh(0, h + 5, 0, 10, 0.1, 15, roofMat, group);
      createBoxMesh(0, h - 0.055, 0, 10, 0.1, 15, roofMat, group);

      group.doing = false;
    }
  };
  group.name = "ROOM";
  return group;
}
