"use client";

import { usePlannerStore } from "@/store/plannerStore";
import { useState } from "react";
import MaterialLibrary from "../../materials/MaterialLibrary";
import { MaterialCategory } from "@/models/project";
import { defaultMaterials } from "@/data/materials";

export default function ExteriorPropertiesPanel({ viewTarget }: { viewTarget: string }) {
  const exterior = usePlannerStore(state => state.exterior);
  const updateExterior = usePlannerStore(state => state.updateExterior);

  const [libOpen, setLibOpen] = useState(false);
  const [activeSelectType, setActiveSelectType] = useState<MaterialCategory | null>(null);

  if ((viewTarget !== 'exterior' && viewTarget !== 'full') || !exterior) return null;

  const handleOpenLib = (cat: MaterialCategory) => {
    setActiveSelectType(cat);
    setLibOpen(true);
  };

  const handleMatSelect = (id: string) => {
    if (activeSelectType === 'roof') {
      updateExterior({ roofMaterialId: id });
    } else if (activeSelectType === 'compound_wall') {
      updateExterior({ compoundWall: { ...exterior.compoundWall, materialId: id } });
    } else if (activeSelectType === 'driveway') {
      updateExterior({ driveway: { ...exterior.driveway, materialId: id } });
    }
  };

  const renderMatBlock = (title: string, cat: MaterialCategory, matId?: string) => {
    const mat = defaultMaterials.find(m => m.id === matId);
    return (
      <div className="mt-2">
        <span className="text-xs text-slate-500 mb-1 block">{title} Material</span>
        <div 
          className="flex items-center gap-2 p-1.5 border rounded cursor-pointer hover:border-blue-500 transition-colors"
          onClick={() => handleOpenLib(cat)}
        >
          <div className="w-6 h-6 rounded border shadow-inner" style={{ backgroundColor: mat?.color || '#e2e8f0', backgroundImage: mat?.textureUrl ? `url(${mat.textureUrl})` : 'none', backgroundSize: 'cover' }} />
          <div className="flex-1 overflow-hidden">
            <p className="font-medium text-xs truncate">{mat?.name || 'Default'}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="absolute right-4 top-24 z-10 w-64 bg-white/95 backdrop-blur shadow-sm p-4 rounded-lg border border-slate-200 text-sm text-slate-800 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
        <div>
          <h3 className="font-semibold text-base mb-2 border-b border-slate-100 pb-2">Exterior Settings</h3>
          
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" checked={exterior.showRoof} onChange={e => updateExterior({ showRoof: e.target.checked })} />
            Show Roof
          </label>
          
          {exterior.showRoof && (
            <>
              <select 
                value={exterior.roofType} 
                onChange={e => updateExterior({ roofType: e.target.value as any })}
                className="w-full mt-2 p-1.5 border rounded text-sm"
              >
                <option value="flat">Flat Roof</option>
                <option value="sloped">Sloped Roof</option>
              </select>
              {renderMatBlock("Roof", "roof", exterior.roofMaterialId)}
            </>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 font-medium">
            <input type="checkbox" checked={exterior.compoundWall.show} onChange={e => updateExterior({ compoundWall: { ...exterior.compoundWall, show: e.target.checked } })} />
            Compound Wall
          </label>
          {exterior.compoundWall.show && (
            <>
              <div className="mt-2">
                <span className="text-xs text-slate-500">Height (m)</span>
                <input type="number" step="0.1" value={exterior.compoundWall.height} onChange={e => updateExterior({ compoundWall: { ...exterior.compoundWall, height: parseFloat(e.target.value) || 1 } })} className="w-full p-1 border rounded" />
              </div>
              {renderMatBlock("Wall", "exterior_wall", exterior.compoundWall.materialId)}
            </>
          )}
        </div>
        
        <div>
          <span className="font-medium">Driveway</span>
          <div className="mt-2">
            <span className="text-xs text-slate-500">Width (m)</span>
            <input type="number" step="0.5" value={exterior.driveway.width} onChange={e => updateExterior({ driveway: { ...exterior.driveway, width: parseFloat(e.target.value) || 2 } })} className="w-full p-1 border rounded" />
          </div>
          {renderMatBlock("Surface", "driveway", exterior.driveway.materialId)}
        </div>
        
        <div>
          <span className="font-medium">Parking Spaces</span>
          <select 
            value={exterior.parking.spaces} 
            onChange={e => updateExterior({ parking: { ...exterior.parking, spaces: parseInt(e.target.value) } })}
            className="w-full mt-2 p-1.5 border rounded text-sm"
          >
            <option value={0}>None</option>
            <option value={1}>1 Car</option>
            <option value={2}>2 Cars</option>
          </select>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button 
            onClick={() => {
              const newTree = {
                id: Math.random().toString(36).substr(2, 9),
                position: { x: Math.random() * 10, y: Math.random() * 10 },
                type: 'tree' as const,
                scale: 0.8 + Math.random() * 0.5
              };
              updateExterior({ trees: [...exterior.trees, newTree] });
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-sm font-medium transition-colors"
          >
            Plant Random Tree
          </button>
        </div>
      </div>

      <MaterialLibrary 
        isOpen={libOpen}
        onClose={() => setLibOpen(false)}
        categoryFilter={activeSelectType!}
        onSelect={handleMatSelect}
      />
    </>
  );
}
