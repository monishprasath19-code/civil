import { getProject } from "@/services/projectService";
import { notFound, redirect } from "next/navigation";
import CostDashboard from "./CostDashboard";
import { createClient } from "@/utils/supabase/server";

export default async function CostPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return redirect('/login');

  let projectState;
  try {
    projectState = await getProject(id);
  } catch (error) {
    return notFound();
  }

  if (!projectState) return notFound();

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <CostDashboard projectId={projectState.id} projectName={projectState.name} projectState={projectState} />
    </div>
  );
}
