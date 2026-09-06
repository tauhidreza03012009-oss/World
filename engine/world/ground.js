import * as THREE from 'three';

export class Ground {
  constructor({
    scene = null,
    width = 1000,
    height = 1,
    depth = 1000,
    widthSegments = 128,
    depthSegments = 128,
    heightmapUrl = 'public/ground.png',
    textureUrl = 'public/grass.jpg',
    displacementScale = 40,
    displacementBias = -10
  } = {}) {
    this.width = width;
    this.name="GROUND"
    this.depth = depth;
    this.displacementScale = displacementScale;
    this.displacementBias = displacementBias;

    this.heightData = null;
    this.imgWidth = 0;
    this.imgHeight = 0;

    const textureLoader = new THREE.TextureLoader();

    const grassTexture = textureUrl ? textureLoader.load(textureUrl) : null;
    if (grassTexture) {
      grassTexture.wrapS = THREE.RepeatWrapping;
      grassTexture.wrapT = THREE.RepeatWrapping;
      grassTexture.repeat.set(500, 500);
    }

    let topMaterial;

    if (heightmapUrl) {
      const heightmapTexture = textureLoader.load(heightmapUrl, (texture) => {
        const image = texture.image;
        this.imgWidth = image.width;
        this.imgHeight = image.height;

        const canvas = document.createElement('canvas');
        canvas.width = this.imgWidth;
        canvas.height = this.imgHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);

        this.heightData = ctx.getImageData(0, 0, this.imgWidth, this.imgHeight).data;
      });

      topMaterial = new THREE.MeshStandardMaterial({
        map: grassTexture,
        displacementMap: heightmapTexture,
        displacementScale: this.displacementScale,
        displacementBias: this.displacementBias
      });
    } else {
      topMaterial = new THREE.MeshStandardMaterial({ map: grassTexture, color: 0x00aa00 });
    }

    const sideMaterial = new THREE.MeshStandardMaterial({ color: 0x00aa00 });
    const materials = [
      sideMaterial,
      sideMaterial,
      topMaterial,
      sideMaterial,
      sideMaterial,
      sideMaterial
    ];

    const geo = new THREE.BoxGeometry(
      width,
      height,
      depth,
      widthSegments,
      1,
      depthSegments
    );

    this.mesh = new THREE.Mesh(geo, materials);
    this.mesh.position.y = -height / 2;
    this.mesh.receiveShadow = true;
    this.mesh.name="GROUND"
    if (scene) {
      scene.add(this.mesh);
    }
  }

  height(x, z) {
    if (!this.heightData) return 0;
    
    const u = (x + this.width / 2) / this.width;
    const v = (z + this.depth / 2) / this.depth;

    if (u < 0 || u > 1 || v < 0 || v > 1) return 0;

    const px = Math.max(0, Math.min(Math.floor(u * this.imgWidth), this.imgWidth - 1));
    const py = Math.max(0, Math.min(Math.floor(v * this.imgHeight), this.imgHeight - 1));

    const index = (py * this.imgWidth + px) * 4;
    const r = this.heightData[index];
    const g = this.heightData[index + 1];
    const b = this.heightData[index + 2];

    const brightness = (r + g + b) / (3 * 255);
    
    return (brightness * this.displacementScale) + this.displacementBias;
  }
}
