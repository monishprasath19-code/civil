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
    <div className="space-y-10 max-w-7xl font-sans">
      {/* Figma Architectural Hero Banner - Deep Forest Green Contrast */}
      <div className="relative overflow-hidden rounded-3xl bg-[#14281d] text-white p-8 sm:p-12 shadow-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-[11px] font-mono uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            Architectural Atelier & Civil CAD Engine
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-white font-normal leading-[1.15]">
            Crafting Spaces with Precision & Grace
          </h1>
          <p className="text-white/80 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
            Welcome to your master architectural console. Orchestrate 2D CAD floor plans, high-fidelity Three.js photoreal viewports, deterministic structural BOQ calculations, and autonomous AI civil audits.
          </p>
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#f5f3ec] text-[#14281d] font-medium text-xs tracking-wider uppercase transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.2]" />
              New Architectural Project
            </Link>
            <Link
              href="/dashboard/ai-assistant"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-transparent hover:bg-white/10 border border-white/30 text-white text-xs tracking-wider uppercase transition-all"
            >
              <Bot className="w-4 h-4 text-emerald-300" />
              Autonomous Civil Studio
            </Link>
          </div>
        </div>
      </div>

      {/* Stats KPI Overview - Warm Alabaster & Crisp Stone Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Projects */}
        <div className="bg-white rounded-3xl border border-[#e7e5df] p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#78716c] block">
                Total Projects
              </span>
              <span className="text-3xl font-serif text-[#1c1917] mt-1 block">
                {totalProjects}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#1b3a2b]/10 flex items-center justify-center text-[#1b3a2b]">
              <FolderOpen className="h-6 w-6 stroke-[1.8]" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#f0ede6] flex items-center justify-between text-xs text-[#78716c]">
            <span>Portfolio Holdings</span>
            <span className="text-[#1b3a2b] font-mono font-medium">100% Synced</span>
          </div>
        </div>

        {/* Active Commissions */}
        <div className="bg-white rounded-3xl border border-[#e7e5df] p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#78716c] block">
                Active Commissions
              </span>
              <span className="text-3xl font-serif text-[#1c1917] mt-1 block">
                {activeProjects}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#1b3a2b]/10 flex items-center justify-center text-[#1b3a2b]">
              <TrendingUp className="h-6 w-6 stroke-[1.8]" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#f0ede6] flex items-center justify-between text-xs text-[#78716c]">
            <span>Engineering Status</span>
            <span className="text-emerald-700 font-mono font-medium">In Progress</span>
          </div>
        </div>

        {/* Est. Portfolio Valuation */}
        <div className="bg-white rounded-3xl border border-[#e7e5df] p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#78716c] block">
                Est. Construction Value
              </span>
              <span className="text-3xl font-serif text-[#1b3a2b] mt-1 block">
                ₹{estValue.toLocaleString()}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#1b3a2b]/10 flex items-center justify-center text-[#1b3a2b]">
              <Coins className="h-6 w-6 stroke-[1.8]" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#f0ede6] flex items-center justify-between text-xs text-[#78716c]">
            <span>Deterministic BOQ Total</span>
            <span className="text-[#78716c] font-mono">INR Standard</span>
          </div>
        </div>
      </div>

      {/* Atelier Suite Quick Launch Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#1b3a2b] font-semibold flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#1b3a2b]" />
            Specialized Atelier Studios
          </span>
          <span className="text-xs text-[#78716c]">1-Click Launch</span>
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
              className="p-4 rounded-2xl bg-white border border-[#e7e5df] hover:border-[#1b3a2b] hover:bg-[#faf8f5] transition-all text-left group shadow-sm"
            >
              <studio.icon className="w-5 h-5 text-[#78716c] group-hover:text-[#1b3a2b] transition-colors mb-2" />
              <div className="text-xs font-medium text-[#1c1917] group-hover:text-[#1b3a2b] font-serif">
                {studio.name}
              </div>
              <div className="text-[10px] text-[#78716c] font-mono mt-0.5">
                {studio.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Projects Mineral Ledger */}
      <div className="bg-white rounded-3xl border border-[#e7e5df] shadow-sm overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between border-b border-[#e7e5df]">
          <div>
            <h2 className="text-lg font-serif font-normal text-[#1c1917]">Recent Architectural Projects</h2>
            <p className="text-xs text-[#78716c] mt-0.5">Blueprints undergoing CAD planning, 3D visualization, and structural takeoff</p>
          </div>
          <Link 
            href="/dashboard/projects" 
            className="text-xs font-mono uppercase tracking-wider text-[#1b3a2b] hover:text-[#14281d] flex items-center gap-1 transition-colors font-medium"
          >
            All Projects <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        {recentProjects.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#faf8f5] border border-[#e7e5df] mx-auto flex items-center justify-center text-[#78716c] mb-4">
              <FolderOpen className="h-8 w-8 text-[#1b3a2b]" />
            </div>
            <h3 className="text-base font-serif font-normal text-[#1c1917]">No architectural projects registered yet</h3>
            <p className="mt-1 text-xs text-[#78716c] max-w-sm mx-auto">
              Initialize your first project to orchestrate plot geometry, 2D room layouts, and PBR structural rendering.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1b3a2b] hover:bg-[#14281d] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm"
              >
                <Plus className="w-4 h-4 stroke-[2.2]" />
                Commission First Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#f0ede6]">
            {recentProjects.map((project: any) => (
              <Link 
                key={project.id} 
                href={`/dashboard/projects/${project.id}`} 
                className="block p-5 sm:px-6 hover:bg-[#faf8f5] transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-serif font-medium text-[#1c1917] group-hover:text-[#1b3a2b] transition-colors">
                        {project.name}
                      </h4>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1b3a2b]/10 text-[#1b3a2b] border border-[#1b3a2b]/20">
                        {project.status || 'Active'}
                      </span>
                    </div>
                    <p className="text-xs text-[#78716c] flex items-center gap-2">
                      <span>{project.site_data?.location || "Architectural Site"}</span>
                      <span>•</span>
                      <span>{project.site_data?.plotArea ? `${project.site_data.plotArea} sq.m` : "Configured Layout"}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block text-right">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c] block">Budget Allocation</span>
                      <span className="text-xs font-serif font-medium text-[#1c1917]">
                        ₹{(project.budget_data?.totalBudget || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#faf8f5] border border-[#d6d3cc] flex items-center justify-center text-[#78716c] group-hover:text-[#1b3a2b] group-hover:border-[#1b3a2b] transition-all">
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
