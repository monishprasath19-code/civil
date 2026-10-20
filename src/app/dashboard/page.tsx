import Link from "next/link";
import { 
  FolderOpen, 
  TrendingUp, 
  Coins, 
  Plus, 
  ArrowRight, 
  Compass, 
  Box, 
  Grid2X2, 
  Layers, 
  Sparkles,
  Bot,
  Building
} from "lucide-react";
import { getUserProjects } from "@/services/projectService";

export default async function DashboardPage() {
  let projects: any[] = [];
  try {
    projects = await getUserProjects();
  } catch (error) {
    // Graceful fallback for unauthenticated / initial state
  }

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p: any) => p.status === 'active' || !p.status).length;
  const estValue = projects.reduce((acc: number, p: any) => acc + (p.budget_data?.totalBudget || p.budget?.totalBudget || 0), 0);
  const recentProjects = projects.slice(0, 5);

  return (
    <div className="space-y-10 max-w-7xl">
      {/* Atelier Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800/80 p-8 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            Cartier Architectural Atelier & Engineering Engine
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-white font-medium leading-[1.15]">
            Architectural Vision in Obsidian & Gold
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
            Welcome to your master architectural console. Orchestrate 2D CAD floor plans, high-fidelity Three.js photoreal viewports, deterministic structural BOQ calculations, and autonomous AI civil audits.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-medium text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Commission New Project
            </Link>
            <Link
              href="/dashboard/ai-assistant"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs tracking-wider uppercase transition-all"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              Autonomous Civil Studio
            </Link>
          </div>
        </div>
      </div>

      {/* Stats KPI Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Projects */}
        <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800/80 p-6 shadow-xl hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 block">
                Total Projects
              </span>
              <span className="text-3xl font-serif font-bold text-white mt-1 block">
                {totalProjects}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FolderOpen className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
            <span>Portfolio Holdings</span>
            <span className="text-amber-400 font-mono">100% Synced</span>
          </div>
        </div>

        {/* Active Commissions */}
        <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800/80 p-6 shadow-xl hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 block">
                Active Commissions
              </span>
              <span className="text-3xl font-serif font-bold text-white mt-1 block">
                {activeProjects}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
            <span>Engineering Status</span>
            <span className="text-emerald-400 font-mono">In Progress</span>
          </div>
        </div>

        {/* Est. Portfolio Valuation */}
        <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800/80 p-6 shadow-xl hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 block">
                Est. Construction Value
              </span>
              <span className="text-3xl font-serif font-bold text-amber-300 mt-1 block">
                ₹{estValue.toLocaleString()}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Coins className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
            <span>Deterministic BOQ Total</span>
            <span className="text-zinc-400 font-mono">INR Standard</span>
          </div>
        </div>
      </div>

      {/* Atelier Suite Quick Launch Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400/90 font-medium flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            Specialized Atelier Studios
          </span>
          <span className="text-xs text-zinc-500">1-Click Launch</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: "Floor Planner", href: "/dashboard/planner", icon: Grid2X2, desc: "2D CAD Canvas" },
            { name: "3D Interior", href: "/dashboard/interior", icon: Box, desc: "Walkthrough" },
            { name: "3D Exterior", href: "/dashboard/exterior", icon: Building, desc: "Site & Façade" },
            { name: "Materials", href: "/dashboard/materials", icon: Layers, desc: "PBR Minerals" },
            { name: "Estimator", href: "/dashboard/estimator", icon: Coins, desc: "Cost Takeoffs" },
            { name: "AI Assistant", href: "/dashboard/ai-assistant", icon: Bot, desc: "Civil Studio" },
          ].map((studio) => (
            <Link
              key={studio.name}
              href={studio.href}
              className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/70 hover:border-amber-500/40 hover:bg-zinc-900/80 transition-all text-left group"
            >
              <studio.icon className="w-5 h-5 text-zinc-400 group-hover:text-amber-400 transition-colors mb-2" />
              <div className="text-xs font-medium text-zinc-200 group-hover:text-amber-300 font-serif">
                {studio.name}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                {studio.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Projects Mineral Ledger */}
      <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800/80 shadow-2xl overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between border-b border-zinc-800/80">
          <div>
            <h2 className="text-lg font-serif font-medium text-white">Recent Architectural Commissions</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Current projects undergoing CAD planning and 3D visualization</p>
          </div>
          <Link 
            href="/dashboard/projects" 
            className="text-xs font-mono uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            All Projects <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        {recentProjects.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 mx-auto flex items-center justify-center text-zinc-500 mb-4">
              <FolderOpen className="h-8 w-8" />
            </div>
            <h3 className="text-base font-serif font-medium text-zinc-200">No architectural commissions registered</h3>
            <p className="mt-1 text-xs text-zinc-500 max-w-sm mx-auto">
              Initialize your first project to orchestrate plot geometry, 2D room layouts, and PBR structural rendering.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-medium text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Commission First Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80">
            {recentProjects.map((project: any) => (
              <Link 
                key={project.id} 
                href={`/dashboard/projects/${project.id}`} 
                className="block p-5 sm:px-6 hover:bg-zinc-800/40 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-serif font-medium text-zinc-100 group-hover:text-amber-300 transition-colors">
                        {project.name}
                      </h4>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {project.status || 'Active'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 flex items-center gap-2">
                      <span>{project.site_data?.location || "Prime Architectural Site"}</span>
                      <span>•</span>
                      <span>{project.site_data?.plotArea ? `${project.site_data.plotArea} sq.m` : "Configured Layout"}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block text-right">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Budget Allocation</span>
                      <span className="text-xs font-serif font-medium text-zinc-200">
                        ₹{(project.budget_data?.totalBudget || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-center text-zinc-400 group-hover:text-amber-400 group-hover:border-amber-500/40 transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
