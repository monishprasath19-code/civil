import { getProject } from "@/services/projectService";
import { notFound } from "next/navigation";
import PlannerWorkspace from "@/components/planner/PlannerWorkspace";
import { AlertTriangle, Monitor } from "lucide-react";

export default async function PlannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let project;
  try {
    project = await getProject(id);
  } catch (error) {
    return notFound();
  }
  if (!project) return notFound();

  return (
    <>
      <div className="h-[calc(100vh-4rem)] -mt-6 -mx-4 sm:-mx-6 md:-mx-8 flex-col hidden lg:flex">
        <PlannerWorkspace project={project} />
      </div>
      
      <div className="flex flex-col items-center justify-center p-8 text-center h-[60vh] lg:hidden bg-slate-50 border border-slate-200 rounded-xl mt-4">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <Monitor className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Desktop Required</h2>
        <p className="text-slate-600 max-w-sm mb-6">
          The 2D Floor Planner requires a larger screen to draw walls, place furniture, and manage architectural layouts effectively.
        </p>
        <p className="text-sm font-medium text-slate-500 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
          Please open this project on a desktop or laptop computer.
        </p>
      </div>
    </>
  );
}
