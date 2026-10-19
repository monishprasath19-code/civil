import { ProjectState, FloorData, Furniture, Room, Wall, Door, Window } from '@/models/project';
import { UnifiedAction } from './schema';
import { FurnitureRegistry } from '@/components/three/furniture/Registry';
import { v4 as uuidv4 } from 'uuid';

export interface ValidationResult {
  valid: boolean;
  error?: string;
  updatedProject?: ProjectState;
}

// Simple helpers
function getSemanticPosition(semanticArg: any, floor: FloorData): { x: number, y: number } {
  // A deterministic resolver. If it fails to resolve properly, it returns center of something.
  if (!semanticArg || semanticArg.x !== undefined) {
    return { x: semanticArg?.x || 5, y: semanticArg?.y || 5 };
  }

  const { semantic, referenceId } = semanticArg;
  
  if (semantic === 'NEAR_WINDOW' && floor.windows.length > 0) {
    const win = floor.windows[0];
    const wall = floor.walls.find(w => w.id === win.wallId);
    if (wall) {
      // Just offset a bit from the start point
      return { x: wall.startPoint.x + 1, y: wall.startPoint.y + 1 };
    }
  }

  if (semantic === 'NEAR_DOOR' && floor.doors.length > 0) {
    const door = floor.doors[0];
    const wall = floor.walls.find(w => w.id === door.wallId);
    if (wall) {
      return { x: wall.startPoint.x + 1, y: wall.startPoint.y + 1 };
    }
  }

  if (semantic === 'CENTER' && floor.rooms.length > 0) {
    const r = floor.rooms[0];
    return { x: r.position.x + r.width / 2, y: r.position.y + r.height / 2 };
  }

  // Fallback
  return { x: 5, y: 5 };
}

export function validateUnifiedAction(action: UnifiedAction, project: ProjectState, activeFloorId?: string): ValidationResult {
  let updatedProject = { ...project };
  
  // Clone floors and active floor to allow safe mutation
  const activeFloorIndex = project.floors.findIndex(f => f.id === activeFloorId);
  if (activeFloorIndex !== -1) {
    updatedProject.floors = [...project.floors];
    updatedProject.floors[activeFloorIndex] = { ...project.floors[activeFloorIndex], 
      furniture: [...project.floors[activeFloorIndex].furniture],
      rooms: [...project.floors[activeFloorIndex].rooms]
    };
  }
  
  const floor = activeFloorIndex !== -1 ? updatedProject.floors[activeFloorIndex] : null;

  try {
    switch (action.type) {
      case "ADD_FURNITURE": {
        if (!floor) return { valid: false, error: 'No active floor' };
        const asset = FurnitureRegistry[action.assetId];
        if (!asset) return { valid: false, error: 'Invalid asset ID' };
        
        const pos = getSemanticPosition(action.position, floor);
        const newFurn: Furniture = {
          id: uuidv4(),
          type: action.assetId,
          name: asset.name,
          position: pos,
          rotation: action.rotation || 0,
          dimensions: { width: asset.defaultDimensions.width, height: asset.defaultDimensions.depth },
          roomId: action.roomId || ''
        };
        floor.furniture.push(newFurn);
        break;
      }
      case "MOVE_FURNITURE": {
        if (!floor) return { valid: false, error: 'No active floor' };
        const idx = floor.furniture.findIndex(f => f.id === action.furnitureId);
        if (idx === -1) return { valid: false, error: 'Furniture not found' };
        const pos = getSemanticPosition(action.targetPosition, floor);
        floor.furniture[idx] = { ...floor.furniture[idx], position: pos };
        break;
      }
      case "DELETE_FURNITURE": {
        if (!floor) return { valid: false, error: 'No active floor' };
        floor.furniture = floor.furniture.filter(f => f.id !== action.furnitureId);
        break;
      }
      case "APPLY_MATERIAL": {
        if (action.targetType === 'exterior' && updatedProject.exterior) {
          updatedProject.exterior = { ...updatedProject.exterior };
          // Naive mapping based on ID since action doesn't specify exact surface for exterior
          if (action.targetId === 'roof') updatedProject.exterior.roofMaterialId = action.materialId;
          else if (action.targetId === 'driveway' && updatedProject.exterior.driveway) updatedProject.exterior.driveway.materialId = action.materialId;
          else if (action.targetId === 'compound_wall' && updatedProject.exterior.compoundWall) updatedProject.exterior.compoundWall.materialId = action.materialId;
        } else if (floor) {
          if (action.targetType === 'room') {
            const idx = floor.rooms.findIndex(r => r.id === action.targetId);
            if (idx !== -1) floor.rooms[idx] = { ...floor.rooms[idx], floorMaterialId: action.materialId };
          }
          if (action.targetType === 'wall') {
            const idx = floor.walls.findIndex(w => w.id === action.targetId);
            if (idx !== -1) floor.walls[idx] = { ...floor.walls[idx], materialId: action.materialId };
          }
          if (action.targetType === 'furniture') {
             const idx = floor.furniture.findIndex(f => f.id === action.targetId);
             if (idx !== -1) floor.furniture[idx] = { ...floor.furniture[idx], materialId: action.materialId };
          }
        }
        break;
      }
      case "ADD_TREE": {
        if (!updatedProject.exterior) return { valid: false, error: "No exterior configured" };
        const pos = getSemanticPosition(action.position, floor || { walls:[], doors:[], windows:[], rooms:[], furniture:[], level:0, id:'', name:'', elevation:0, height:3 });
        updatedProject.exterior = {
          ...updatedProject.exterior,
          trees: [
            ...updatedProject.exterior.trees,
            { id: uuidv4(), type: 'tree', position: pos, scale: 1.0 }
          ]
        };
        break;
      }
      case "CHANGE_ROOF": {
        if (!updatedProject.exterior) return { valid: false, error: "No exterior configured" };
        updatedProject.exterior = { ...updatedProject.exterior, showRoof: true, roofType: action.roofType };
        break;
      }
      case "CHANGE_TIME_OF_DAY": {
        if (!updatedProject.exterior) return { valid: false, error: "No exterior configured" };
        updatedProject.exterior = { ...updatedProject.exterior, timeOfDay: action.timeOfDay };
        break;
      }
      // Actions that don't directly modify the project state in a way that needs validation here
      case "UPDATE_BUDGET":
      case "RESIZE_ROOM":
      case "SEARCH_MATERIAL":
      case "RECALCULATE_COST":
      case "COMPARE_COST_SCENARIO":
      case "GENERATE_BOQ":
        // Handled by UI layers or specific stores directly
        break;
    }

    return { valid: true, updatedProject };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}
