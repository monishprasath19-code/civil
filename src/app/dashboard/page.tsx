import Link from "next/link";
import { FolderOpen, TrendingUp, IndianRupee, Plus, ArrowRight } from "lucide-react";
import { getUserProjects } from "@/services/projectService";

export default async function DashboardPage() {
  let projects: any[] = [];
  try {
    projects = await getUserProjects();
  } catch (error) {
    // Handle error
  }

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p: any) => p.status === 'active').length;
  const estValue = projects.reduce((acc: number, p: any) => acc + (p.budget_data?.totalBudget || 0), 0);
  const recentProjects = projects.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <FolderOpen className="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 truncate">Total Projects</dt>
                <dd className="text-2xl font-semibold text-slate-900">{totalProjects}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-amber-100 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-amber-600" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 truncate">Active Projects</dt>
                <dd className="text-2xl font-semibold text-slate-900">{activeProjects}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-emerald-100 rounded-lg p-3">
              <IndianRupee className="h-6 w-6 text-emerald-600" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 truncate">Est. Construction Value</dt>
                <dd className="text-2xl font-semibold text-slate-900">₹{estValue.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white shadow-sm rounded-xl border border-slate-200">
        <div className="px-4 py-5 sm:px-6 flex items-center justify-between border-b border-slate-200">
          <h3 className="text-lg leading-6 font-medium text-slate-900">Recent Projects</h3>
          <Link href="/dashboard/projects" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all
          </Link>
        </div>
        
        {recentProjects.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">No projects</h3>
            <p className="mt-1 text-sm text-slate-500">Get started by creating a new project.</p>
            <div className="mt-6">
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Project
              </Link>
            </div>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-slate-200">
            {recentProjects.map((project: any) => (
              <li key={project.id}>
                <Link href={`/dashboard/projects/${project.id}`} className="block hover:bg-slate-50 transition-colors">
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 truncate">{project.name}</p>
                      <p className="mt-1 flex items-center text-sm text-slate-500">
                        {project.site_data?.location || "No location"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-sm text-slate-500 mr-4">
                        Updated {new Date(project.updated_at).toLocaleDateString()}
                      </p>
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
