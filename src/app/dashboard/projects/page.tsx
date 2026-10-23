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
    <div className="space-y-8 max-w-7xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e5df] pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#1b3a2b] font-semibold flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#1b3a2b]" />
            Architectural Portfolio
          </span>
          <h1 className="text-3xl font-serif tracking-tight text-[#1c1917] mt-1 font-normal">
            Projects & Structural Works
          </h1>
          <p className="text-sm text-[#78716c] mt-1 max-w-xl font-light">
            All active civil blueprints, BIM spatial hierarchies, and deterministic cost schedules under your atelier custody.
          </p>
        </div>
        
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1b3a2b] hover:bg-[#14281d] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.2]" />
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#e7e5df] p-16 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#faf8f5] border border-[#e7e5df] mx-auto flex items-center justify-center text-[#78716c] mb-4">
            <FolderOpen className="h-8 w-8 text-[#1b3a2b]" />
          </div>
          <h3 className="text-xl font-serif text-[#1c1917] font-normal">No projects in portfolio</h3>
          <p className="mt-2 text-sm text-[#78716c] max-w-md mx-auto">
            Begin by commissioning your first structural blueprint. Configure plot bounds, draw CAD wall assemblies, and preview in real-time 3D WebGL.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1b3a2b] hover:bg-[#14281d] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.2]" />
              Create First Project
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <div 
              key={project.id} 
              className="bg-white rounded-3xl border border-[#e7e5df] p-6 flex flex-col justify-between hover:border-[#1b3a2b] hover:shadow-md transition-all shadow-sm group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1b3a2b]/10 text-[#1b3a2b] border border-[#1b3a2b]/20">
                    {project.status || 'Active Project'}
                  </span>
                  <span className="text-[10px] font-mono text-[#a8a29e]">
                    {new Date(project.updated_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-normal text-[#1c1917] group-hover:text-[#1b3a2b] transition-colors mb-1">
                  {project.name}
                </h3>
                <p className="text-xs text-[#78716c] mb-5">
                  {project.site_data?.location || "Architectural Site"}
                </p>

                <div className="space-y-2.5 py-4 border-y border-[#f0ede6] text-xs text-[#57534e]">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#78716c]">Plot Dimensions</span>
                    <span className="font-mono text-[#1c1917]">
                      {project.site_data?.plotWidth || 0}m × {project.site_data?.plotLength || 0}m
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#78716c]">Plot Area</span>
                    <span className="font-medium text-[#1c1917]">
                      {project.site_data?.plotArea || (project.site_data?.plotWidth * project.site_data?.plotLength) || 0} {project.site_data?.unit || 'sq.m'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#78716c]">Estimated Budget</span>
                    <span className="font-serif font-bold text-[#1b3a2b]">
                      ₹{(project.budget_data?.totalBudget || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Sub-studio quick launch dock */}
                <div className="grid grid-cols-4 gap-1.5 pt-4">
                  <Link 
                    href={`/dashboard/projects/${project.id}/planner`}
                    className="p-2.5 rounded-xl bg-[#faf8f5] hover:bg-[#1b3a2b] hover:text-white border border-[#e7e5df] text-center text-[#57534e] transition-colors group/btn"
                    title="2D CAD Floor Planner"
                  >
                    <Grid2X2 className="w-4 h-4 mx-auto group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[9px] font-mono uppercase tracking-wider block mt-1">2D CAD</span>
                  </Link>
                  <Link 
                    href={`/dashboard/projects/${project.id}/3d`}
                    className="p-2.5 rounded-xl bg-[#faf8f5] hover:bg-[#1b3a2b] hover:text-white border border-[#e7e5df] text-center text-[#57534e] transition-colors group/btn"
                    title="3D Walkthrough Engine"
                  >
                    <Box className="w-4 h-4 mx-auto group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[9px] font-mono uppercase tracking-wider block mt-1">3D PBR</span>
                  </Link>
                  <Link 
                    href={`/dashboard/projects/${project.id}/cost`}
                    className="p-2.5 rounded-xl bg-[#faf8f5] hover:bg-[#1b3a2b] hover:text-white border border-[#e7e5df] text-center text-[#57534e] transition-colors group/btn"
                    title="Cost Estimate & BOQ"
                  >
                    <Calculator className="w-4 h-4 mx-auto group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[9px] font-mono uppercase tracking-wider block mt-1">BOQ</span>
                  </Link>
                  <Link 
                    href={`/dashboard/projects/${project.id}/report`}
                    className="p-2.5 rounded-xl bg-[#faf8f5] hover:bg-[#1b3a2b] hover:text-white border border-[#e7e5df] text-center text-[#57534e] transition-colors group/btn"
                    title="Executive Dossier Report"
                  >
                    <FileText className="w-4 h-4 mx-auto group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[9px] font-mono uppercase tracking-wider block mt-1">Dossier</span>
                  </Link>
                </div>
              </div>

              {/* Master Hub Link */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#f0ede6]">
                <span className="text-[11px] font-mono text-[#a8a29e]">
                  ID: {project.id.slice(0, 8)}...
                </span>
                <Link 
                  href={`/dashboard/projects/${project.id}`} 
                  className="text-[#1b3a2b] hover:text-[#14281d] text-xs font-mono tracking-wider uppercase font-semibold flex items-center gap-1.5 transition-colors"
                >
                  Enter Project Hub <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
