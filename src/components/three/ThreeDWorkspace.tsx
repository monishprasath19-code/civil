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

// Dynamic import with ssr: false to prevent Three.js hydration mismatches
const ThreeDScene = dynamic(() => import("./ThreeDScene"), { ssr: false });

export default function ThreeDWorkspace({ project }: { project: ProjectState }) {
  const initialFloors = project.floors || (project as any).floors_data || [];
  const [activeFloorId, setActiveFloorId] = useState<string>(initialFloors[0]?.id || "");
  const [showCeiling, setShowCeiling] = useState(false);
  const [cameraMode, setCameraMode] = useState<'perspective' | 'top' | 'front' | 'walkthrough'>('perspective');
  const [viewTarget, setViewTarget] = useState<'interior' | 'exterior' | 'full'>('interior');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const floors = usePlannerStore(state => state.floors);
  const exterior = usePlannerStore(state => state.exterior);
  
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
    <div className="flex flex-col h-full bg-slate-50 w-full">
      {/* Top Bar */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/projects/${project.id}`} className="text-slate-500 hover:bg-slate-100 p-1.5 rounded transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-semibold text-slate-800 hidden sm:block">{project.name} - 3D View</span>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={activeFloorId} 
            onChange={e => setActiveFloorId(e.target.value)}
            className="text-sm border border-slate-300 rounded px-2 py-1 bg-slate-50 focus:outline-none focus:border-blue-500"
            disabled={viewTarget === 'exterior'}
          >
            {project.floors.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>

          <select
            value={viewTarget}
            onChange={(e) => setViewTarget(e.target.value as any)}
            className="text-sm border border-slate-300 rounded px-2 py-1 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="interior">Interior View</option>
            <option value="exterior">Exterior View</option>
            <option value="full">Full Property</option>
          </select>

          {(viewTarget === 'exterior' || viewTarget === 'full') && exterior && (
            <select
              value={exterior.timeOfDay}
              onChange={(e) => usePlannerStore.getState().updateExterior({ timeOfDay: e.target.value as any })}
              className="text-sm border border-slate-300 rounded px-2 py-1 bg-slate-50 text-slate-700 focus:outline-none focus:border-blue-500 ml-2"
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          )}

          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showCeiling} 
              onChange={e => setShowCeiling(e.target.checked)} 
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            Ceiling
          </label>
          
          <button 
            onClick={handleSave} 
            disabled={saveStatus === "saving"}
            className="ml-4 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save Layout"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 relative">
        {/* View Controls Overlay */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2 bg-white/90 backdrop-blur shadow-sm p-2 rounded-lg border border-slate-200">
          <button 
            onClick={() => setCameraMode('perspective')}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${cameraMode === 'perspective' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}
            title="Perspective View"
          >
            <Rotate3D className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCameraMode('top')}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${cameraMode === 'top' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}
            title="Top View"
          >
            <AlignVerticalSpaceAround className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCameraMode('front')}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${cameraMode === 'front' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}
            title="Front View"
          >
            <AlignHorizontalSpaceAround className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCameraMode('walkthrough')}
            className={`p-2 rounded hover:bg-slate-100 transition-colors ${cameraMode === 'walkthrough' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}
            title="Walkthrough Mode"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 8H5"/><path d="M19 16H5"/><path d="M9 4v16"/></svg>
          </button>
          <button 
            onClick={() => {
              // Hacky way to reset by remounting the camera or forcing a re-render of orbit controls
              // For a true reset, we'd use a ref to OrbitControls, but this forces a quick toggle
              setCameraMode(prev => prev === 'perspective' ? 'top' : 'perspective');
              setTimeout(() => setCameraMode('perspective'), 10);
            }}
            className="p-2 rounded hover:bg-slate-100 transition-colors text-slate-600 mt-2 border-t border-slate-200"
            title="Reset Camera"
          >
            <Maximize className="w-5 h-5" />
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

        {/* 3D Canvas */}
        <ThreeDScene 
          floor={activeFloor} 
          showCeiling={showCeiling} 
          cameraMode={cameraMode} 
          viewTarget={viewTarget}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        
        <ThreeDPropertiesPanel selectedId={selectedId} />
        <ExteriorPropertiesPanel viewTarget={viewTarget} />
        <FurnitureLibrary />
        <AIChatPanel />
      </div>
    </div>
  );
}
