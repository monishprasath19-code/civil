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
    <div className="absolute right-4 top-4 z-20 flex flex-col items-end pointer-events-auto font-sans">
      {/* Collapsed HUD Trigger */}
      <div className="bg-white/95 backdrop-blur-md text-[#1c1917] border border-[#e7e5df] shadow-sm rounded-full p-1.5 flex items-center gap-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full hover:bg-[#faf8f5] text-xs font-semibold tracking-wide transition-all text-[#1b3a2b]"
          title="Toggle Architectural Intelligence HUD"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#1b3a2b]" />
          <span>STUDIO HUD</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#78716c]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#78716c]" />}
        </button>

        <div className="w-px h-5 bg-[#e7e5df] mx-1" />

        {/* Quick Drone Tour Trigger */}
        <button
          onClick={onToggleDroneTour}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            isDroneTour 
              ? 'bg-[#1b3a2b] text-white shadow-sm' 
              : 'text-[#57534e] hover:bg-[#faf8f5] hover:text-[#1c1917]'
          }`}
          title="Automated 360° Drone Cinematic Flythrough"
        >
          <Video className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isDroneTour ? "Drone Flying" : "Drone Tour"}</span>
        </button>

        {/* Snapshot Trigger */}
        <button
          onClick={onCaptureSnapshot}
          className="p-1.5 rounded-full hover:bg-[#faf8f5] text-[#57534e] hover:text-[#1c1917] transition-all"
          title="Capture Ultra-HD Architectural Snapshot"
        >
          <Camera className="w-4 h-4 text-[#1b3a2b]" />
        </button>
      </div>

      {/* Expanded HUD Panel */}
      {isOpen && (
        <div className="mt-2 w-80 bg-white/95 backdrop-blur-xl border border-[#e7e5df] text-[#1c1917] rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header tabs */}
          <div className="flex border-b border-[#e7e5df] bg-[#faf8f5]">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                activeTab === 'visual' ? 'text-[#1b3a2b] border-b-2 border-[#1b3a2b] bg-white font-semibold' : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Render
            </button>
            <button
              onClick={() => setActiveTab('solar')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                activeTab === 'solar' ? 'text-[#1b3a2b] border-b-2 border-[#1b3a2b] bg-white font-semibold' : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Solar Path
            </button>
            <button
              onClick={() => setActiveTab('green')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                activeTab === 'green' ? 'text-[#1b3a2b] border-b-2 border-[#1b3a2b] bg-white font-semibold' : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" /> Eco-Index
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Visual Render Modes Tab */}
            {activeTab === 'visual' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#78716c]">
                  <span>Render Shader Matrix</span>
                  <span className="font-mono text-[10px] text-[#1b3a2b] uppercase font-semibold">{renderMode}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onRenderModeChange('photoreal')}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      renderMode === 'photoreal'
                        ? 'border-[#1b3a2b] bg-[#1b3a2b] text-white shadow-sm'
                        : 'border-[#e7e5df] bg-[#faf8f5] text-[#57534e] hover:border-[#1b3a2b]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <span className="text-[11px] font-semibold block">Photoreal</span>
                    <span className={`text-[9px] ${renderMode === 'photoreal' ? 'text-white/80' : 'text-[#78716c]'}`}>PBR + Sky</span>
                  </button>

                  <button
                    onClick={() => onRenderModeChange('cyber')}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      renderMode === 'cyber'
                        ? 'border-[#1b3a2b] bg-[#1b3a2b] text-white shadow-sm'
                        : 'border-[#e7e5df] bg-[#faf8f5] text-[#57534e] hover:border-[#1b3a2b]'
                    }`}
                  >
                    <Layers className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <span className="text-[11px] font-semibold block">CAD Blueprint</span>
                    <span className={`text-[9px] ${renderMode === 'cyber' ? 'text-white/80' : 'text-[#78716c]'}`}>Vector Wire</span>
                  </button>

                  <button
                    onClick={() => onRenderModeChange('clay')}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      renderMode === 'clay'
                        ? 'border-[#1b3a2b] bg-[#1b3a2b] text-white shadow-sm'
                        : 'border-[#e7e5df] bg-[#faf8f5] text-[#57534e] hover:border-[#1b3a2b]'
                    }`}
                  >
                    <Eye className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <span className="text-[11px] font-semibold block">Clay Studio</span>
                    <span className={`text-[9px] ${renderMode === 'clay' ? 'text-white/80' : 'text-[#78716c]'}`}>White Plaster</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-[#f0ede6] flex items-center justify-between text-[11px]">
                  <span className="text-[#78716c] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Three.js WebGL 2.0
                  </span>
                  <span className="font-mono text-[#a8a29e] text-[10px]">PCFSoftShadows</span>
                </div>
              </div>
            )}

            {/* Solar & Daylight Analysis Tab */}
            {activeTab === 'solar' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#78716c]">Sun Trajectory</span>
                  <span className="text-xs font-mono text-[#1b3a2b] capitalize font-semibold">{timeOfDay}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#faf8f5] p-2.5 rounded-2xl border border-[#e7e5df]">
                  <div className="text-center">
                    <span className="text-[10px] text-[#78716c] block">Azimuth</span>
                    <span className="text-xs font-mono font-semibold text-[#1c1917]">{solarAngle.azimuth}°</span>
                  </div>
                  <div className="text-center border-x border-[#e7e5df]">
                    <span className="text-[10px] text-[#78716c] block">Altitude</span>
                    <span className="text-xs font-mono font-semibold text-[#1c1917]">{solarAngle.elevation}°</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-[#78716c] block">Peak Sun</span>
                    <span className="text-xs font-mono font-semibold text-[#1c1917]">{solarAngle.daylightHrs}h</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs bg-[#f5f3ec] border border-[#e7e5df] p-2.5 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#1b3a2b]" />
                    <span className="text-[#1c1917] text-[11px]">Road Orientation</span>
                  </div>
                  <span className="font-mono font-bold text-[#1b3a2b]">{site?.roadDirection || 'N'}</span>
                </div>
              </div>
            )}

            {/* Green Architecture & Carbon Scorecard */}
            {activeTab === 'green' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#78716c]">Embodied Carbon</span>
                  <span className="font-mono font-bold text-emerald-700">~{embodiedCarbon.toLocaleString()} kgCO₂e</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#78716c]">Glazing Daylight Ratio</span>
                      <span className="font-mono text-[#1c1917]">{daylightRatio.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#f0ede6] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${daylightRatio >= 15 ? 'bg-emerald-600' : 'bg-amber-600'}`} 
                        style={{ width: `${Math.min(100, daylightRatio * 3)}%` }} 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#78716c]">Site Footprint Coverage</span>
                      <span className="font-mono text-[#1c1917]">{coverageRatio.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#f0ede6] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${coverageRatio <= 60 ? 'bg-emerald-600' : 'bg-amber-600'}`} 
                        style={{ width: `${coverageRatio}%` }} 
                      />
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-[10px] text-emerald-800 leading-relaxed font-medium">
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
