import * as THREE from "three";

let startX = 0;
let startY = 0;

window.addEventListener("pointerdown", (e) => {
  startX = e.clientX;
  startY = e.clientY;
});

export function getClickedObjectOnUp(camera, scene, event) {
  const diffX = Math.abs(event.clientX - startX);
  const diffY = Math.abs(event.clientY - startY);

  if (diffX > 5 || diffY > 5) return null;

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(pointer, camera);
  let intersects = raycaster.intersectObjects(scene.children, true);
  intersects=intersects.filter(hit => hit.object.isMesh);
  if (intersects.length > 0) {
    return {
      object: intersects[0].object,
      distance: intersects[0].distance,
      point: intersects[0].point,
      instanceId: intersects[0].instanceId
    };
  }

  return null;
}
