import * as THREE from "three";

let boardMesh = null;
let boardTexture = null;
let boardContext = null;
let boardCanvas = null;

export function whiteboard(scene) {
  boardCanvas = document.createElement("canvas");
  boardCanvas.width = 1024;
  boardCanvas.height = 512;
  
  boardContext = boardCanvas.getContext("2d");
  
  clearBoardCanvas();

  boardTexture = new THREE.CanvasTexture(boardCanvas);

  const boardGeometry = new THREE.PlaneGeometry(4, 2);
  const boardMaterial = new THREE.MeshStandardMaterial({
    map: boardTexture,
    roughness: 0.3,
    metalness: 0.1,
  });

  boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
  boardMesh.name = "BOARD";
  boardMesh.position.set(125, 14, -155);
  scene.add(boardMesh);

  const frameGeometry = new THREE.BoxGeometry(4.1, 2.1, 0.05);
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
  
  const stander = new THREE.BoxGeometry(0.25, 4, 0.25);
  const stand = new THREE.Mesh(stander, frameMaterial);
  stand.position.set(0, -2, -0.2);
  
  boardMesh.add(stand);
  frameMesh.position.z = -0.03;
  boardMesh.add(frameMesh);
}

function clearBoardCanvas() {
  if (!boardContext || !boardCanvas) return;
  boardContext.fillStyle = "#f4f4f4";
  boardContext.fillRect(0, 0, boardCanvas.width, boardCanvas.height);
}

export function writeInBoard(text) {
  if (!boardContext || !boardTexture) {
    console.warn("Whiteboard is not initialized yet.");
    return;
  }

  clearBoardCanvas();

  boardContext.font = "bold 48px sans-serif";
  boardContext.fillStyle = "#111111";
  boardContext.textAlign = "center";
  boardContext.textBaseline = "middle";
  
  boardContext.fillText(text, 512, 256);

  boardTexture.needsUpdate = true;
}