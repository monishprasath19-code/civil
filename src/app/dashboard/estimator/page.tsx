import { getUserProjects } from "@/services/projectService";
import Link from "next/link";
import { Calculator, ArrowRight, FolderOpen, IndianRupee } from "lucide-react";
import { formatCurrency } from "@/utils/currency";

export default async function EstimatorLauncherPage() {
  let projects: any[] = [];
  try {
    projects = await getUserProjects();
  } catch (e) {}

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-[0.25em] text-amber-400 uppercase">CALCULATEUR DE COÛTS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-xs text-zinc-400 font-mono">Preliminary Engineering Takeoffs</span>
          </div>
          <h1 className="text-3xl font-serif text-white tracking-wide">Cost Estimator</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Review live structural material quantities, masonry volume, concrete slabs, and custom rate overrides across your projects.
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-zinc-950/80 border border-zinc-800/80">
          <FolderOpen className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-serif text-white mb-2">No Projects Found</h3>
          <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
            Create a project to calculate preliminary construction costs and quantity takeoffs.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider font-mono hover:bg-amber-400 transition-colors"
          >
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const totalBudget = p.budget?.totalBudget || p.budget_data?.totalBudget || 0;
            const estimatedCost = p.costEstimate?.totalCost || p.cost_estimate?.totalCost || 0;

            return (
              <div 
                key={p.id}
                className="bg-zinc-950/90 rounded-2xl border border-zinc-800/80 hover:border-amber-500/40 p-6 flex flex-col justify-between shadow-xl transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                      Cost Takeoff Module
                    </span>
                    <Calculator className="w-4 h-4 text-emerald-400" />
                  </div>

                  <h3 className="font-serif text-xl text-white group-hover:text-amber-200 transition-colors mb-2">
                    {p.name}
                  </h3>

                  <div className="space-y-1 mb-6">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-500">Target Budget:</span>
                      <span className="text-zinc-300">{formatCurrency(totalBudget)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-500">Calculated Cost:</span>
                      <span className="font-bold text-emerald-400">
                        {estimatedCost > 0 ? formatCurrency(estimatedCost) : 'Pending Generation'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-zinc-500">
                    Live Rate Override Enabled
                  </div>

                  <Link
                    href={`/dashboard/projects/${p.id}/cost`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 group-hover:bg-amber-500/10 border border-zinc-800 group-hover:border-amber-500/30 text-amber-400 text-xs font-mono font-medium transition-all"
                  >
                    <span>View BOQ</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
