import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { 
  ArrowLeft, 
  Box, 
  Grid2X2, 
  Calculator, 
  Trash2, 
  LayoutDashboard, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Layers,
  Building,
  Compass
} from "lucide-react";
import { getProject, deleteProject } from "@/services/projectService";
import { revalidatePath } from "next/cache";
import { formatCurrency } from "@/utils/currency";

export default async function ProjectWorkspaceShell({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let project;
  try {
    project = await getProject(id);
  } catch (error) {
    return notFound();
  }

  if (!project) return notFound();

  const handleDelete = async () => {
    "use server";
    try {
      await deleteProject(id);
      revalidatePath('/dashboard');
    } catch (e) {
      console.error(e);
    }
    redirect('/dashboard');
  };

  const site = project.site_data || project.site || {};
  const floors = project.floors_data || project.floors || [];
  const exterior = project.exterior;
  const cost = project.cost_estimate || project.costEstimate || null;
  const budget = project.budget_data?.totalBudget || project.budget?.totalBudget || 0;
  
  let builtUpArea = 0;
  let roomCount = 0;
  floors.forEach((f: any) => {
    f.rooms?.forEach((r: any) => {
      builtUpArea += (r.width * r.height);
      roomCount++;
    });
  });

  const getHealth = () => {
    const warns = [];
    if (floors.length === 0) warns.push("No floor levels configured in 2D planner yet.");
    if (!cost) warns.push("Deterministic cost estimate not yet calculated.");
    if (!exterior?.roofType) warns.push("Exterior architectural roof type not selected.");
    return warns;
  };
  const warnings = getHealth();

  const lastUpdated = project.updatedAt || (project as any).updated_at || new Date().toISOString();

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/projects" 
            className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400/90 font-medium">
                Commission Workspace
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-[10px] font-mono text-zinc-400">ID: {project.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-white mt-0.5">
              {project.name}
            </h1>
            <p className="text-xs text-zinc-400 font-light mt-0.5">
              Site: {site.location || "Designated Plot"} • Calibrated {new Date(lastUpdated).toLocaleDateString()}
            </p>
          </div>
        </div>

        <form action={handleDelete}>
          <button 
            type="submit" 
            className="flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Decommission Project
          </button>
        </form>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Quick Stats & Geometric Health */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800/80 p-5 shadow-xl space-y-4">
            <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold flex items-center gap-2 border-b border-zinc-800/80 pb-3">
              <LayoutDashboard className="w-3.5 h-3.5" /> Site Telemetry
            </h2>
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Plot Bounds</span>
                <span className="font-serif text-sm font-medium text-zinc-100">{site.plotWidth || 0}m × {site.plotLength || 0}m</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Built-up Surface</span>
                <span className="font-serif text-sm font-medium text-zinc-100">{builtUpArea.toFixed(1)} sq.m</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Spatial Structure</span>
                <span className="font-serif text-sm font-medium text-zinc-100">{floors.length} Levels • {roomCount} Chambers</span>
              </div>
              <div className="pt-3 border-t border-zinc-800/70">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Allocated Budget</span>
                <span className="font-serif text-sm font-medium text-zinc-100">{formatCurrency(budget)}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Calculated BOQ</span>
                <span className={`font-serif text-sm font-bold ${cost?.grandTotal > budget ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {cost ? formatCurrency(cost.grandTotal) : 'Pending generation'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800/80 p-5 shadow-xl space-y-4">
            <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold flex items-center gap-2 border-b border-zinc-800/80 pb-3">
              <Sparkles className="w-3.5 h-3.5" /> Structural Integrity
            </h2>
            {warnings.length === 0 ? (
              <div className="flex items-start gap-2.5 text-xs text-emerald-300 bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <p>Architectural geometry and BOQ data are fully validated.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-amber-300/90 bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/20">
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <p>{w}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Architectural Working Modules */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 font-medium flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" />
              Interactive Architectural Studios
            </span>
            <span className="text-xs text-zinc-500 font-mono">Realtime WebGL & CAD</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <WorkspaceCard 
              icon={<Grid2X2 className="w-6 h-6 text-amber-400" />} 
              title="2D CAD Floor Planner" 
              subtitle="Vector CAD Drafting"
              description="Author exterior load-bearing walls, partitions, precision doors, windows, and dynamic spatial zoning." 
              link={`/dashboard/projects/${id}/planner`} 
              primary
            />
            
            <WorkspaceCard 
              icon={<Box className="w-6 h-6 text-amber-400" />} 
              title="3D Design & Interior Engine" 
              subtitle="Three.js PBR Walkthrough"
              description="Inspect generated building geometry in photoreal WebGL 2.0 with Drei sun simulation and luxury mineral materials." 
              link={`/dashboard/projects/${id}/3d`} 
            />
            
            <WorkspaceCard 
              icon={<Calculator className="w-6 h-6 text-amber-400" />} 
              title="Deterministic Cost & BOQ" 
              subtitle="Engineering Bill of Quantities"
              description="Review concrete, steel, masonry, finishing schedules, labor cost indices, and export ready CSVs." 
              link={`/dashboard/projects/${id}/cost`} 
            />
            
            <WorkspaceCard 
              icon={<FileText className="w-6 h-6 text-amber-400" />} 
              title="Executive Architectural Dossier" 
              subtitle="Client Specification & PDF"
              description="Compile high-level engineering briefs, site orientation diagrams, and comprehensive financial summaries." 
              link={`/dashboard/projects/${id}/report`} 
            />

          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceCard({ 
  icon, 
  title, 
  subtitle,
  description, 
  link, 
  primary 
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string;
  description: string; 
  link: string; 
  primary?: boolean;
}) {
  return (
    <div className={`p-6 rounded-2xl border transition-all relative overflow-hidden group shadow-xl ${
      primary 
        ? 'bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950 border-amber-500/30 hover:border-amber-500/60' 
        : 'bg-zinc-900/60 border-zinc-800/80 hover:border-amber-500/40 hover:bg-zinc-900/80'
    }`}>
      {primary && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />
      )}
      
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-zinc-950 border border-zinc-800/80 shadow-md group-hover:border-amber-500/40 group-hover:scale-105 transition-all">
        {icon}
      </div>

      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400/80 block mb-1">
        {subtitle}
      </span>
      <h3 className="text-xl font-serif font-medium text-white group-hover:text-amber-300 transition-colors mb-2">
        {title}
      </h3>
      <p className="text-xs text-zinc-400 leading-relaxed font-light mb-6">
        {description}
      </p>
      
      <Link 
        href={link} 
        className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase font-semibold text-amber-400 group-hover:text-amber-300 transition-colors"
      >
        Launch Studio <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
