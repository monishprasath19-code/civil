"use client";

import { usePlannerStore } from "@/store/plannerStore";
import { Trash2 } from "lucide-react";

export default function PropertiesPanel() {
  const { selectedIds, floors, activeFloorId, updateWall, updateFurniture, deleteObject } = usePlannerStore();
  
  if (selectedIds.length === 0) {
    return (
      <div className="w-72 bg-white border-l border-slate-200 p-6 z-10 shadow-sm shrink-0 flex flex-col items-center justify-center text-slate-400">
        <p className="text-sm">No object selected</p>
      </div>
    );
  }

  const floor = floors.find(f => f.id === activeFloorId);
  if (!floor) return null;

  const id = selectedIds[0]; // for now handle single selection properties
  
  // Find object
  let obj: any = floor.walls.find(w => w.id === id);
  let type = 'wall';
  
  if (!obj) {
    obj = floor.rooms.find(r => r.id === id);
    type = 'room';
  }
  if (!obj) {
    obj = floor.furniture.find(f => f.id === id);
    type = 'furniture';
  }
  if (!obj) {
    obj = floor.doors.find(d => d.id === id);
    type = 'door';
  }
  if (!obj) {
    obj = floor.windows.find(w => w.id === id);
    type = 'window';
  }

  if (!obj) return null;

  const handleNumChange = (field: string, val: string, updater: any) => {
    const num = parseFloat(val);
    if (!isNaN(num)) updater(id, { [field]: num });
  };

  return (
    <div className="w-72 bg-white border-l border-slate-200 p-4 z-10 shadow-sm shrink-0 flex flex-col gap-6 overflow-y-auto">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="font-semibold text-slate-800 capitalize">{type} Properties</h3>
        <button onClick={() => deleteObject(id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Delete object">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {type === 'wall' && (
          <>
            <PropRow label="Thickness (m)">
              <input type="number" step="0.05" value={obj.thickness} onChange={e => handleNumChange('thickness', e.target.value, updateWall)} className="w-full p-1.5 border rounded text-sm" />
            </PropRow>
            <PropRow label="Height (m)">
              <input type="number" step="0.1" value={obj.height} onChange={e => handleNumChange('height', e.target.value, updateWall)} className="w-full p-1.5 border rounded text-sm" />
            </PropRow>
          </>
        )}

        {type === 'furniture' && (
          <>
            <PropRow label="Name">
              <input type="text" value={obj.name || ''} onChange={e => updateFurniture(id, { name: e.target.value })} className="w-full p-1.5 border rounded text-sm" />
            </PropRow>
            <PropRow label="Width (m)">
              <input type="number" step="0.1" value={obj.dimensions.width} onChange={e => updateFurniture(id, { dimensions: { ...obj.dimensions, width: parseFloat(e.target.value) || 0 } })} className="w-full p-1.5 border rounded text-sm" />
            </PropRow>
            <PropRow label="Depth (m)">
              <input type="number" step="0.1" value={obj.dimensions.height} onChange={e => updateFurniture(id, { dimensions: { ...obj.dimensions, height: parseFloat(e.target.value) || 0 } })} className="w-full p-1.5 border rounded text-sm" />
            </PropRow>
            <PropRow label="Rotation (°)">
              <input type="number" step="15" value={obj.rotation} onChange={e => handleNumChange('rotation', e.target.value, updateFurniture)} className="w-full p-1.5 border rounded text-sm" />
            </PropRow>
          </>
        )}
        
        {type === 'door' && (
          <>
            <PropRow label="Width (m)">
              <input type="number" step="0.1" value={obj.width} onChange={e => handleNumChange('width', e.target.value, usePlannerStore.getState().updateDoor)} className="w-full p-1.5 border rounded text-sm" />
            </PropRow>
            <PropRow label="Height (m)">
              <input type="number" step="0.1" value={obj.height} onChange={e => handleNumChange('height', e.target.value, usePlannerStore.getState().updateDoor)} className="w-full p-1.5 border rounded text-sm" />
            </PropRow>
          </>
        )}

        {type === 'window' && (
          <>
            <PropRow label="Width (m)">
              <input type="number" step="0.1" value={obj.width} onChange={e => handleNumChange('width', e.target.value, usePlannerStore.getState().updateWindow)} className="w-full p-1.5 border rounded text-sm" />
            </PropRow>
            <PropRow label="Height (m)">
              <input type="number" step="0.1" value={obj.height} onChange={e => handleNumChange('height', e.target.value, usePlannerStore.getState().updateWindow)} className="w-full p-1.5 border rounded text-sm" />
            </PropRow>
          </>
        )}

        {type === 'room' && (
          <>
            <PropRow label="Name">
              <input type="text" value={obj.name || ''} onChange={e => usePlannerStore.getState().updateRoom(id, { name: e.target.value })} className="w-full p-1.5 border rounded text-sm" />
            </PropRow>
            <PropRow label="Width (m)">
              <input type="number" step="0.1" value={obj.width} onChange={e => handleNumChange('width', e.target.value, usePlannerStore.getState().updateRoom)} className="w-full p-1.5 border rounded text-sm" />
            </PropRow>
            <PropRow label="Length (m)">
              <input type="number" step="0.1" value={obj.height} onChange={e => handleNumChange('height', e.target.value, usePlannerStore.getState().updateRoom)} className="w-full p-1.5 border rounded text-sm" />
            </PropRow>
            <div className="pt-2 text-sm font-medium text-slate-700">
              Area: {Math.round(obj.width * obj.height * 10) / 10} sq.m
            </div>
          </>
        )}
        
        {/* Additional types can be fleshed out here similarly */}
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
          ID: {id.split('-')[0]}...
        </div>
      </div>
    </div>
  );
}

function PropRow({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  );
}
