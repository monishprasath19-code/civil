import { getProject } from "@/services/projectService";
import { notFound, redirect } from "next/navigation";
import { ProjectState } from "@/models/project";
import ReportViewer from "./ReportViewer";
import { createClient } from '@/utils/supabase/server';

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let projectState;
  try {
    projectState = await getProject(id);
  } catch (error) {
    return notFound();
  }

  if (!projectState) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <ReportViewer projectState={projectState} />
    </div>
  );
}
