import { getUserProjects } from "@/services/projectService";
import Link from "next/link";
import { Box, ArrowRight, FolderOpen, Eye, Sparkles, Wand2 } from "lucide-react";
import DehomeInteriorStudio from "@/components/interior/DehomeInteriorStudio";

export default async function InteriorStudioPage() {
  let projects: any[] = [];
  try {
    projects = await getUserProjects();
  } catch (e) {}

  const activeProject = projects.length > 0 ? projects[0] : null;

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      
      {/* Dehome AI Interactive Redesign Studio */}
      <DehomeInteriorStudio activeProjectId={activeProject?.id} />

      {/* Active Architectural Projects Section */}
      <div className="space-y-6 pt-4 border-t border-zinc-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-medium block">
              Portfolio Integration
            </span>
            <h2 className="text-2xl font-serif text-white tracking-tight mt-0.5">
              Commissioned Project Walkthroughs
            </h2>
            <p className="text-xs text-zinc-400 font-light mt-0.5">
              Launch real-time Three.js first-person walkthroughs of your CAD designs with PBR physical materials.
            </p>
          </div>
          <Link
            href="/dashboard/projects"
            className="text-xs font-mono uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            All Projects <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
            <FolderOpen className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-serif text-white mb-1">No commissioned projects found</h3>
            <p className="text-zinc-400 text-xs max-w-sm mx-auto mb-5">
              Create an architectural project to map these AI interior styling concepts directly into 2D CAD and 3D WebGL.
            </p>
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs uppercase tracking-wider font-mono hover:from-amber-400 hover:to-amber-500 transition-colors shadow-lg shadow-amber-500/20"
            >
              Commission Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => {
              const furnitureCount = p.floors?.reduce((acc: number, f: any) => acc + (f.furniture?.length || 0), 0) || 0;

              return (
                <div 
                  key={p.id}
                  className="bg-zinc-900/60 rounded-2xl border border-zinc-800/80 hover:border-amber-500/40 p-5 flex flex-col justify-between shadow-xl transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                        PBR Ready
                      </span>
                      <Eye className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                    </div>

                    <h3 className="font-serif text-lg text-white group-hover:text-amber-200 transition-colors mb-1">
                      {p.name}
                    </h3>

                    <p className="text-xs text-zinc-400 font-light mb-5">
                      {p.site?.location || 'Designated Site'} • {furnitureCount} Placed Furnishings
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Walkthrough 60 FPS
                    </span>

                    <Link
                      href={`/dashboard/projects/${p.id}/3d`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-950 group-hover:bg-amber-500/10 border border-zinc-800 group-hover:border-amber-500/30 text-amber-400 text-xs font-mono font-medium transition-all"
                    >
                      <span>Enter 3D</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
