"use client";

import { usePlannerStore } from "@/store/plannerStore";
import { Undo, Redo, Save, ZoomIn, ZoomOut, Maximize, Grid3X3, Magnet, MousePointer2 } from "lucide-react";
import { FloorData } from "@/models/project";
import { v4 as uuidv4 } from 'uuid';

export default function Topbar({ onSave, saveStatus, projectName }: { onSave: () => void; saveStatus: string; projectName: string }) {
  const { 
    undo, redo, past, future, 
    scale, setScale, 
    snapToGrid, toggleSnap,
    floors, activeFloorId, setActiveFloor, initProject,
    setPan
  } = usePlannerStore();

  const handleLoadDemo = () => {
    if (!window.confirm("This will overwrite the current unsaved design. Continue?")) return;
    
    const demoFloor: FloorData = {
      id: uuidv4(),
      level: 0,
      name: 'Ground Floor (Demo)',
      elevation: 0,
      height: 3,
      rooms: [
        { id: uuidv4(), name: 'Living Room', type: 'Living', position: {x: 2, y: 2}, width: 5, height: 4, ceilingHeight: 3, floorId: 'demo' },
        { id: uuidv4(), name: 'Bedroom', type: 'Bedroom', position: {x: 7, y: 2}, width: 4, height: 4, ceilingHeight: 3, floorId: 'demo' }
      ],
      walls: [
        { id: uuidv4(), startPoint: {x: 2, y: 2}, endPoint: {x: 11, y: 2}, thickness: 0.2, height: 3 },
        { id: uuidv4(), startPoint: {x: 11, y: 2}, endPoint: {x: 11, y: 6}, thickness: 0.2, height: 3 },
        { id: uuidv4(), startPoint: {x: 11, y: 6}, endPoint: {x: 2, y: 6}, thickness: 0.2, height: 3 },
        { id: uuidv4(), startPoint: {x: 2, y: 6}, endPoint: {x: 2, y: 2}, thickness: 0.2, height: 3 },
        { id: uuidv4(), startPoint: {x: 7, y: 2}, endPoint: {x: 7, y: 6}, thickness: 0.1, height: 3 } // interior wall
      ],
      doors: [
        { id: uuidv4(), wallId: 'mock', position: {x: 7, y: 4}, width: 0.9, height: 2.1, type: 'single' }
      ],
      windows: [
        { id: uuidv4(), wallId: 'mock', position: {x: 4, y: 2}, width: 1.5, height: 1.2, sillHeight: 0.9, type: 'sliding' }
      ],
      furniture: [
        { id: uuidv4(), type: 'sofa', name: '3 Seater Sofa', position: {x: 4, y: 5}, rotation: 0, dimensions: { width: 2.2, height: 0.9 } },
        { id: uuidv4(), type: 'bed', name: 'Queen Bed', position: {x: 9, y: 3}, rotation: 90, dimensions: { width: 1.6, height: 2.0 } }
      ]
    };
    initProject([demoFloor], { plotWidth: 20, plotLength: 30 } as any, { 
      roofType: 'flat', showRoof: true, 
      compoundWall: { height: 1.8, thickness: 0.2, materialId: '', show: true }, 
      gate: { position: { x: 10, y: 30 }, width: 4, height: 1.8, type: 'sliding' }, 
      driveway: { width: 4, materialId: '', position: { x: 10, y: 28 } }, 
      parking: { spaces: 1, position: { x: 7, y: 28 } }, 
      trees: [], timeOfDay: 'afternoon' 
    });
    setPan({ x: 50, y: 50 });
  };

  return (
    <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-4">
        <span className="font-semibold text-slate-800 hidden sm:block">{projectName}</span>
        
        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

        <div className="flex items-center gap-1">
          <button onClick={undo} disabled={past.length === 0} className="p-1.5 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors" title="Undo (Ctrl+Z)">
            <Undo className="w-5 h-5" />
          </button>
          <button onClick={redo} disabled={future.length === 0} className="p-1.5 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors" title="Redo (Ctrl+Y)">
            <Redo className="w-5 h-5" />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <div className="flex items-center gap-1">
          <button onClick={() => setScale(scale * 1.2)} className="p-1.5 rounded text-slate-600 hover:bg-slate-100 transition-colors" title="Zoom In">
            <ZoomIn className="w-5 h-5" />
          </button>
          <span className="text-xs font-medium text-slate-500 w-10 text-center">{Math.round(scale)}%</span>
          <button onClick={() => setScale(scale / 1.2)} className="p-1.5 rounded text-slate-600 hover:bg-slate-100 transition-colors" title="Zoom Out">
            <ZoomOut className="w-5 h-5" />
          </button>
          <button onClick={() => { setScale(50); setPan({x: 0, y: 0}); }} className="p-1.5 rounded text-slate-600 hover:bg-slate-100 transition-colors" title="Fit to screen">
            <Maximize className="w-5 h-5" />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <div className="flex items-center gap-1">
          <button onClick={toggleSnap} className={`p-1.5 rounded transition-colors ${snapToGrid ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`} title="Snap to Grid">
            <Magnet className="w-5 h-5" />
          </button>
          {/* We will always render the grid but snapping can be toggled */}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <select 
          value={activeFloorId || ''} 
          onChange={e => setActiveFloor(e.target.value)}
          className="text-sm border border-slate-300 rounded px-2 py-1 bg-slate-50 focus:outline-none focus:border-blue-500"
        >
          {floors.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        
        <button onClick={handleLoadDemo} className="text-xs font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-2 py-1.5 rounded border border-amber-200 transition-colors">
          Load Demo Plan
        </button>

        <button 
          onClick={onSave}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          {saveStatus === 'idle' && "Save"}
          {saveStatus === 'saving' && "Saving..."}
          {saveStatus === 'saved' && "Saved"}
          {saveStatus === 'error' && "Save Failed"}
        </button>
      </div>
    </div>
  );
}
