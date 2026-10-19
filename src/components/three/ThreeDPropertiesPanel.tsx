"use client";

import { usePlannerStore } from "@/store/plannerStore";
import { FurnitureRegistry } from "./furniture/Registry";
import { useState } from "react";
import MaterialLibrary from "../materials/MaterialLibrary";
import { MaterialCategory } from "@/models/project";
import { defaultMaterials } from "@/data/materials";

export default function ThreeDPropertiesPanel({ selectedId }: { selectedId: string | null }) {
  const activeFloorId = usePlannerStore(state => state.activeFloorId);
  const floors = usePlannerStore(state => state.floors);
  const updateFurniture = usePlannerStore(state => state.updateFurniture);
  const updateWall = usePlannerStore(state => state.updateWall);
  const updateRoom = usePlannerStore(state => state.updateRoom);
  const deleteObject = usePlannerStore(state => state.deleteObject);

  const [isMaterialLibOpen, setIsMaterialLibOpen] = useState(false);

  if (!selectedId) return null;
  
  // We need to scan all floors in case they selected something on another floor while in full view
  // But for now let's just scan all arrays in all floors to find the object type
  let selectedObj: any = null;
  let objType: 'furniture' | 'wall' | 'room' | 'door' | 'window' | null = null;
  let objFloorId = "";

  for (const f of floors) {
    if (f.furniture.find(x => x.id === selectedId)) { selectedObj = f.furniture.find(x => x.id === selectedId); objType = 'furniture'; objFloorId = f.id; break; }
    if (f.walls.find(x => x.id === selectedId)) { selectedObj = f.walls.find(x => x.id === selectedId); objType = 'wall'; objFloorId = f.id; break; }
    if (f.rooms.find(x => x.id === selectedId)) { selectedObj = f.rooms.find(x => x.id === selectedId); objType = 'room'; objFloorId = f.id; break; }
    // ignoring door/window for now to keep it simple, but could add
  }

  if (!selectedObj) return null;

  const handleNumChange = (field: string, val: string) => {
    const n = parseFloat(val);
    if (isNaN(n)) return;
    if (objType === 'furniture') {
      if (field === 'width' || field === 'height') {
        updateFurniture(selectedId, { dimensions: { ...selectedObj.dimensions, [field]: n } });
      } else if (field === 'x' || field === 'y') {
        updateFurniture(selectedId, { position: { ...selectedObj.position, [field]: n } });
      } else if (field === 'rotation') {
        updateFurniture(selectedId, { rotation: n });
      }
    }
  };

  const handleMaterialChange = (materialId: string) => {
    if (objType === 'furniture') updateFurniture(selectedId, { materialId });
    if (objType === 'wall') updateWall(selectedId, { materialId });
    if (objType === 'room') updateRoom(selectedId, { floorMaterialId: materialId });
  };

  const materialCat: MaterialCategory = objType === 'wall' ? 'wall' : objType === 'room' ? 'floor' : 'furniture';

  const currentMatId = objType === 'room' ? selectedObj.floorMaterialId : selectedObj.materialId;
  const currentMat = defaultMaterials.find(m => m.id === currentMatId);

  return (
    <>
      <div className="absolute right-4 top-4 z-10 w-64 bg-white/95 backdrop-blur shadow-sm p-4 rounded-lg border border-slate-200 text-sm text-slate-800">
        <h3 className="font-semibold text-base mb-2 border-b border-slate-100 pb-2 capitalize">
          {objType} Properties
        </h3>
        
        <div className="space-y-3">
          {objType === 'furniture' && (
            <>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Name</label>
                <input 
                  type="text" 
                  value={selectedObj.name} 
                  onChange={e => updateFurniture(selectedId, { name: e.target.value })} 
                  className="w-full p-1.5 border rounded text-sm" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Pos X (m)</label>
                  <input type="number" step="0.1" value={selectedObj.position.x} onChange={e => handleNumChange('x', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Pos Z (m)</label>
                  <input type="number" step="0.1" value={selectedObj.position.y} onChange={e => handleNumChange('y', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Rotation (deg)</label>
                <input type="number" step="15" value={selectedObj.rotation || 0} onChange={e => handleNumChange('rotation', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Width (m)</label>
                  <input type="number" step="0.1" value={selectedObj.dimensions.width} onChange={e => handleNumChange('width', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Depth (m)</label>
                  <input type="number" step="0.1" value={selectedObj.dimensions.height} onChange={e => handleNumChange('height', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                </div>
              </div>
            </>
          )}

          {/* Material Selection Block */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs text-slate-500 mb-1">Material</label>
            <div 
              className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => setIsMaterialLibOpen(true)}
            >
              <div 
                className="w-8 h-8 rounded border shadow-inner"
                style={{ backgroundColor: currentMat?.color || '#e2e8f0', backgroundImage: currentMat?.textureUrl ? `url(${currentMat.textureUrl})` : 'none', backgroundSize: 'cover' }}
              />
              <div className="flex-1 overflow-hidden">
                <p className="font-medium text-xs truncate">{currentMat?.name || 'Default'}</p>
                <p className="text-[10px] text-slate-500">{currentMat?.style || 'Standard'}</p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-2 border-t border-slate-100">
            {objType === 'furniture' && (
              <button 
                onClick={() => updateFurniture(selectedId, { rotation: 0 })}
                className="flex-1 px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors text-xs font-medium"
              >
                Reset
              </button>
            )}
            <button 
              onClick={() => deleteObject(selectedId)}
              className="flex-1 px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors text-xs font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <MaterialLibrary 
        isOpen={isMaterialLibOpen}
        onClose={() => setIsMaterialLibOpen(false)}
        categoryFilter={materialCat}
        onSelect={handleMaterialChange}
      />
    </>
  );
}
