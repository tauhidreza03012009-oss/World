import * as THREE from "three"

export function playerMesh(scene){
  const player = new THREE.Group()
  scene.add(player)
  
  const geo = new THREE.BoxGeometry(0.5,1,0.5)
  const mat = new THREE.MeshStandardMaterial({color:0xaaaa00})
  const mesh = new THREE.Mesh(geo,mat)
  mesh.name="me"
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  player.add(mesh)

  return player
}
