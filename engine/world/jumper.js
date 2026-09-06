import * as THREE from 'three';

export function jumper(scene,ground,x,z) {
  const radius = 0.6;
  const tube = 0.2;
  const radialSegments = 16;
  const tubularSegments = 60;
  const tire = new THREE.Group()
  tire.doing=true
 

  tire.updatePosition=()=>{
    if (ground.heightData) {
    tire.doing = false
    let y=ground.height(x,z)
    tire.position.set(x,y,z)
      tire.rotation.x+=Math.PI/2
    scene.add(tire)
    }
  }
  
  const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x222222, 
    roughness: 0.8 
  });

  const tire1 = new THREE.Mesh(geometry, material);
  tire1.position.set(0, 0 , -0.1);

  const tire2 = new THREE.Mesh(geometry, material);
  tire2.position.set(0, 0 , -0.3);

  tire.add(tire1);
  tire.add(tire2);
  tire1.name="TIRE"
  tire2.name="TIRE"
  tire.name="TIRE"
  return tire
}
