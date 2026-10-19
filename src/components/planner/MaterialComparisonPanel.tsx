"use client";

import { useState } from "react";
import { defaultMaterials } from "@/data/materials";
import { X, ArrowRightLeft } from "lucide-react";

export default function MaterialComparisonPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [matA, setMatA] = useState(defaultMaterials[0].id);
  const [matB, setMatB] = useState(defaultMaterials[1].id);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-32 right-4 p-2 bg-white text-slate-700 rounded-md shadow border border-slate-200 hover:bg-slate-50 flex items-center gap-2 z-10"
      >
        <ArrowRightLeft className="w-4 h-4 text-slate-500" />
        <span className="text-xs font-medium">Compare</span>
      </button>
    );
  }

  const m1 = defaultMaterials.find(m => m.id === matA);
  const m2 = defaultMaterials.find(m => m.id === matB);

  return (
    <div className="absolute top-32 right-4 w-[500px] bg-white/95 backdrop-blur shadow-xl rounded-xl border border-slate-200 z-50 flex flex-col">
      <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
        <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-blue-600" />
          Material Comparison
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 grid grid-cols-3 gap-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center text-xs font-medium text-slate-500">Select Materials</div>
        <select value={matA} onChange={e => setMatA(e.target.value)} className="text-sm p-1 border rounded w-full">
          {defaultMaterials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={matB} onChange={e => setMatB(e.target.value)} className="text-sm p-1 border rounded w-full">
          {defaultMaterials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      <div className="p-4">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-2 text-slate-500 font-medium">Property</th>
              <th className="py-2 font-semibold">{m1?.name}</th>
              <th className="py-2 font-semibold">{m2?.name}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-2 text-slate-500">Category</td>
              <td className="py-2 capitalize">{m1?.category.replace('_', ' ')}</td>
              <td className="py-2 capitalize">{m2?.category.replace('_', ' ')}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2 text-slate-500">Style</td>
              <td className="py-2 capitalize">{m1?.style}</td>
              <td className="py-2 capitalize">{m2?.style}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2 text-slate-500">Price</td>
              <td className="py-2">₹{m1?.price} / {m1?.priceUnit}</td>
              <td className="py-2">₹{m2?.price} / {m2?.priceUnit}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2 text-slate-500">Roughness</td>
              <td className="py-2">{m1?.roughness !== undefined ? m1.roughness : 'N/A'}</td>
              <td className="py-2">{m2?.roughness !== undefined ? m2.roughness : 'N/A'}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2 text-slate-500">Durability</td>
              <td className="py-2">{m1?.tags?.includes('durable') ? 'High' : 'Standard'}</td>
              <td className="py-2">{m2?.tags?.includes('durable') ? 'High' : 'Standard'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
