import Link from "next/link";
import { Plus, FolderOpen, ArrowRight } from "lucide-react";
import { getUserProjects } from "@/services/projectService";

export default async function ProjectsPage() {
  let projects: any[] = [];
  try {
    projects = await getUserProjects();
  } catch (error) {
    // Handling not authenticated or DB error
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white shadow-sm rounded-xl border border-slate-200">
          <div className="p-12 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">No projects yet</h3>
            <p className="mt-1 text-sm text-slate-500">Create a project to start designing and estimating.</p>
            <div className="mt-6">
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Create your first project
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <div key={project.id} className="bg-white shadow-sm rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{project.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{project.site_data?.location || "No location"}</p>
                <div className="space-y-2 mb-6 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Area:</span>
                    <span className="font-medium text-slate-900">{project.site_data?.plotArea} sq {project.site_data?.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget:</span>
                    <span className="font-medium text-slate-900">₹{project.budget_data?.totalBudget?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last modified:</span>
                    <span className="font-medium text-slate-900">{new Date(project.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {project.status}
                </span>
                <Link href={`/dashboard/projects/${project.id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  Open <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
