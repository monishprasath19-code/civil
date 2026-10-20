import * as THREE from 'three';

// Cache generated canvas textures so we never regenerate identical textures
const textureCache = new Map<string, { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture }>();

/**
 * Creates high-resolution procedural PBR canvas textures (Diffuse + Normal Map)
 * for architectural surfaces (Marble, Wood Parquet, Plaster, Brick, Tiles, Grass, Fabric).
 */
export function getProceduralPBR(materialId?: string, category?: string): {
  map: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  roughness: number;
  metalness: number;
} {
  const key = `${materialId || 'default'}_${category || 'general'}`;
  if (textureCache.has(key)) {
    const cached = textureCache.get(key)!;
    return {
      map: cached.map,
      normalMap: cached.normalMap,
      roughness: getRoughnessFor(materialId, category),
      metalness: getMetalnessFor(materialId, category)
    };
  }

  const { diffuseCanvas, normalCanvas } = generateCanvases(materialId || '', category || '');
  
  const map = new THREE.CanvasTexture(diffuseCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;

  const normalMap = new THREE.CanvasTexture(normalCanvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;

  const scale = getTextureScale(materialId, category);
  map.repeat.set(scale, scale);
  normalMap.repeat.set(scale, scale);

  textureCache.set(key, { map, normalMap });

  return {
    map,
    normalMap,
    roughness: getRoughnessFor(materialId, category),
    metalness: getMetalnessFor(materialId, category)
  };
}

function getTextureScale(materialId?: string, category?: string): number {
  const id = (materialId || '').toLowerCase();
  if (id.includes('marble')) return 1.5;
  if (id.includes('wood') || id.includes('oak')) return 2.0;
  if (id.includes('tile') || id.includes('concrete')) return 3.0;
  if (id.includes('brick')) return 4.0;
  if (id.includes('grass')) return 6.0;
  return 2.0;
}

function getRoughnessFor(materialId?: string, category?: string): number {
  const id = (materialId || '').toLowerCase();
  if (id.includes('marble')) return 0.15;
  if (id.includes('concrete')) return 0.25;
  if (id.includes('wood') || id.includes('oak')) return 0.35;
  if (id.includes('tile')) return 0.2;
  if (id.includes('glass')) return 0.05;
  if (id.includes('plaster')) return 0.85;
  if (id.includes('brick')) return 0.9;
  return 0.5;
}

function getMetalnessFor(materialId?: string, category?: string): number {
  const id = (materialId || '').toLowerCase();
  if (id.includes('marble')) return 0.08;
  if (id.includes('concrete')) return 0.05;
  if (id.includes('brass') || id.includes('gold')) return 0.85;
  if (id.includes('metal') || id.includes('steel')) return 0.8;
  return 0.0;
}

function generateCanvases(materialId: string, category: string): { diffuseCanvas: HTMLCanvasElement; normalCanvas: HTMLCanvasElement } {
  const id = materialId.toLowerCase();
  const size = 512;

  // 1. Italian Carrara White Marble
  if (id.includes('marble') || id.includes('carrara')) {
    return createMarbleCanvases(size, '#f8fafc', '#94a3b8');
  }

  // 2. Parquet / Light Oak Hardwood
  if (id.includes('wood') || id.includes('oak') || id.includes('parquet')) {
    return createWoodParquetCanvases(size, '#d4a373', '#b08968');
  }

  // 3. Polished Screed Concrete / Terrazzo
  if (id.includes('concrete') || id.includes('terrazzo')) {
    return createConcreteCanvases(size, '#cbd5e1', '#64748b');
  }

  // 4. Luxury Ceramic / Porcelain Tiles
  if (id.includes('tile') || category === 'floor') {
    return createTileCanvases(size, '#f1f5f9', '#94a3b8');
  }

  // 5. Architectural Brick & Mortar
  if (id.includes('brick')) {
    return createBrickCanvases(size, '#78350f', '#d6d3d1');
  }

  // 6. Lush Lawn Grass
  if (id.includes('grass') || category === 'landscape') {
    return createGrassCanvases(size);
  }

  // 7. Cobblestone / Pavers
  if (id.includes('driveway') || id.includes('paver')) {
    return createPaverCanvases(size);
  }

  // 8. Default: Fine Venetian Plaster
  return createPlasterCanvases(size, '#fafaf9');
}

/**
 * Procedural Italian Marble Generator with fractal vein branches
 */
function createMarbleCanvases(size: number, baseHex: string, veinHex: string) {
  const dCanvas = document.createElement('canvas');
  dCanvas.width = size;
  dCanvas.height = size;
  const dCtx = dCanvas.getContext('2d')!;

  const nCanvas = document.createElement('canvas');
  nCanvas.width = size;
  nCanvas.height = size;
  const nCtx = nCanvas.getContext('2d')!;

  // Marble Base
  dCtx.fillStyle = baseHex;
  dCtx.fillRect(0, 0, size, size);

  // Subtle tonal cloudy variations
  for (let i = 0; i < 15; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    const rad = 40 + Math.random() * 80;
    const grad = dCtx.createRadialGradient(rx, ry, 5, rx, ry, rad);
    grad.addColorStop(0, 'rgba(226, 232, 240, 0.4)');
    grad.addColorStop(1, 'rgba(248, 250, 252, 0)');
    dCtx.fillStyle = grad;
    dCtx.beginPath();
    dCtx.arc(rx, ry, rad, 0, Math.PI * 2);
    dCtx.fill();
  }

  // Draw organic fractal veins
  dCtx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
  dCtx.lineWidth = 2.5;
  dCtx.lineCap = 'round';

  for (let v = 0; v < 6; v++) {
    let x = (v / 6) * size + (Math.random() * 40 - 20);
    let y = 0;
    dCtx.beginPath();
    dCtx.moveTo(x, y);
    while (y < size) {
      x += (Math.random() - 0.48) * 18;
      y += 8 + Math.random() * 12;
      dCtx.lineTo(x, y);

      // Sub-vein branch
      if (Math.random() > 0.8) {
        dCtx.save();
        dCtx.lineWidth = 1.0;
        dCtx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        dCtx.beginPath();
        dCtx.moveTo(x, y);
        dCtx.lineTo(x + (Math.random() - 0.5) * 35, y + 25);
        dCtx.stroke();
        dCtx.restore();
      }
    }
    dCtx.stroke();
  }

  // Flat normal map with very slight surface ripples
  nCtx.fillStyle = '#8080ff';
  nCtx.fillRect(0, 0, size, size);

  return { diffuseCanvas: dCanvas, normalCanvas: nCanvas };
}

/**
 * Procedural Herringbone / Parquet Oak Wood
 */
function createWoodParquetCanvases(size: number, woodBase: string, woodGrain: string) {
  const dCanvas = document.createElement('canvas');
  dCanvas.width = size;
  dCanvas.height = size;
  const dCtx = dCanvas.getContext('2d')!;

  const nCanvas = document.createElement('canvas');
  nCanvas.width = size;
  nCanvas.height = size;
  const nCtx = nCanvas.getContext('2d')!;

  dCtx.fillStyle = woodBase;
  dCtx.fillRect(0, 0, size, size);

  nCtx.fillStyle = '#8080ff';
  nCtx.fillRect(0, 0, size, size);

  const plankCount = 8;
  const plankHeight = size / plankCount;

  for (let i = 0; i < plankCount; i++) {
    const y = i * plankHeight;
    // Plank color variation
    const toneShift = (Math.random() - 0.5) * 15;
    dCtx.fillStyle = `rgba(${toneShift > 0 ? '255,255,255' : '0,0,0'}, ${Math.abs(toneShift) / 100})`;
    dCtx.fillRect(0, y, size, plankHeight);

    // Wood Grain lines
    dCtx.strokeStyle = woodGrain;
    dCtx.lineWidth = 0.8;
    for (let g = 0; g < 12; g++) {
      const gy = y + (g / 12) * plankHeight + (Math.random() * 2 - 1);
      dCtx.beginPath();
      dCtx.moveTo(0, gy);
      dCtx.bezierCurveTo(
        size * 0.3, gy + (Math.random() * 4 - 2),
        size * 0.7, gy + (Math.random() * 4 - 2),
        size, gy
      );
      dCtx.stroke();
    }

    // Beveled plank joint
    dCtx.strokeStyle = '#5c4033';
    dCtx.lineWidth = 2.0;
    dCtx.beginPath();
    dCtx.moveTo(0, y);
    dCtx.lineTo(size, y);
    dCtx.stroke();

    // Normal map groove
    nCtx.strokeStyle = '#6060ff';
    nCtx.lineWidth = 2.0;
    nCtx.beginPath();
    nCtx.moveTo(0, y);
    nCtx.lineTo(size, y);
    nCtx.stroke();
  }

  return { diffuseCanvas: dCanvas, normalCanvas: nCanvas };
}

/**
 * Procedural Polished Concrete & Aggregate
 */
function createConcreteCanvases(size: number, baseColor: string, speckleColor: string) {
  const dCanvas = document.createElement('canvas');
  dCanvas.width = size;
  dCanvas.height = size;
  const dCtx = dCanvas.getContext('2d')!;

  const nCanvas = document.createElement('canvas');
  nCanvas.width = size;
  nCanvas.height = size;
  const nCtx = nCanvas.getContext('2d')!;

  dCtx.fillStyle = baseColor;
  dCtx.fillRect(0, 0, size, size);

  nCtx.fillStyle = '#8080ff';
  nCtx.fillRect(0, 0, size, size);

  // Fine mineral speckles
  for (let i = 0; i < 1500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 1.5;
    dCtx.fillStyle = Math.random() > 0.5 ? 'rgba(71, 85, 105, 0.3)' : 'rgba(255, 255, 255, 0.4)';
    dCtx.beginPath();
    dCtx.arc(x, y, r, 0, Math.PI * 2);
    dCtx.fill();
  }

  return { diffuseCanvas: dCanvas, normalCanvas: nCanvas };
}

/**
 * Procedural Luxury Floor Tile with Crisp Grout
 */
function createTileCanvases(size: number, tileColor: string, groutColor: string) {
  const dCanvas = document.createElement('canvas');
  dCanvas.width = size;
  dCanvas.height = size;
  const dCtx = dCanvas.getContext('2d')!;

  const nCanvas = document.createElement('canvas');
  nCanvas.width = size;
  nCanvas.height = size;
  const nCtx = nCanvas.getContext('2d')!;

  dCtx.fillStyle = tileColor;
  dCtx.fillRect(0, 0, size, size);

  nCtx.fillStyle = '#8080ff';
  nCtx.fillRect(0, 0, size, size);

  // 4x4 Grid of tiles
  const cells = 4;
  const step = size / cells;

  dCtx.strokeStyle = groutColor;
  dCtx.lineWidth = 3.0;

  nCtx.strokeStyle = '#5050ff';
  nCtx.lineWidth = 3.0;

  for (let i = 0; i <= cells; i++) {
    const pos = i * step;
    // Horizontal
    dCtx.beginPath();
    dCtx.moveTo(0, pos);
    dCtx.lineTo(size, pos);
    dCtx.stroke();

    nCtx.beginPath();
    nCtx.moveTo(0, pos);
    nCtx.lineTo(size, pos);
    nCtx.stroke();

    // Vertical
    dCtx.beginPath();
    dCtx.moveTo(pos, 0);
    dCtx.lineTo(pos, size);
    dCtx.stroke();

    nCtx.beginPath();
    nCtx.moveTo(pos, 0);
    nCtx.lineTo(pos, size);
    nCtx.stroke();
  }

  return { diffuseCanvas: dCanvas, normalCanvas: nCanvas };
}

/**
 * Procedural Brick & Mortar
 */
function createBrickCanvases(size: number, brickColor: string, mortarColor: string) {
  const dCanvas = document.createElement('canvas');
  dCanvas.width = size;
  dCanvas.height = size;
  const dCtx = dCanvas.getContext('2d')!;

  const nCanvas = document.createElement('canvas');
  nCanvas.width = size;
  nCanvas.height = size;
  const nCtx = nCanvas.getContext('2d')!;

  dCtx.fillStyle = mortarColor;
  dCtx.fillRect(0, 0, size, size);

  nCtx.fillStyle = '#8080ff';
  nCtx.fillRect(0, 0, size, size);

  const rows = 8;
  const rowH = size / rows;
  const brickW = size / 4;

  for (let r = 0; r < rows; r++) {
    const y = r * rowH;
    const offset = (r % 2) * (brickW / 2);
    for (let x = -offset; x < size + brickW; x += brickW) {
      dCtx.fillStyle = brickColor;
      dCtx.fillRect(x + 2, y + 2, brickW - 4, rowH - 4);

      // Normal map bevel
      nCtx.fillStyle = '#9090ff';
      nCtx.fillRect(x + 2, y + 2, brickW - 4, rowH - 4);
    }
  }

  return { diffuseCanvas: dCanvas, normalCanvas: nCanvas };
}

/**
 * Procedural Lush Turf Grass
 */
function createGrassCanvases(size: number) {
  const dCanvas = document.createElement('canvas');
  dCanvas.width = size;
  dCanvas.height = size;
  const dCtx = dCanvas.getContext('2d')!;

  const nCanvas = document.createElement('canvas');
  nCanvas.width = size;
  nCanvas.height = size;
  const nCtx = nCanvas.getContext('2d')!;

  dCtx.fillStyle = '#2d6a4f';
  dCtx.fillRect(0, 0, size, size);

  nCtx.fillStyle = '#8080ff';
  nCtx.fillRect(0, 0, size, size);

  // Grass blade flecks
  const greens = ['#40916c', '#52b788', '#74c69d', '#1b4332'];
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    dCtx.fillStyle = greens[Math.floor(Math.random() * greens.length)];
    dCtx.fillRect(x, y, 1.5, 3);
  }

  return { diffuseCanvas: dCanvas, normalCanvas: nCanvas };
}

/**
 * Procedural Driveway Pavers
 */
function createPaverCanvases(size: number) {
  const dCanvas = document.createElement('canvas');
  dCanvas.width = size;
  dCanvas.height = size;
  const dCtx = dCanvas.getContext('2d')!;

  const nCanvas = document.createElement('canvas');
  nCanvas.width = size;
  nCanvas.height = size;
  const nCtx = nCanvas.getContext('2d')!;

  dCtx.fillStyle = '#475569';
  dCtx.fillRect(0, 0, size, size);

  nCtx.fillStyle = '#8080ff';
  nCtx.fillRect(0, 0, size, size);

  const step = size / 6;
  dCtx.strokeStyle = '#1e293b';
  dCtx.lineWidth = 2.5;

  for (let x = 0; x < size; x += step) {
    for (let y = 0; y < size; y += step) {
      dCtx.strokeRect(x + 1, y + 1, step - 2, step - 2);
    }
  }

  return { diffuseCanvas: dCanvas, normalCanvas: nCanvas };
}

/**
 * Procedural Venetian Plaster Wall
 */
function createPlasterCanvases(size: number, baseHex: string) {
  const dCanvas = document.createElement('canvas');
  dCanvas.width = size;
  dCanvas.height = size;
  const dCtx = dCanvas.getContext('2d')!;

  const nCanvas = document.createElement('canvas');
  nCanvas.width = size;
  nCanvas.height = size;
  const nCtx = nCanvas.getContext('2d')!;

  dCtx.fillStyle = baseHex;
  dCtx.fillRect(0, 0, size, size);

  nCtx.fillStyle = '#8080ff';
  nCtx.fillRect(0, 0, size, size);

  // Soft micro-texture
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    dCtx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)';
    dCtx.fillRect(x, y, 2, 2);
  }

  return { diffuseCanvas: dCanvas, normalCanvas: nCanvas };
}
