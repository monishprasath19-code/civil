"use client";

import { FurnitureRegistry } from "./furniture/Registry";
import { usePlannerStore } from "@/store/plannerStore";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function FurnitureLibrary() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<'All' | 'Living' | 'Bedroom' | 'Dining' | 'Kitchen' | 'Bathroom'>('All');
  
  const addFurniture = usePlannerStore(state => state.addFurniture);
  const activeFloorId = usePlannerStore(state => state.activeFloorId);

  const handleAdd = (assetId: string) => {
    const asset = FurnitureRegistry[assetId];
    if (!asset || !activeFloorId) return;

    // Drop it in center of the world for now. (A proper preview placement tool is better, but this works for basic addition)
    addFurniture({
      type: asset.id,
      name: asset.name,
      position: { x: 5, y: 5 }, // Default drop position
      rotation: 0,
      dimensions: { width: asset.defaultDimensions.width, height: asset.defaultDimensions.depth },
      roomId: ''
    });
  };

  const assets = Object.values(FurnitureRegistry).filter(a => category === 'All' || a.category === category);

  return (
    <div className="absolute left-4 bottom-4 z-10">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Furniture
        </button>
      )}

      {isOpen && (
        <div className="w-80 bg-white/95 backdrop-blur shadow-lg border border-slate-200 rounded-lg overflow-hidden flex flex-col max-h-[60vh]">
          <div className="flex items-center justify-between p-3 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 text-sm">Furniture Library</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
              &times;
            </button>
          </div>
          
          <div className="flex gap-2 px-3 py-2 border-b border-slate-100 overflow-x-auto shrink-0 no-scrollbar">
            {['All', 'Living', 'Bedroom', 'Dining', 'Kitchen', 'Bathroom'].map(cat => (
              <button 
                key={cat}
                onClick={() => setCategory(cat as any)}
                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${category === cat ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-3">
            {assets.map(asset => (
              <button 
                key={asset.id}
                onClick={() => handleAdd(asset.id)}
                className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded hover:border-blue-400 hover:bg-blue-50 transition-colors text-center group"
              >
                <div className="w-12 h-12 bg-slate-100 rounded mb-2 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                  <BoxIcon />
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700 line-clamp-2">{asset.name}</span>
                <span className="text-[10px] text-slate-400 mt-1">{asset.defaultDimensions.width} x {asset.defaultDimensions.depth}m</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BoxIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
}
