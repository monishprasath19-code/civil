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
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e5df] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#1b3a2b] uppercase font-semibold">CALCULATEUR DE COÛTS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span className="text-xs text-[#78716c] font-mono">Preliminary Engineering Takeoffs</span>
          </div>
          <h1 className="text-3xl font-serif text-[#1c1917] tracking-tight font-normal">Cost Estimator</h1>
          <p className="text-[#78716c] text-sm mt-1 max-w-2xl font-light">
            Review live structural material quantities, masonry volume, concrete slabs, and custom rate overrides across your projects.
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white border border-[#e7e5df] shadow-sm">
          <FolderOpen className="w-12 h-12 text-[#a8a29e] mx-auto mb-4" />
          <h3 className="text-lg font-serif text-[#1c1917] mb-2 font-normal">No Projects Found</h3>
          <p className="text-[#78716c] text-sm max-w-md mx-auto mb-6">
            Create a project to calculate preliminary construction costs and quantity takeoffs.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1b3a2b] text-white font-medium text-xs uppercase tracking-wider font-mono hover:bg-[#14281d] transition-colors shadow-sm"
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
                className="bg-white rounded-3xl border border-[#e7e5df] hover:border-[#1b3a2b] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-[#1b3a2b] uppercase tracking-widest font-semibold">
                      Cost Takeoff Module
                    </span>
                    <Calculator className="w-4 h-4 text-[#1b3a2b]" />
                  </div>

                  <h3 className="font-serif text-xl text-[#1c1917] group-hover:text-[#1b3a2b] transition-colors mb-2 font-normal">
                    {p.name}
                  </h3>

                  <div className="space-y-1 mb-6">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#78716c]">Target Budget:</span>
                      <span className="text-[#1c1917]">{formatCurrency(totalBudget)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#78716c]">Calculated Cost:</span>
                      <span className="font-bold text-emerald-700">
                        {estimatedCost > 0 ? formatCurrency(estimatedCost) : 'Pending Generation'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#f0ede6] flex items-center justify-between">
                  <div className="text-[11px] font-mono text-[#78716c]">
                    Live Rate Override Enabled
                  </div>

                  <Link
                    href={`/dashboard/projects/${p.id}/cost`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#faf8f5] group-hover:bg-[#1b3a2b] group-hover:text-white border border-[#d6d3cc] text-[#1b3a2b] text-xs font-mono font-medium transition-all shadow-sm"
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
