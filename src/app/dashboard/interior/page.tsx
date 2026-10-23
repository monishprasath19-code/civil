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
    <div className="space-y-12 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* Dehome AI Interactive Redesign Studio */}
      <DehomeInteriorStudio activeProjectId={activeProject?.id} />

      {/* Active Architectural Projects Section */}
      <div className="space-y-6 pt-4 border-t border-[#e7e5df]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#1b3a2b] font-semibold block">
              Portfolio Integration
            </span>
            <h2 className="text-2xl font-serif text-[#1c1917] tracking-tight mt-0.5 font-normal">
              Project 3D Walkthroughs
            </h2>
            <p className="text-xs text-[#78716c] font-light mt-0.5">
              Launch real-time Three.js first-person walkthroughs of your CAD designs with PBR physical materials.
            </p>
          </div>
          <Link
            href="/dashboard/projects"
            className="text-xs font-mono uppercase tracking-wider text-[#1b3a2b] hover:text-[#14281d] flex items-center gap-1 transition-colors font-semibold"
          >
            All Projects <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#e7e5df] shadow-sm">
            <FolderOpen className="w-10 h-10 text-[#a8a29e] mx-auto mb-3" />
            <h3 className="text-base font-serif text-[#1c1917] mb-1 font-normal">No commissioned projects found</h3>
            <p className="text-[#78716c] text-xs max-w-sm mx-auto mb-5">
              Create an architectural project to map these AI interior styling concepts directly into 2D CAD and 3D WebGL.
            </p>
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1b3a2b] text-white font-medium text-xs uppercase tracking-wider font-mono hover:bg-[#14281d] transition-colors shadow-sm"
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
                  className="bg-white rounded-3xl border border-[#e7e5df] hover:border-[#1b3a2b] p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono text-[#1b3a2b] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#1b3a2b]/10 border border-[#1b3a2b]/20 font-semibold">
                        PBR Ready
                      </span>
                      <Eye className="w-4 h-4 text-[#78716c] group-hover:text-[#1b3a2b] transition-colors" />
                    </div>

                    <h3 className="font-serif text-lg text-[#1c1917] group-hover:text-[#1b3a2b] transition-colors mb-1 font-normal">
                      {p.name}
                    </h3>

                    <p className="text-xs text-[#78716c] font-light mb-5">
                      {p.site?.location || 'Designated Site'} • {furnitureCount} Placed Furnishings
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#f0ede6] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-emerald-700 flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Walkthrough 60 FPS
                    </span>

                    <Link
                      href={`/dashboard/projects/${p.id}/3d`}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#faf8f5] group-hover:bg-[#1b3a2b] group-hover:text-white border border-[#d6d3cc] text-[#1b3a2b] text-xs font-mono font-medium transition-all shadow-sm"
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
