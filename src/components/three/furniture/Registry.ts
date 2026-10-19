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
  'dining-table': {
    id: 'dining-table',
    name: 'Dining Table',
    category: 'Dining',
    modelType: 'procedural',
    defaultDimensions: { width: 1.8, height: 0.75, depth: 0.9 },
    supportedRoomTypes: ['Dining'],
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
