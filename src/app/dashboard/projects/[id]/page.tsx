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
    <div className="space-y-8 max-w-7xl font-sans">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e5df] pb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/projects" 
            className="w-10 h-10 rounded-full bg-white border border-[#d6d3cc] flex items-center justify-center text-[#78716c] hover:text-[#1b3a2b] hover:border-[#1b3a2b] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#1b3a2b] font-semibold">
                Project Workspace
              </span>
              <span className="text-[#a8a29e]">•</span>
              <span className="text-[10px] font-mono text-[#78716c]">ID: {project.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-[#1c1917] mt-0.5 font-normal">
              {project.name}
            </h1>
            <p className="text-xs text-[#78716c] font-light mt-0.5">
              Site: {site.location || "Designated Plot"} • Calibrated {new Date(lastUpdated).toLocaleDateString()}
            </p>
          </div>
        </div>

        <form action={handleDelete}>
          <button 
            type="submit" 
            className="flex items-center gap-2 px-5 py-2 text-xs font-mono uppercase tracking-wider text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-full transition-colors font-medium shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Project
          </button>
        </form>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Quick Stats & Geometric Health */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-[#e7e5df] p-6 shadow-sm space-y-4">
            <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#1b3a2b] font-semibold flex items-center gap-2 border-b border-[#f0ede6] pb-3">
              <LayoutDashboard className="w-3.5 h-3.5" /> Site Telemetry
            </h2>
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c] block">Plot Bounds</span>
                <span className="font-serif text-sm font-medium text-[#1c1917]">{site.plotWidth || 0}m × {site.plotLength || 0}m</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c] block">Built-up Surface</span>
                <span className="font-serif text-sm font-medium text-[#1c1917]">{builtUpArea.toFixed(1)} sq.m</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c] block">Spatial Structure</span>
                <span className="font-serif text-sm font-medium text-[#1c1917]">{floors.length} Levels • {roomCount} Chambers</span>
              </div>
              <div className="pt-3 border-t border-[#f0ede6]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c] block">Allocated Budget</span>
                <span className="font-serif text-sm font-medium text-[#1c1917]">{formatCurrency(budget)}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c] block">Calculated BOQ</span>
                <span className={`font-serif text-sm font-bold ${cost?.grandTotal > budget ? 'text-amber-700' : 'text-[#1b3a2b]'}`}>
                  {cost ? formatCurrency(cost.grandTotal) : 'Pending generation'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#e7e5df] p-6 shadow-sm space-y-4">
            <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#1b3a2b] font-semibold flex items-center gap-2 border-b border-[#f0ede6] pb-3">
              <Sparkles className="w-3.5 h-3.5" /> Structural Status
            </h2>
            {warnings.length === 0 ? (
              <div className="flex items-start gap-2.5 text-xs text-emerald-800 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                <p>Architectural geometry and BOQ data are fully validated.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
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
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#1b3a2b] font-semibold flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#1b3a2b]" />
              Interactive Studios
            </span>
            <span className="text-xs text-[#78716c] font-mono">Realtime WebGL & CAD</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <WorkspaceCard 
              icon={<Grid2X2 className="w-6 h-6 text-[#1b3a2b]" />} 
              title="2D CAD Floor Planner" 
              subtitle="Vector CAD Drafting"
              description="Author exterior load-bearing walls, partitions, precision doors, windows, and dynamic spatial zoning." 
              link={`/dashboard/projects/${id}/planner`} 
              primary
            />
            
            <WorkspaceCard 
              icon={<Box className="w-6 h-6 text-[#1b3a2b]" />} 
              title="3D Design & Interior Engine" 
              subtitle="Three.js PBR Walkthrough"
              description="Inspect generated building geometry in photoreal WebGL 2.0 with Drei sun simulation and luxury mineral materials." 
              link={`/dashboard/projects/${id}/3d`} 
            />
            
            <WorkspaceCard 
              icon={<Calculator className="w-6 h-6 text-[#1b3a2b]" />} 
              title="Deterministic Cost & BOQ" 
              subtitle="Engineering Bill of Quantities"
              description="Review concrete, steel, masonry, finishing schedules, labor cost indices, and export ready CSVs." 
              link={`/dashboard/projects/${id}/cost`} 
            />
            
            <WorkspaceCard 
              icon={<FileText className="w-6 h-6 text-[#1b3a2b]" />} 
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
    <div className={`p-7 rounded-3xl border transition-all relative overflow-hidden group shadow-sm hover:shadow-md ${
      primary 
        ? 'bg-[#14281d] text-white border-transparent' 
        : 'bg-white border-[#e7e5df] hover:border-[#1b3a2b]'
    }`}>
      {primary && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400" />
      )}
      
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border transition-all ${
        primary 
          ? 'bg-white/10 border-white/20 text-white' 
          : 'bg-[#faf8f5] border-[#e7e5df] text-[#1b3a2b] group-hover:scale-105'
      }`}>
        {icon}
      </div>

      <span className={`text-[10px] font-mono uppercase tracking-[0.2em] block mb-1 font-semibold ${
        primary ? 'text-emerald-300' : 'text-[#1b3a2b]'
      }`}>
        {subtitle}
      </span>
      <h3 className={`text-xl font-serif font-normal transition-colors mb-2 ${
        primary ? 'text-white' : 'text-[#1c1917] group-hover:text-[#1b3a2b]'
      }`}>
        {title}
      </h3>
      <p className={`text-xs leading-relaxed font-light mb-6 ${
        primary ? 'text-white/80' : 'text-[#78716c]'
      }`}>
        {description}
      </p>
      
      <Link 
        href={link} 
        className={`inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase font-semibold transition-colors ${
          primary ? 'text-white hover:text-emerald-200' : 'text-[#1b3a2b] hover:text-[#14281d]'
        }`}
      >
        Launch Studio <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
