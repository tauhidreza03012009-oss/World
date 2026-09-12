import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

const actions = {}
let currentAction = null
const clock = new THREE.Clock()

export function playerMesh(scene) {
  const playerGeo = new THREE.BoxGeometry(0.5, 1, 0.5)
  const playerMat = new THREE.MeshBasicMaterial({ visible: false })
  const player = new THREE.Mesh(playerGeo, playerMat)
  
  player.name = "me"
  player.rotspeed = 0.05
  player.geometry.computeBoundingBox()
  scene.add(player)

  const loader = new GLTFLoader()
  loader.load('/public/player.glb', (gltf) => {
    const model = gltf.scene
    
    model.scale.set(0.5, 0.5, 0.5)
    model.position.y = -0.5
    model.frustumCulled = false;

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    player.add(model)

    if (gltf.animations && gltf.animations.length > 0) {
      player.mixer = new THREE.AnimationMixer(model)
      
      gltf.animations.forEach((clip) => {
        const action = player.mixer.clipAction(clip)
        action.setLoop(THREE.LoopRepeat)

        const cleanName = clip.name.replace("HumanArmature|", "")
        actions[clip.name] = action
        actions[cleanName] = action
      })

      if (actions["Man_Idle"]) {
        currentAction = actions["Man_Idle"]
        currentAction.play()
      }
    }
  })

  return player
}

export function playAnimation(currention,name="Man_Idle", duration = 0.1) {
  const newAction = actions[name]
  let currentAction = actions[currention]
  
  if (!newAction || newAction === currentAction) return

  if (currentAction) {
    currentAction.fadeOut(duration)
  }

  newAction.reset().fadeIn(duration).play()
  currentAction = newAction
}

export function updatePlayerAnimation(mixer) {
  if (mixer) {
    const delta = clock.getDelta() || 0.016
    mixer.update(delta)
  }
}
