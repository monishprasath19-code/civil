"use client";

import { usePlannerStore } from '@/store/plannerStore';
import { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Layers, Calculator, FileText, Ruler } from 'lucide-react';
import Link from 'next/link';

export default function ProfessionalToolsPanel({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const floors = usePlannerStore(state => state.floors);
  const site = usePlannerStore(state => state.site);
  const costEstimate = usePlannerStore(state => state.costEstimate);
  const exterior = usePlannerStore(state => state.exterior);

  // Derive Health Data
  const getWarnings = () => {
    let w = [];
    if (floors.length === 0) w.push("No floors created.");
    floors.forEach(f => {
      if (f.rooms.length === 0) w.push(`Floor ${f.name} has no rooms.`);
      f.rooms.forEach(r => {
        if (!r.floorMaterialId) w.push(`Room ${r.name} has no flooring material.`);
      });
      f.furniture.forEach(fu => {
        if (!fu.roomId) w.push(`Furniture ${fu.name} is placed outside of a room.`);
      });
    });
    if (!exterior?.roofType) w.push("No roof configured.");
    if (!costEstimate) w.push("Cost estimate not generated.");
    return w;
  };

  const warnings = getWarnings();
  
  let builtUpArea = 0;
  floors.forEach(f => f.rooms.forEach(r => builtUpArea += (r.width * r.height)));

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-20 right-4 p-2 bg-white text-slate-700 rounded-md shadow border border-slate-200 hover:bg-slate-50 flex items-center gap-2 z-10"
      >
        <ShieldAlert className="w-4 h-4 text-slate-500" />
        <span className="text-xs font-medium">Professional Tools</span>
      </button>
    );
  }

  return (
    <div className="absolute top-20 right-4 w-80 bg-white/95 backdrop-blur shadow-xl rounded-xl border border-slate-200 z-10 flex flex-col max-h-[80vh]">
      <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
        <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          Civil Tools & Health
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Project Health */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Project Health</h4>
          <div className="space-y-2">
            {warnings.length === 0 ? (
              <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 p-2 rounded border border-green-100">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <p>All core civil data is valid.</p>
              </div>
            ) : (
              warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded border border-amber-100">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{w}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Geometry / Measurement */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Geometry Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-slate-50 rounded border border-slate-100">
              <span className="text-xs text-slate-500 block">Plot Area</span>
              <span className="font-medium text-slate-800">{site?.plotArea || 0} sqm</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-100">
              <span className="text-xs text-slate-500 block">Built-up</span>
              <span className="font-medium text-slate-800">{builtUpArea.toFixed(1)} sqm</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-100">
              <span className="text-xs text-slate-500 block">Floors</span>
              <span className="font-medium text-slate-800">{floors.length}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-100">
              <span className="text-xs text-slate-500 block">Rooms</span>
              <span className="font-medium text-slate-800">{floors.reduce((a,f) => a + f.rooms.length, 0)}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Professional Modules</h4>
          <div className="space-y-2">
            <Link href={`/dashboard/projects/${projectId}/cost`} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded border border-transparent hover:border-slate-200 transition-colors group">
              <div className="flex items-center gap-2 text-sm text-slate-700 font-medium group-hover:text-blue-600">
                <Calculator className="w-4 h-4" /> Cost Estimate & BOQ
              </div>
              <span className="text-xs text-slate-400">View &rarr;</span>
            </Link>
            <Link href={`/dashboard/projects/${projectId}/3d`} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded border border-transparent hover:border-slate-200 transition-colors group">
              <div className="flex items-center gap-2 text-sm text-slate-700 font-medium group-hover:text-blue-600">
                <Layers className="w-4 h-4" /> 3D Exterior / Interior
              </div>
              <span className="text-xs text-slate-400">View &rarr;</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
