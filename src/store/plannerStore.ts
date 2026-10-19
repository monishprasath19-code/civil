import { create } from 'zustand';
import { FloorData, Room, Wall, Door, Window, Furniture, Position, ExteriorData, SiteInfo } from '@/models/project';
import { v4 as uuidv4 } from 'uuid';

export type ToolType = 'select' | 'wall' | 'room' | 'door' | 'window' | 'furniture' | 'dimension' | 'measure';

interface HistoryState {
  floors: FloorData[];
  exterior?: ExteriorData;
}

import { CostEstimate } from '@/models/cost';
import { costEngine } from '@/services/cost/engine';

interface PlannerState {
  // UI State
  activeTool: ToolType;
  selectedIds: string[];
  scale: number;
  pan: Position;
  gridSize: number;
  snapToGrid: boolean;
  
  // Data State
  site: SiteInfo | null;
  floors: FloorData[];
  exterior?: ExteriorData;
  costEstimate?: CostEstimate;
  activeFloorId: string | null;
  
  // History
  past: HistoryState[];
  future: HistoryState[];

  // Actions
  setTool: (tool: ToolType) => void;
  select: (ids: string[]) => void;
  setPan: (pan: Position) => void;
  setScale: (scale: number) => void;
  toggleSnap: () => void;
  
  initProject: (floors: FloorData[], site: SiteInfo, exterior?: ExteriorData) => void;
  setFloors: (floors: FloorData[]) => void;
  setActiveFloor: (id: string) => void;
  
  // Exterior Mutations
  updateExterior: (updates: Partial<ExteriorData>) => void;
  updateProjectData: (floors: FloorData[], exterior?: ExteriorData) => void;

  generateCostEstimate: (overrides?: Record<string, { material?: number; labour?: number }>) => Promise<void>;

  // Mutations
  addWall: (wall: Omit<Wall, 'id'>) => void;
  updateWall: (id: string, updates: Partial<Wall>) => void;
  deleteObject: (id: string) => void;
  
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  
  addFurniture: (furn: Omit<Furniture, 'id'>) => void;
  updateFurniture: (id: string, updates: Partial<Furniture>) => void;

  addDoor: (door: Omit<Door, 'id'>) => void;
  updateDoor: (id: string, updates: Partial<Door>) => void;
  addWindow: (window: Omit<Window, 'id'>) => void;
  updateWindow: (id: string, updates: Partial<Window>) => void;
  
  undo: () => void;
  redo: () => void;
}

const saveHistory = (state: PlannerState, newFloors: FloorData[], newExterior?: ExteriorData) => {
  return {
    floors: newFloors,
    exterior: newExterior !== undefined ? newExterior : state.exterior,
    past: [...state.past, { floors: state.floors, exterior: state.exterior }].slice(-50),
    future: [],
  };
};

export const usePlannerStore = create<PlannerState>((set, get) => ({
  activeTool: 'select',
  selectedIds: [],
  scale: 50, // 50 pixels per meter
  pan: { x: 0, y: 0 },
  gridSize: 1, // 1 meter
  snapToGrid: true,
  
  site: null,
  floors: [],
  exterior: undefined,
  activeFloorId: null,
  
  past: [],
  future: [],

  setTool: (tool) => set({ activeTool: tool, selectedIds: [] }),
  select: (ids) => set({ selectedIds: ids }),
  setPan: (pan) => set({ pan }),
  setScale: (scale) => set({ scale }),
  toggleSnap: () => set((state) => ({ snapToGrid: !state.snapToGrid })),

  initProject: (floors, site, exterior) => {
    if (floors.length === 0) {
      const defaultFloor: FloorData = {
        id: uuidv4(),
        level: 0,
        name: 'Ground Floor',
        elevation: 0,
        height: 3,
        rooms: [], walls: [], doors: [], windows: [], furniture: []
      };
      set({ floors: [defaultFloor], site, exterior, activeFloorId: defaultFloor.id, past: [], future: [] });
    } else {
      set({ floors, site, exterior, activeFloorId: floors[0].id, past: [], future: [] });
    }
  },

  setFloors: (floors) => set((state) => saveHistory(state, floors)),

  setActiveFloor: (id) => set({ activeFloorId: id, selectedIds: [] }),

  updateExterior: (updates) => set((state) => {
    const newExt = { ...state.exterior, ...updates } as ExteriorData;
    return saveHistory(state, state.floors, newExt);
  }),

  updateProjectData: (floors, exterior) => set((state) => {
    return saveHistory(state, floors, exterior || state.exterior);
  }),

  generateCostEstimate: async (overrides = {}) => {
    const state = get();
    if (!state.site) return;
    
    // Convert current state to ProjectState mock for the engine
    const projectMock: any = {
      id: 'proj',
      site: state.site,
      floors: state.floors,
      exterior: state.exterior,
      materials: [],
      budget: { totalBudget: 5000000, constructionBudget: 3500000, interiorBudget: 1500000, exteriorBudget: 0, furnitureBudget: 0 } // Mock budget
    };

    const estimate = await costEngine.generateEstimate(projectMock, { userOverrides: overrides });
    set({ costEstimate: estimate });
  },

  addWall: (wallData) => set((state) => {
    const newFloors = state.floors.map(f => {
      if (f.id === state.activeFloorId) {
        return { ...f, walls: [...f.walls, { ...wallData, id: uuidv4() }] };
      }
      return f;
    });
    return saveHistory(state, newFloors);
  }),

  updateWall: (id, updates) => set((state) => {
    const newFloors = state.floors.map(f => {
      if (f.id === state.activeFloorId) {
        return {
          ...f,
          walls: f.walls.map(w => w.id === id ? { ...w, ...updates } : w)
        };
      }
      return f;
    });
    return saveHistory(state, newFloors);
  }),

  addRoom: (roomData) => set((state) => {
    const newFloors = state.floors.map(f => {
      if (f.id === state.activeFloorId) {
        return { ...f, rooms: [...f.rooms, { ...roomData, id: uuidv4() }] };
      }
      return f;
    });
    return saveHistory(state, newFloors);
  }),

  updateRoom: (id, updates) => set((state) => {
    const newFloors = state.floors.map(f => {
      if (f.id === state.activeFloorId) {
        return {
          ...f,
          rooms: f.rooms.map(r => r.id === id ? { ...r, ...updates } : r)
        };
      }
      return f;
    });
    return saveHistory(state, newFloors);
  }),

  addFurniture: (furnData) => set((state) => {
    const newFloors = state.floors.map(f => {
      if (f.id === state.activeFloorId) {
        return { ...f, furniture: [...f.furniture, { ...furnData, id: uuidv4() }] };
      }
      return f;
    });
    return saveHistory(state, newFloors);
  }),

  updateFurniture: (id, updates) => set((state) => {
    const newFloors = state.floors.map(f => {
      if (f.id === state.activeFloorId) {
        return {
          ...f,
          furniture: f.furniture.map(item => item.id === id ? { ...item, ...updates } : item)
        };
      }
      return f;
    });
    return saveHistory(state, newFloors);
  }),

  addDoor: (doorData) => set((state) => {
    const newFloors = state.floors.map(f => {
      if (f.id === state.activeFloorId) {
        return { ...f, doors: [...f.doors, { ...doorData, id: uuidv4() }] };
      }
      return f;
    });
    return saveHistory(state, newFloors);
  }),

  updateDoor: (id, updates) => set((state) => {
    const newFloors = state.floors.map(f => {
      if (f.id === state.activeFloorId) {
        return {
          ...f,
          doors: f.doors.map(d => d.id === id ? { ...d, ...updates } : d)
        };
      }
      return f;
    });
    return saveHistory(state, newFloors);
  }),

  addWindow: (winData) => set((state) => {
    const newFloors = state.floors.map(f => {
      if (f.id === state.activeFloorId) {
        return { ...f, windows: [...f.windows, { ...winData, id: uuidv4() }] };
      }
      return f;
    });
    return saveHistory(state, newFloors);
  }),

  updateWindow: (id, updates) => set((state) => {
    const newFloors = state.floors.map(f => {
      if (f.id === state.activeFloorId) {
        return {
          ...f,
          windows: f.windows.map(w => w.id === id ? { ...w, ...updates } : w)
        };
      }
      return f;
    });
    return saveHistory(state, newFloors);
  }),

  deleteObject: (id) => set((state) => {
    const newFloors = state.floors.map(f => {
      if (f.id === state.activeFloorId) {
        return {
          ...f,
          walls: f.walls.filter(w => w.id !== id),
          rooms: f.rooms.filter(r => r.id !== id),
          doors: f.doors.filter(d => d.id !== id),
          windows: f.windows.filter(w => w.id !== id),
          furniture: f.furniture.filter(furn => furn.id !== id),
        };
      }
      return f;
    });
    // Check if it's a tree in the exterior?
    let newExterior = state.exterior;
    if (state.exterior) {
      const treeCount = state.exterior.trees.length;
      const filteredTrees = state.exterior.trees.filter(t => t.id !== id);
      if (filteredTrees.length !== treeCount) {
        newExterior = { ...state.exterior, trees: filteredTrees };
      }
    }
    
    return {
      ...saveHistory(state, newFloors, newExterior),
      selectedIds: state.selectedIds.filter(selected => selected !== id)
    };
  }),

  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    return {
      floors: previous.floors,
      exterior: previous.exterior,
      past: newPast,
      future: [{ floors: state.floors, exterior: state.exterior }, ...state.future],
      selectedIds: []
    };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    return {
      floors: next.floors,
      exterior: next.exterior,
      past: [...state.past, { floors: state.floors, exterior: state.exterior }],
      future: newFuture,
      selectedIds: []
    };
  })
}));
