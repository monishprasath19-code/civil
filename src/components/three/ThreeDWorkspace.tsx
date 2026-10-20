"use client";

import { ProjectState } from "@/models/project";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Maximize, Rotate3D, AlignVerticalSpaceAround, AlignHorizontalSpaceAround } from "lucide-react";
import ThreeDPropertiesPanel from "./ThreeDPropertiesPanel";
import ExteriorPropertiesPanel from "./exterior/ExteriorPropertiesPanel";
import FurnitureLibrary from "./FurnitureLibrary";
import AIChatPanel from "@/components/planner/AIChatPanel";
import { updateProjectAction } from "@/app/dashboard/actions";
import { usePlannerStore } from "@/store/plannerStore";
import ArchitecturalHUD, { RenderMode } from "./ArchitecturalHUD";

// Dynamic import with ssr: false to prevent Three.js hydration mismatches
const ThreeDScene = dynamic(() => import("./ThreeDScene"), { ssr: false });

export default function ThreeDWorkspace({ project }: { project: ProjectState }) {
  const initialFloors = project.floors || (project as any).floors_data || [];
  const [activeFloorId, setActiveFloorId] = useState<string>(initialFloors[0]?.id || "");
  const [showCeiling, setShowCeiling] = useState(false);
  const [cameraMode, setCameraMode] = useState<'perspective' | 'top' | 'front' | 'walkthrough'>('perspective');
  const [viewTarget, setViewTarget] = useState<'interior' | 'exterior' | 'full'>('interior');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [renderMode, setRenderMode] = useState<RenderMode>('photoreal');
  const [isDroneTour, setIsDroneTour] = useState(false);

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const floors = usePlannerStore(state => state.floors);
  const exterior = usePlannerStore(state => state.exterior);
  const site = usePlannerStore(state => state.site);
  
  // We should also initialize the store if they load this directly
  const initProject = usePlannerStore(state => state.initProject);
  
  // Initialize store with project data on mount (since store is global)
  useEffect(() => {
    const site = project.site || (project as any).site_data || { plotWidth: 15, plotLength: 20 };
    const plotWidth = site.plotWidth || 15;
    const plotLength = site.plotLength || 20;

    const ext = project.exterior || {
      roofType: 'flat', showRoof: true,
      compoundWall: { height: 1.8, thickness: 0.2, materialId: '', show: true },
      gate: { position: { x: plotWidth / 2 || 5, y: plotLength || 10 }, width: 4, height: 1.8, type: 'sliding' },
      driveway: { width: 4, materialId: '', position: { x: plotWidth / 2 || 5, y: (plotLength || 10) - 2 } },
      parking: { spaces: 1, position: { x: plotWidth / 2 - 3 || 2, y: (plotLength || 10) - 2 } },
      trees: [],
      timeOfDay: 'afternoon'
    };
    
    const projectFloors = project.floors || (project as any).floors_data || [];
    initProject(projectFloors, site, ext);
    if (!activeFloorId && projectFloors[0]?.id) {
      setActiveFloorId(projectFloors[0].id);
    }
  }, [project, initProject]);

  const activeFloor = floors.find(f => f.id === activeFloorId);

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      await updateProjectAction(project.id, { floors, exterior });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      setSaveStatus("error");
    }
  };

  const handleCaptureSnapshot = () => {
    try {
      const canvas = document.querySelector("#civil-3d-canvas canvas") as HTMLCanvasElement || document.querySelector("canvas") as HTMLCanvasElement;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const safeName = (project.name || "project").replace(/[^a-z0-9]/gi, "-").toLowerCase();
      link.download = `${safeName}-3d-${renderMode}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Snapshot error:", e);
    }
  };

  if (!activeFloor) {
    return (
      <div className="flex flex-col h-full bg-slate-50 items-center justify-center">
        <h2 className="text-xl font-medium text-slate-600">No floors available in this project.</h2>
        <Link href={`/dashboard/projects/${project.id}/planner`} className="mt-4 text-blue-600 hover:underline">
          Go back to Planner
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 w-full text-zinc-100 select-none">
      {/* Cartier Atelier Luxury 3D Topbar */}
      <div className="h-14 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-5 shrink-0 shadow-xl z-20">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/projects/${project.id}`} className="text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 p-1.5 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400/90 font-medium block leading-none">
              PBR Visualizer
            </span>
            <span className="font-serif font-medium text-sm text-white hidden sm:block mt-0.5">
              {project.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={activeFloorId} 
            onChange={e => setActiveFloorId(e.target.value)}
            className="text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500/60"
            disabled={viewTarget === 'exterior'}
          >
            {project.floors.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>

          <select
            value={viewTarget}
            onChange={(e) => setViewTarget(e.target.value as any)}
            className="text-xs font-mono bg-zinc-900 border border-zinc-800 text-amber-300 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:border-amber-500/60"
          >
            <option value="interior">Interior View</option>
            <option value="exterior">Exterior View</option>
            <option value="full">Full Property</option>
          </select>

          {(viewTarget === 'exterior' || viewTarget === 'full') && exterior && (
            <select
              value={exterior.timeOfDay}
              onChange={(e) => usePlannerStore.getState().updateExterior({ timeOfDay: e.target.value as any })}
              className="text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500/60"
            >
              <option value="morning">Morning Dawn</option>
              <option value="afternoon">Afternoon Sun</option>
              <option value="evening">Golden Hour</option>
              <option value="night">Midnight Blue</option>
            </select>
          )}

          <label className="flex items-center gap-2 text-xs font-mono text-zinc-400 cursor-pointer px-2">
            <input 
              type="checkbox" 
              checked={showCeiling} 
              onChange={e => setShowCeiling(e.target.checked)} 
              className="rounded accent-amber-500 focus:ring-amber-500 bg-zinc-900 border-zinc-800"
            />
            Ceiling
          </label>
          
          <button 
            onClick={handleSave} 
            disabled={saveStatus === "saving"}
            className="ml-2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-mono tracking-wider uppercase font-semibold shadow-md shadow-amber-500/10 transition-all disabled:opacity-50"
          >
            {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "✓ Saved" : "Save Layout"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 relative bg-zinc-950">
        {/* View Controls Overlay */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5 bg-zinc-950/90 backdrop-blur-md shadow-2xl p-1.5 rounded-xl border border-zinc-800/90">
          <button 
            onClick={() => setCameraMode('perspective')}
            className={`p-2 rounded-lg transition-colors ${cameraMode === 'perspective' ? 'text-zinc-950 bg-amber-400' : 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-900'}`}
            title="Perspective View"
          >
            <Rotate3D className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setCameraMode('top')}
            className={`p-2 rounded-lg transition-colors ${cameraMode === 'top' ? 'text-zinc-950 bg-amber-400' : 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-900'}`}
            title="Top CAD View"
          >
            <AlignVerticalSpaceAround className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setCameraMode('front')}
            className={`p-2 rounded-lg transition-colors ${cameraMode === 'front' ? 'text-zinc-950 bg-amber-400' : 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-900'}`}
            title="Elevation View"
          >
            <AlignHorizontalSpaceAround className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setCameraMode('walkthrough')}
            className={`p-2 rounded-lg transition-colors ${cameraMode === 'walkthrough' ? 'text-zinc-950 bg-amber-400' : 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-900'}`}
            title="Interactive First-Person Walkthrough"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 8H5"/><path d="M19 16H5"/><path d="M9 4v16"/></svg>
          </button>
          <button 
            onClick={() => {
              setCameraMode(prev => prev === 'perspective' ? 'top' : 'perspective');
              setTimeout(() => setCameraMode('perspective'), 10);
            }}
            className="p-2 rounded-lg hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-amber-400 mt-1 border-t border-zinc-800/80"
            title="Reset Viewport Frame"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        {cameraMode === 'walkthrough' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/70 backdrop-blur text-white px-6 py-3 rounded-xl flex items-center gap-6 shadow-lg pointer-events-none">
            <div className="flex flex-col items-center">
              <span className="text-xs text-white/70 uppercase tracking-wider mb-1">Move</span>
              <span className="font-mono font-medium tracking-widest">WASD</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-white/70 uppercase tracking-wider mb-1">Look</span>
              <span className="font-mono font-medium">Mouse</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-white/70 uppercase tracking-wider mb-1">Exit</span>
              <span className="font-mono font-medium">ESC</span>
            </div>
          </div>
        )}

        {/* Architectural Cyber HUD */}
        <ArchitecturalHUD 
          site={site}
          exterior={exterior}
          floors={floors}
          renderMode={renderMode}
          onRenderModeChange={setRenderMode}
          isDroneTour={isDroneTour}
          onToggleDroneTour={() => setIsDroneTour(!isDroneTour)}
          onCaptureSnapshot={handleCaptureSnapshot}
        />

        {/* 3D Canvas */}
        <ThreeDScene 
          floor={activeFloor} 
          showCeiling={showCeiling} 
          cameraMode={cameraMode} 
          viewTarget={viewTarget}
          selectedId={selectedId}
          onSelect={setSelectedId}
          renderMode={renderMode}
          isDroneTour={isDroneTour}
        />
        
        <ThreeDPropertiesPanel selectedId={selectedId} />
        <ExteriorPropertiesPanel viewTarget={viewTarget} />
        <FurnitureLibrary />
        <AIChatPanel />
      </div>
    </div>
  );
}
