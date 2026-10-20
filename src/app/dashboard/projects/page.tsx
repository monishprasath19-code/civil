import Link from "next/link";
import { Plus, FolderOpen, ArrowRight, Grid2X2, Box, Calculator, FileText, Sparkles, Compass } from "lucide-react";
import { getUserProjects } from "@/services/projectService";

export default async function ProjectsPage() {
  let projects: any[] = [];
  try {
    projects = await getUserProjects();
  } catch (error) {
    // Graceful handling for non-auth / initial states
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-400/90 font-medium flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            Architectural Portfolio
          </span>
          <h1 className="text-3xl font-serif tracking-tight text-white mt-1">
            Commissions & Structural Works
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl font-light">
            All active civil blueprints, BIM spatial hierarchies, and deterministic cost schedules under your atelier custody.
          </p>
        </div>
        
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-medium text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          New Architectural Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-zinc-900/60 backdrop-blur-sm rounded-3xl border border-zinc-800/80 p-16 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 mx-auto flex items-center justify-center text-zinc-500 mb-4">
            <FolderOpen className="h-8 w-8 text-amber-400/80" />
          </div>
          <h3 className="text-xl font-serif font-medium text-zinc-200">No projects in portfolio</h3>
          <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
            Begin by commissioning your first structural blueprint. Configure plot bounds, draw CAD wall assemblies, and preview in real-time 3D WebGL.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-medium text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Create First Project
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <div 
              key={project.id} 
              className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800/80 p-6 flex flex-col justify-between hover:border-amber-500/40 hover:bg-zinc-900/80 transition-all shadow-xl group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {project.status || 'Active Commission'}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {new Date(project.updated_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-medium text-white group-hover:text-amber-300 transition-colors mb-1">
                  {project.name}
                </h3>
                <p className="text-xs text-zinc-400 mb-5">
                  {project.site_data?.location || "Designated Architectural Site"}
                </p>

                <div className="space-y-2.5 py-4 border-y border-zinc-800/70 text-xs text-zinc-400">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">Plot Dimensions</span>
                    <span className="font-mono text-zinc-200">
                      {project.site_data?.plotWidth || 0}m × {project.site_data?.plotLength || 0}m
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">Plot Area</span>
                    <span className="font-medium text-zinc-200">
                      {project.site_data?.plotArea || (project.site_data?.plotWidth * project.site_data?.plotLength) || 0} {project.site_data?.unit || 'sq.m'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">Estimated Budget</span>
                    <span className="font-serif font-bold text-amber-400">
                      ₹{(project.budget_data?.totalBudget || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Sub-studio quick launch dock */}
                <div className="grid grid-cols-4 gap-1.5 pt-4">
                  <Link 
                    href={`/dashboard/projects/${project.id}/planner`}
                    className="p-2 rounded-lg bg-zinc-950/80 hover:bg-amber-500/10 hover:text-amber-400 border border-zinc-800/80 text-center text-zinc-400 transition-colors group/btn"
                    title="2D CAD Floor Planner"
                  >
                    <Grid2X2 className="w-4 h-4 mx-auto group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[9px] font-mono uppercase tracking-wider block mt-1">2D CAD</span>
                  </Link>
                  <Link 
                    href={`/dashboard/projects/${project.id}/3d`}
                    className="p-2 rounded-lg bg-zinc-950/80 hover:bg-amber-500/10 hover:text-amber-400 border border-zinc-800/80 text-center text-zinc-400 transition-colors group/btn"
                    title="3D Walkthrough Engine"
                  >
                    <Box className="w-4 h-4 mx-auto group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[9px] font-mono uppercase tracking-wider block mt-1">3D PBR</span>
                  </Link>
                  <Link 
                    href={`/dashboard/projects/${project.id}/cost`}
                    className="p-2 rounded-lg bg-zinc-950/80 hover:bg-amber-500/10 hover:text-amber-400 border border-zinc-800/80 text-center text-zinc-400 transition-colors group/btn"
                    title="Cost Estimate & BOQ"
                  >
                    <Calculator className="w-4 h-4 mx-auto group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[9px] font-mono uppercase tracking-wider block mt-1">BOQ</span>
                  </Link>
                  <Link 
                    href={`/dashboard/projects/${project.id}/report`}
                    className="p-2 rounded-lg bg-zinc-950/80 hover:bg-amber-500/10 hover:text-amber-400 border border-zinc-800/80 text-center text-zinc-400 transition-colors group/btn"
                    title="Executive Dossier Report"
                  >
                    <FileText className="w-4 h-4 mx-auto group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[9px] font-mono uppercase tracking-wider block mt-1">Dossier</span>
                  </Link>
                </div>
              </div>

              {/* Master Hub Link */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-800/70">
                <span className="text-[11px] font-mono text-zinc-400">
                  ID: {project.id.slice(0, 8)}...
                </span>
                <Link 
                  href={`/dashboard/projects/${project.id}`} 
                  className="text-amber-400 hover:text-amber-300 text-xs font-mono tracking-wider uppercase font-medium flex items-center gap-1.5 transition-colors"
                >
                  Enter Atelier Hub <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
