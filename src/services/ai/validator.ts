import { ProjectState, FloorData, Furniture, Room, Wall, Door, Window, ExteriorData } from '@/models/project';
import { UnifiedAction } from './schema';
import { FurnitureRegistry } from '@/components/three/furniture/Registry';
import { v4 as uuidv4 } from 'uuid';

export interface ValidationResult {
  valid: boolean;
  error?: string;
  updatedProject?: ProjectState;
}

const DEFAULT_EXTERIOR: ExteriorData = {
  roofType: 'flat',
  showRoof: true,
  roofMaterialId: 'mat_concrete_cast',
  compoundWall: {
    height: 1.8,
    thickness: 0.2,
    materialId: '',
    show: true
  },
  gate: {
    position: { x: 10, y: 30 },
    width: 4,
    height: 1.8,
    type: 'sliding'
  },
  driveway: {
    width: 4,
    materialId: '',
    position: { x: 10, y: 28 }
  },
  parking: {
    spaces: 1,
    position: { x: 7, y: 28 }
  },
  trees: [],
  timeOfDay: 'afternoon'
};

// Simple helpers
function getSemanticPosition(semanticArg: any, floor: FloorData): { x: number, y: number } {
  if (!semanticArg || semanticArg.x !== undefined) {
    return { x: semanticArg?.x || 5, y: semanticArg?.y || 5 };
  }

  const { semantic } = semanticArg;
  
  if (semantic === 'NEAR_WINDOW' && floor.windows && floor.windows.length > 0) {
    const win = floor.windows[0];
    const wall = floor.walls?.find(w => w.id === win.wallId);
    if (wall) {
      return { x: wall.startPoint.x + 1, y: wall.startPoint.y + 1 };
    }
  }

  if (semantic === 'NEAR_DOOR' && floor.doors && floor.doors.length > 0) {
    const door = floor.doors[0];
    const wall = floor.walls?.find(w => w.id === door.wallId);
    if (wall) {
      return { x: wall.startPoint.x + 1, y: wall.startPoint.y + 1 };
    }
  }

  if (semantic === 'CENTER' && floor.rooms && floor.rooms.length > 0) {
    const r = floor.rooms[0];
    return { x: (r.position?.x || 0) + (r.width || 4) / 2, y: (r.position?.y || 0) + (r.height || 4) / 2 };
  }

  // Fallback
  return { x: 5, y: 5 };
}

export function validateUnifiedAction(action: UnifiedAction, project: ProjectState, activeFloorId?: string): ValidationResult {
  let updatedProject: ProjectState = { 
    ...project,
    floors: Array.isArray(project.floors) ? [...project.floors] : []
  };

  // Ensure at least one floor exists
  if (updatedProject.floors.length === 0) {
    const defaultFloor: FloorData = {
      id: uuidv4(),
      name: 'Ground Level Atelier',
      level: 0,
      elevation: 0,
      height: 3.0,
      walls: [],
      doors: [],
      windows: [],
      rooms: [
        {
          id: uuidv4(),
          name: 'Living Salon',
          type: 'Living',
          width: 5,
          height: 6,
          ceilingHeight: 3.0,
          floorId: 'floor-0',
          position: { x: 1, y: 1 },
          floorMaterialId: 'mat_floor_white_marble'
        }
      ],
      furniture: []
    };
    updatedProject.floors = [defaultFloor];
  }
  
  // Clone active floor to allow safe mutation
  let activeFloorIndex = updatedProject.floors.findIndex(f => f.id === activeFloorId);
  if (activeFloorIndex === -1) {
    activeFloorIndex = 0; // Fallback to first floor
  }

  updatedProject.floors[activeFloorIndex] = { 
    ...updatedProject.floors[activeFloorIndex], 
    furniture: [...(updatedProject.floors[activeFloorIndex].furniture || [])],
    rooms: [...(updatedProject.floors[activeFloorIndex].rooms || [])],
    walls: [...(updatedProject.floors[activeFloorIndex].walls || [])],
    doors: [...(updatedProject.floors[activeFloorIndex].doors || [])],
    windows: [...(updatedProject.floors[activeFloorIndex].windows || [])]
  };
  
  const floor = updatedProject.floors[activeFloorIndex];

  // Ensure exterior object exists if needed
  if (!updatedProject.exterior) {
    updatedProject.exterior = { ...DEFAULT_EXTERIOR };
  }

  try {
    switch (action.type) {
      case "ADD_FURNITURE": {
        const asset = FurnitureRegistry[action.assetId] || FurnitureRegistry['sofa-3seater'];
        if (!asset) return { valid: false, error: 'Invalid asset ID' };
        
        const pos = getSemanticPosition(action.position, floor);
        const newFurn: Furniture = {
          id: uuidv4(),
          type: action.assetId,
          name: asset.name,
          position: pos,
          rotation: action.rotation || 0,
          dimensions: { width: asset.defaultDimensions?.width || 2, height: asset.defaultDimensions?.depth || 1 },
          roomId: action.roomId || (floor.rooms[0]?.id || '')
        };
        floor.furniture.push(newFurn);
        break;
      }
      case "MOVE_FURNITURE": {
        if (!floor.furniture || floor.furniture.length === 0) {
          const asset = FurnitureRegistry['sofa-3seater'];
          const pos = getSemanticPosition(action.targetPosition, floor);
          floor.furniture.push({
            id: uuidv4(),
            type: 'sofa-3seater',
            name: asset.name,
            position: pos,
            rotation: 0,
            dimensions: { width: asset.defaultDimensions.width, height: asset.defaultDimensions.depth },
            roomId: floor.rooms[0]?.id || ''
          });
          break;
        }
        let idx = floor.furniture.findIndex(f => f.id === action.furnitureId);
        if (idx === -1) idx = 0;
        const pos = getSemanticPosition(action.targetPosition, floor);
        floor.furniture[idx] = { ...floor.furniture[idx], position: pos };
        break;
      }
      case "DELETE_FURNITURE": {
        floor.furniture = floor.furniture.filter(f => f.id !== action.furnitureId);
        break;
      }
      case "APPLY_MATERIAL": {
        if (action.targetType === 'exterior') {
          const ext = updatedProject.exterior || { ...DEFAULT_EXTERIOR };
          if (action.targetId === 'roof') ext.roofMaterialId = action.materialId;
          else if (action.targetId === 'driveway' && ext.driveway) ext.driveway.materialId = action.materialId;
          else if (action.targetId === 'compound_wall' && ext.compoundWall) ext.compoundWall.materialId = action.materialId;
          updatedProject.exterior = ext;
        } else if (floor) {
          if (action.targetType === 'room') {
            let idx = floor.rooms.findIndex(r => r.id === action.targetId);
            if (idx === -1 && floor.rooms.length > 0) idx = 0;
            if (idx !== -1) {
              floor.rooms[idx] = { ...floor.rooms[idx], floorMaterialId: action.materialId };
            }
          }
          if (action.targetType === 'wall') {
            let idx = floor.walls.findIndex(w => w.id === action.targetId);
            if (idx === -1 && floor.walls.length > 0) idx = 0;
            if (idx !== -1) {
              floor.walls[idx] = { ...floor.walls[idx], materialId: action.materialId };
            }
          }
          if (action.targetType === 'furniture') {
            let idx = floor.furniture.findIndex(f => f.id === action.targetId);
            if (idx === -1 && floor.furniture.length > 0) idx = 0;
            if (idx !== -1) {
              floor.furniture[idx] = { ...floor.furniture[idx], materialId: action.materialId };
            }
          }
        }
        break;
      }
      case "ADD_TREE": {
        const pos = getSemanticPosition(action.position, floor);
        const ext = updatedProject.exterior || { ...DEFAULT_EXTERIOR };
        updatedProject.exterior = {
          ...ext,
          trees: [
            ...(ext.trees || []),
            { id: uuidv4(), type: 'tree', position: pos, scale: 1.0 }
          ]
        };
        break;
      }
      case "CHANGE_ROOF": {
        const ext = updatedProject.exterior || { ...DEFAULT_EXTERIOR };
        updatedProject.exterior = { 
          ...ext, 
          showRoof: true, 
          roofType: action.roofType 
        };
        break;
      }
      case "CHANGE_TIME_OF_DAY": {
        const ext = updatedProject.exterior || { ...DEFAULT_EXTERIOR };
        updatedProject.exterior = { 
          ...ext, 
          timeOfDay: action.timeOfDay 
        };
        break;
      }
      case "UPDATE_BUDGET":
      case "RESIZE_ROOM":
      case "SEARCH_MATERIAL":
      case "RECALCULATE_COST":
      case "COMPARE_COST_SCENARIO":
      case "GENERATE_BOQ":
        break;
    }

    return { valid: true, updatedProject };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}
