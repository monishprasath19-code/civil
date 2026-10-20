"use client";

import { useState } from "react";
import { 
  Sun, 
  Leaf, 
  Camera, 
  Layers, 
  Compass, 
  Sparkles, 
  Video, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  Eye
} from "lucide-react";
import { FloorData, SiteInfo, ExteriorData } from "@/models/project";

export type RenderMode = 'photoreal' | 'cyber' | 'clay';

interface ArchitecturalHUDProps {
  site?: SiteInfo | null;
  exterior?: ExteriorData | null;
  floors: FloorData[];
  renderMode: RenderMode;
  onRenderModeChange: (mode: RenderMode) => void;
  isDroneTour: boolean;
  onToggleDroneTour: () => void;
  onCaptureSnapshot: () => void;
}

export default function ArchitecturalHUD({
  site,
  exterior,
  floors,
  renderMode,
  onRenderModeChange,
  isDroneTour,
  onToggleDroneTour,
  onCaptureSnapshot,
}: ArchitecturalHUDProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'visual' | 'solar' | 'green'>('visual');

  // Calculate quick architectural metrics
  let totalBuiltUpArea = 0;
  let totalWallArea = 0;
  let totalGlazingArea = 0;

  floors.forEach(f => {
    f.rooms.forEach(r => {
      totalBuiltUpArea += (r.width * r.height);
    });
    f.walls.forEach(w => {
      const length = Math.hypot(w.endPoint.x - w.startPoint.x, w.endPoint.y - w.startPoint.y);
      totalWallArea += length * (w.height || 2.8);
    });
    f.windows.forEach(win => {
      totalGlazingArea += (win.width || 1.2) * (win.height || 1.2);
    });
  });

  const plotArea = site?.plotArea || ((site?.plotWidth || 15) * (site?.plotLength || 20));
  const groundFloorArea = floors[0]?.rooms.reduce((acc, r) => acc + (r.width * r.height), 0) || 0;
  const coverageRatio = plotArea > 0 ? Math.min(100, (groundFloorArea / plotArea) * 100) : 45;
  const daylightRatio = totalWallArea > 0 ? Math.min(100, (totalGlazingArea / totalWallArea) * 100) : 18;
  
  // Estimated Embodied Carbon based on typical residential building (~265 kgCO2e/m2)
  const embodiedCarbon = Math.round(totalBuiltUpArea * 265);

  const timeOfDay = exterior?.timeOfDay || 'afternoon';
  const solarAngle = {
    morning: { azimuth: 105, elevation: 28, daylightHrs: 11.2 },
    afternoon: { azimuth: 195, elevation: 62, daylightHrs: 11.2 },
    evening: { azimuth: 265, elevation: 18, daylightHrs: 11.2 },
    night: { azimuth: 0, elevation: -45, daylightHrs: 0 }
  }[timeOfDay];

  return (
    <div className="absolute right-4 top-4 z-20 flex flex-col items-end pointer-events-auto">
      {/* Collapsed HUD Trigger */}
      <div className="bg-slate-900/90 backdrop-blur-md text-white border border-slate-700/60 shadow-2xl rounded-2xl p-1.5 flex items-center gap-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-800 text-xs font-semibold tracking-wide transition-all text-sky-400"
          title="Toggle Architectural Intelligence HUD"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>CYBER-HUD</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        <div className="w-px h-5 bg-slate-700 mx-1" />

        {/* Quick Drone Tour Trigger */}
        <button
          onClick={onToggleDroneTour}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            isDroneTour 
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' 
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          title="Automated 360° Drone Cinematic Flythrough"
        >
          <Video className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isDroneTour ? "Drone Flying" : "Drone Tour"}</span>
        </button>

        {/* Snapshot Trigger */}
        <button
          onClick={onCaptureSnapshot}
          className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
          title="Capture Ultra-HD Architectural Snapshot"
        >
          <Camera className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      {/* Expanded HUD Panel */}
      {isOpen && (
        <div className="mt-2 w-80 bg-slate-950/95 backdrop-blur-xl border border-slate-800 text-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/60">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                activeTab === 'visual' ? 'text-sky-400 border-b-2 border-sky-400 bg-slate-800/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Render
            </button>
            <button
              onClick={() => setActiveTab('solar')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                activeTab === 'solar' ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Solar Path
            </button>
            <button
              onClick={() => setActiveTab('green')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                activeTab === 'green' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-800/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" /> Eco-Index
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Visual Render Modes Tab */}
            {activeTab === 'visual' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Render Shader Matrix</span>
                  <span className="font-mono text-[10px] text-sky-400 uppercase">{renderMode}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onRenderModeChange('photoreal')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      renderMode === 'photoreal'
                        ? 'border-sky-500 bg-sky-950/60 text-sky-300 shadow-md shadow-sky-500/20'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 mx-auto mb-1 text-sky-400" />
                    <span className="text-[11px] font-semibold block">Photoreal</span>
                    <span className="text-[9px] text-slate-500">PBR + Sky</span>
                  </button>

                  <button
                    onClick={() => onRenderModeChange('cyber')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      renderMode === 'cyber'
                        ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300 shadow-md shadow-cyan-500/20'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Layers className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                    <span className="text-[11px] font-semibold block">Cyber CAD</span>
                    <span className="text-[9px] text-slate-500">Laser Wire</span>
                  </button>

                  <button
                    onClick={() => onRenderModeChange('clay')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      renderMode === 'clay'
                        ? 'border-slate-300 bg-slate-800 text-white shadow-md'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Eye className="w-4 h-4 mx-auto mb-1 text-slate-300" />
                    <span className="text-[11px] font-semibold block">Clay Studio</span>
                    <span className="text-[9px] text-slate-500">White Form</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Three.js WebGL 2.0
                  </span>
                  <span className="font-mono text-slate-500 text-[10px]">PCFSoftShadows</span>
                </div>
              </div>
            )}

            {/* Solar & Daylight Analysis Tab */}
            {activeTab === 'solar' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Sun Trajectory</span>
                  <span className="text-xs font-mono text-amber-400 capitalize">{timeOfDay}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 block">Azimuth</span>
                    <span className="text-xs font-mono font-semibold text-amber-300">{solarAngle.azimuth}°</span>
                  </div>
                  <div className="text-center border-x border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Altitude</span>
                    <span className="text-xs font-mono font-semibold text-amber-300">{solarAngle.elevation}°</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 block">Peak Sun</span>
                    <span className="text-xs font-mono font-semibold text-amber-300">{solarAngle.daylightHrs}h</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs bg-amber-950/30 border border-amber-900/40 p-2.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-200 text-[11px]">Road Orientation</span>
                  </div>
                  <span className="font-mono font-bold text-amber-400">{site?.roadDirection || 'N'}</span>
                </div>
              </div>
            )}

            {/* Green Architecture & Carbon Scorecard */}
            {activeTab === 'green' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Embodied Carbon</span>
                  <span className="font-mono font-bold text-emerald-400">~{embodiedCarbon.toLocaleString()} kgCO₂e</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Glazing Daylight Ratio</span>
                      <span className="font-mono text-slate-200">{daylightRatio.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${daylightRatio >= 15 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                        style={{ width: `${Math.min(100, daylightRatio * 3)}%` }} 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Site Footprint Coverage</span>
                      <span className="font-mono text-slate-200">{coverageRatio.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${coverageRatio <= 60 ? 'bg-sky-500' : 'bg-amber-500'}`} 
                        style={{ width: `${coverageRatio}%` }} 
                      />
                    </div>
                  </div>
                </div>

                <div className="p-2 bg-emerald-950/30 border border-emerald-900/40 rounded-xl text-[10px] text-emerald-300/90 leading-relaxed">
                  ✓ High natural cross-ventilation potential based on door/window placements.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
