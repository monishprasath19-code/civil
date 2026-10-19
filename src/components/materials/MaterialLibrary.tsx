"use client";

import { useState, useEffect } from "react";
import { Material, MaterialCategory, MaterialStyle } from "@/models/project";
import { materialService } from "@/services/materials/provider";
import { Search, X } from "lucide-react";

export default function MaterialLibrary({ 
  isOpen, 
  onClose, 
  categoryFilter,
  onSelect 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  categoryFilter?: MaterialCategory | MaterialCategory[]; 
  onSelect: (materialId: string) => void;
}) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [query, setQuery] = useState("");
  const [styleFilter, setStyleFilter] = useState<MaterialStyle | "">("");
  
  useEffect(() => {
    if (!isOpen) return;

    // Build category array if single
    let catFilter: MaterialCategory | undefined;
    if (categoryFilter && !Array.isArray(categoryFilter)) {
      catFilter = categoryFilter;
    } else if (Array.isArray(categoryFilter) && categoryFilter.length === 1) {
      catFilter = categoryFilter[0];
    }

    materialService.searchMaterials({ 
      query: query || undefined, 
      category: catFilter, 
      style: (styleFilter as MaterialStyle) || undefined 
    }).then(results => {
      // If categoryFilter is an array with > 1 item, filter it client-side
      if (Array.isArray(categoryFilter) && categoryFilter.length > 1) {
        setMaterials(results.filter(m => categoryFilter.includes(m.category)));
      } else {
        setMaterials(results);
      }
    });
  }, [isOpen, query, styleFilter, categoryFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Material Library</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-md text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search materials..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <select 
            value={styleFilter} 
            onChange={e => setStyleFilter(e.target.value as any)}
            className="border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Styles</option>
            <option value="Modern">Modern</option>
            <option value="Minimal">Minimal</option>
            <option value="Industrial">Industrial</option>
            <option value="Luxury">Luxury</option>
            <option value="Traditional">Traditional</option>
            <option value="Scandinavian">Scandinavian</option>
          </select>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {materials.map(mat => (
              <div 
                key={mat.id} 
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col"
                onClick={() => {
                  onSelect(mat.id);
                  onClose();
                }}
              >
                <div 
                  className="h-24 w-full bg-slate-100" 
                  style={{ 
                    backgroundColor: mat.color || '#e2e8f0',
                    backgroundImage: mat.textureUrl ? `url(${mat.textureUrl})` : 'none',
                    backgroundSize: 'cover'
                  }} 
                />
                <div className="p-3 flex-1 flex flex-col">
                  <span className="text-xs font-semibold text-blue-600 mb-1">{mat.category.toUpperCase()}</span>
                  <span className="font-medium text-slate-800 text-sm leading-tight mb-1">{mat.name}</span>
                  <div className="mt-auto pt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>{mat.style || 'Standard'}</span>
                    <span className="font-medium text-slate-700">${mat.price}/{mat.priceUnit}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {materials.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                No materials found matching your criteria.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
