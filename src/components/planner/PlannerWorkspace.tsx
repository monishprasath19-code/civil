"use client";

import { useEffect, useState, useTransition } from "react";
import { ProjectState } from "@/models/project";
import { usePlannerStore } from "@/store/plannerStore";
import Topbar from "./Topbar";
import LeftToolbar from "./LeftToolbar";
import PropertiesPanel from "./PropertiesPanel";
import AIChatPanel from "./AIChatPanel";
import dynamic from "next/dynamic";
import { updateProjectAction } from "@/app/dashboard/actions";

const CanvasArea = dynamic(() => import("./CanvasArea"), { ssr: false });

import ProfessionalToolsPanel from "./ProfessionalToolsPanel";
import MaterialComparisonPanel from "./MaterialComparisonPanel";

export default function PlannerWorkspace({ project }: { project: ProjectState }) {
  const initProject = usePlannerStore((state) => state.initProject);
  const floors = usePlannerStore((state) => state.floors);
  const exterior = usePlannerStore((state) => state.exterior);
  const activeFloorId = usePlannerStore((state) => state.activeFloorId);
  const [isSaving, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

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
  }, [project, initProject]);

  const handleSave = () => {
    setSaveStatus("saving");
    startTransition(async () => {
      try {
        await updateProjectAction(project.id, { floors, exterior });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (err) {
        setSaveStatus("error");
      }
    });
  };

  if (!activeFloorId) return <div className="flex-1 flex items-center justify-center bg-slate-100">Loading workspace...</div>;

  const activeFloor = floors.find(f => f.id === activeFloorId);
  const floorArea = activeFloor?.rooms.reduce((acc, r) => acc + (r.width * r.height), 0) || 0;
  const wallCount = activeFloor?.walls.length || 0;
  const roomCount = activeFloor?.rooms.length || 0;

  return (
    <div className="flex flex-col h-full bg-slate-50 w-full">
      <Topbar onSave={handleSave} saveStatus={saveStatus} projectName={project.name} />
      
      <div className="flex flex-1 overflow-hidden relative">
        <LeftToolbar />
        <CanvasArea />
        <PropertiesPanel />
        <AIChatPanel />
        <ProfessionalToolsPanel projectId={project.id} />
        <MaterialComparisonPanel />
      </div>

      {/* Futuristic CAD Status HUD */}
      <div className="h-7 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-4 text-[11px] font-mono text-slate-400 select-none z-10 shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            CAD ENGINE ACTIVE
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline">SCALE: 1:50 METRIC</span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline">GRID SNAP: 0.5m</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-300">
            FLOOR AREA: <strong className="text-sky-300 font-bold">{floorArea.toFixed(1)} m²</strong>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">
            ROOMS: <strong className="text-white">{roomCount}</strong> • WALLS: <strong className="text-white">{wallCount}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
