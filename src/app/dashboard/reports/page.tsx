import { getUserProjects } from "@/services/projectService";
import Link from "next/link";
import { FileText, ArrowRight, FolderOpen, Printer } from "lucide-react";

export default async function ReportsHubPage() {
  let projects: any[] = [];
  try {
    projects = await getUserProjects();
  } catch (e) {}

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-[0.25em] text-amber-400 uppercase">RAPPORTS D'INGÉNIERIE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-xs text-zinc-400 font-mono">Executive Architectural Dossiers</span>
          </div>
          <h1 className="text-3xl font-serif text-white tracking-wide">Project Reports</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Print-ready executive dossiers covering structural health, spatial layouts, material schedules, and cost distributions.
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-zinc-950/80 border border-zinc-800/80">
          <FolderOpen className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-serif text-white mb-2">No Reports Available</h3>
          <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
            Create an architectural project to generate comprehensive printable PDF reports.
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
            return (
              <div 
                key={p.id}
                className="bg-zinc-950/90 rounded-2xl border border-zinc-800/80 hover:border-amber-500/40 p-6 flex flex-col justify-between shadow-xl transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                      Formal Dossier • PDF / Print
                    </span>
                    <Printer className="w-4 h-4 text-zinc-400 group-hover:text-amber-300 transition-colors" />
                  </div>

                  <h3 className="font-serif text-xl text-white group-hover:text-amber-200 transition-colors mb-2">
                    {p.name}
                  </h3>

                  <p className="text-xs text-zinc-400 font-light mb-6">
                    Site: {p.site?.location || 'Custom Site'} • Verified Structure & Preliminary BOQ Included
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-400">Printable Layout</span>

                  <Link
                    href={`/dashboard/projects/${p.id}/report`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 group-hover:bg-amber-500/10 border border-zinc-800 group-hover:border-amber-500/30 text-amber-400 text-xs font-mono font-medium transition-all"
                  >
                    <span>View Dossier</span>
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
