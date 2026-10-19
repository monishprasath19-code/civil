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
    </div>
  );
}
