export interface FurnitureAssetDefinition {
  id: string;
  name: string;
  category: 'Living' | 'Bedroom' | 'Dining' | 'Kitchen' | 'Bathroom' | 'Office' | 'Decor' | 'Lighting' | 'Wardrobe' | 'Table' | 'Chair' | 'Sofa' | 'Bed';
  modelType: 'procedural' | 'glb';
  modelUrl?: string; // rename from modelPath to modelUrl
  thumbnailUrl?: string;
  defaultDimensions: { width: number; height: number; depth: number }; // width=X, height=Y, depth=Z
  supportedRoomTypes: string[];
  materialOptions?: string[]; // IDs of materials that can be applied
  collisionDimensions?: { width: number; depth: number };
  tags?: string[];
}

export const FurnitureRegistry: Record<string, FurnitureAssetDefinition> = {
  'sofa-3seater': {
    id: 'sofa-3seater',
    name: '3-Seater Sofa',
    category: 'Living',
    modelType: 'procedural',
    defaultDimensions: { width: 2.2, height: 0.8, depth: 0.9 }, // 3D dimensions
    supportedRoomTypes: ['Living'],
  },
  'armchair': {
    id: 'armchair',
    name: 'Armchair',
    category: 'Living',
    modelType: 'procedural',
    defaultDimensions: { width: 0.9, height: 0.85, depth: 0.9 },
    supportedRoomTypes: ['Living', 'Bedroom', 'Office'],
  },
  'bed-queen': {
    id: 'bed-queen',
    name: 'Queen Bed',
    category: 'Bedroom',
    modelType: 'procedural',
    defaultDimensions: { width: 1.6, height: 1.0, depth: 2.0 },
    supportedRoomTypes: ['Bedroom'],
  },
  'bed-double': {
    id: 'bed-double',
    name: 'Master Suite King Bed',
    category: 'Bedroom',
    modelType: 'procedural',
    defaultDimensions: { width: 1.9, height: 1.1, depth: 2.1 },
    supportedRoomTypes: ['Bedroom'],
  },
  'dining-table': {
    id: 'dining-table',
    name: 'Dining Table',
    category: 'Dining',
    modelType: 'procedural',
    defaultDimensions: { width: 1.8, height: 0.75, depth: 0.9 },
    supportedRoomTypes: ['Dining'],
  },
  'dining-table-6': {
    id: 'dining-table-6',
    name: '6-Seater Marble Dining Table',
    category: 'Dining',
    modelType: 'procedural',
    defaultDimensions: { width: 2.0, height: 0.76, depth: 1.0 },
    supportedRoomTypes: ['Dining'],
  },
  'coffee-table': {
    id: 'coffee-table',
    name: 'Marble & Brass Coffee Table',
    category: 'Table',
    modelType: 'procedural',
    defaultDimensions: { width: 1.2, height: 0.45, depth: 0.7 },
    supportedRoomTypes: ['Living'],
  },
  'tv-unit': {
    id: 'tv-unit',
    name: 'OLED TV & Entertainment Console',
    category: 'Living',
    modelType: 'procedural',
    defaultDimensions: { width: 1.8, height: 0.5, depth: 0.4 },
    supportedRoomTypes: ['Living', 'Bedroom'],
  },
  'plant': {
    id: 'plant',
    name: 'Potted Fiddle Leaf Fig',
    category: 'Decor',
    modelType: 'procedural',
    defaultDimensions: { width: 0.5, height: 1.4, depth: 0.5 },
    supportedRoomTypes: ['Living', 'Bedroom', 'Office', 'Dining'],
  },
  'desk': {
    id: 'desk',
    name: 'Executive Study Desk',
    category: 'Office',
    modelType: 'procedural',
    defaultDimensions: { width: 1.5, height: 0.76, depth: 0.75 },
    supportedRoomTypes: ['Office', 'Bedroom'],
  },
  'dining-chair': {
    id: 'dining-chair',
    name: 'Dining Chair',
    category: 'Dining',
    modelType: 'procedural',
    defaultDimensions: { width: 0.5, height: 0.9, depth: 0.5 },
    supportedRoomTypes: ['Dining'],
  },
  'kitchen-counter': {
    id: 'kitchen-counter',
    name: 'Kitchen Counter',
    category: 'Kitchen',
    modelType: 'procedural',
    defaultDimensions: { width: 2.4, height: 0.9, depth: 0.6 },
    supportedRoomTypes: ['Kitchen'],
  },
  'toilet': {
    id: 'toilet',
    name: 'Toilet',
    category: 'Bathroom',
    modelType: 'procedural',
    defaultDimensions: { width: 0.4, height: 0.8, depth: 0.7 },
    supportedRoomTypes: ['Bathroom'],
  },
};
