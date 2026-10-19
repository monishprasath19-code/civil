export type Unit = 'meters' | 'feet';

export interface Position {
  x: number;
  y: number;
  z?: number;
}

export interface Dimension {
  width: number;
  height: number;
  depth?: number;
  thickness?: number;
}

export interface SiteInfo {
  projectName: string;
  location: string;
  plotLength: number;
  plotWidth: number;
  plotArea: number;
  unit: Unit;
  roadDirection: 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';
  northDirection: number; 
  numberOfFloors: number;
  terrain: 'flat' | 'sloped' | 'uneven';
  climate: 'tropical' | 'dry' | 'temperate' | 'continental' | 'polar';
}

export interface Budget {
  totalBudget: number;
  constructionBudget: number;
  interiorBudget: number;
  exteriorBudget: number;
  furnitureBudget: number;
}

export interface Requirements {
  type: '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'Custom';
  rooms: {
    [key: string]: number;
  };
  customRequirements?: string;
}

export interface Wall {
  id: string;
  startPoint: Position;
  endPoint: Position;
  thickness: number;
  height: number;
  materialId?: string;
  floorId?: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  polygon?: Position[]; // For future irregular rooms
  position: Position; 
  width: number;
  height: number; // Length in 2D
  area?: number;
  rotation?: number;
  ceilingHeight: number;
  floorId: string;
  floorMaterialId?: string;
  wallMaterialId?: string;
}

export interface Door {
  id: string;
  wallId: string;
  position: Position;
  width: number;
  height: number;
  rotation?: number;
  type: 'single' | 'double' | 'sliding';
  swingDirection?: 'left' | 'right' | 'in' | 'out';
  materialId?: string;
}

export interface Window {
  id: string;
  wallId: string;
  position: Position;
  width: number;
  height: number;
  sillHeight: number;
  type: 'casement' | 'sliding' | 'fixed';
  materialId?: string;
}

export interface Furniture {
  id: string;
  roomId?: string;
  type: string;
  name: string;
  position: Position;
  rotation: number; 
  scale?: Position;
  dimensions: Dimension;
  materialId?: string;
}

export interface FloorData {
  id: string;
  level: number;
  name: string;
  elevation: number;
  height: number;
  rooms: Room[];
  walls: Wall[];
  doors: Door[];
  windows: Window[];
  furniture: Furniture[];
}

export type MaterialCategory = 
  | 'wall' | 'floor' | 'ceiling' | 'roof' | 'exterior_wall' 
  | 'compound_wall' | 'driveway' | 'door' | 'window' 
  | 'furniture' | 'countertop' | 'bathroom' | 'kitchen' | 'landscape';

export type MaterialStyle = 
  | 'Modern' | 'Contemporary' | 'Minimal' | 'Traditional' 
  | 'Industrial' | 'Luxury' | 'Rustic' | 'Scandinavian' 
  | 'Tropical' | 'Indian Traditional';

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  description?: string;
  style?: MaterialStyle;
  color?: string; // hex color fallback
  textureUrl?: string;
  normalMapUrl?: string;
  roughness?: number; // 0-1
  metallic?: number; // 0-1
  scale?: number; // Texture repeat scale
  unit?: string; // e.g., 'sqft', 'sqm'
  manufacturer?: string;
  brand?: string;
  source?: string;
  sourceUrl?: string;
  productUrl?: string;
  region?: string;
  price?: number;
  priceUnit?: string;
  availability?: 'in_stock' | 'out_of_stock' | 'special_order';
  tags?: string[];
  thumbnailUrl?: string;
}

export interface TreeData {
  id: string;
  position: Position;
  type: 'tree' | 'shrub';
  scale: number;
}

export interface ExteriorData {
  roofType: 'flat' | 'sloped';
  showRoof: boolean;
  roofMaterialId?: string;
  compoundWall: {
    height: number;
    thickness: number;
    materialId: string;
    show: boolean;
  };
  gate: {
    position: Position;
    width: number;
    height: number;
    type: 'sliding' | 'swing';
  };
  driveway: {
    width: number;
    materialId: string;
    position: Position; 
  };
  parking: {
    spaces: number; // 0, 1, 2
    position: Position;
  };
  trees: TreeData[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

import { CostEstimate } from './cost';

export interface ProjectState {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  site: SiteInfo;
  budget: Budget;
  requirements: Requirements;
  floors: FloorData[];
  materials: Material[];
  exterior?: ExteriorData;
  costEstimate?: CostEstimate;
}
