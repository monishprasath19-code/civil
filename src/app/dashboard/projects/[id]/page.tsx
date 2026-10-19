import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Box, Grid2X2, Calculator, Trash2, MapPin, Building, LayoutDashboard, Ruler, FileText, CheckCircle2, AlertTriangle, IndianRupee } from "lucide-react";
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
    if (floors.length === 0) warns.push("No floors created.");
    if (!cost) warns.push("Cost estimate not generated.");
    if (!exterior?.roofType) warns.push("No exterior roof set.");
    return warns;
  };
  const warnings = getHealth();

  const lastUpdated = project.updatedAt || (project as any).updated_at || new Date().toISOString();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{project.name}</h2>
            <p className="text-sm text-slate-500">ID: {project.id} • Last updated: {new Date(lastUpdated).toLocaleDateString()}</p>
          </div>
        </div>
        <form action={handleDelete}>
          <button 
            type="submit" 
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Project
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Column: Quick Stats & Health */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Overview
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-500 block">Plot Size</span>
                <span className="font-medium">{site.plotWidth || 0}m × {site.plotLength || 0}m</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Built-up Area</span>
                <span className="font-medium">{builtUpArea.toFixed(1)} sqm</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Floors & Rooms</span>
                <span className="font-medium">{floors.length} Floors • {roomCount} Rooms</span>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500 block">Project Budget</span>
                <span className="font-medium text-slate-800">{formatCurrency(budget)}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Estimated Cost</span>
                <span className={`font-medium ${cost?.grandTotal > budget ? 'text-red-600' : 'text-green-600'}`}>
                  {cost ? formatCurrency(cost.grandTotal) : 'Not generated'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Project Health</h3>
            {warnings.length === 0 ? (
              <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-100">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <p>Project geometry and data are in good standing.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded border border-amber-100">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{w}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Workspaces */}
        <div className="md:col-span-3">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Professional Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <WorkspaceCard 
              icon={<Grid2X2 />} 
              title="2D Floor Planner" 
              description="Draw walls, add doors, layout rooms, and arrange interactive furniture." 
              link={`/dashboard/projects/${id}/planner`} 
              primary
            />
            
            <WorkspaceCard 
              icon={<Box />} 
              title="3D Design Engine" 
              description="Visualize your generated house in 3D with interactive walkthroughs." 
              link={`/dashboard/projects/${id}/3d`} 
            />
            
            <WorkspaceCard 
              icon={<Calculator />} 
              title="Cost Estimate & BOQ" 
              description="Review deterministic estimates, material summaries, and CSV exports." 
              link={`/dashboard/projects/${id}/cost`} 
            />
            
            <WorkspaceCard 
              icon={<FileText />} 
              title="Project Report" 
              description="Generate a professional summary of your site, design, and estimates." 
              link={`/dashboard/projects/${id}/report`} 
            />

          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceCard({ icon, title, description, link, disabled, primary }: { icon: React.ReactNode, title: string, description: string, link: string, disabled?: boolean, primary?: boolean }) {
  return (
    <div className={`p-6 rounded-xl border ${disabled ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden'}`}>
      {primary && <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${disabled ? 'bg-slate-100 text-slate-400' : (primary ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600')}`}>
        {icon}
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${disabled ? 'text-slate-500' : 'text-slate-900'}`}>
        {title} {disabled && <span className="ml-2 text-xs font-normal bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">Soon</span>}
      </h3>
      <p className={`text-sm ${disabled ? 'text-slate-400' : 'text-slate-600'}`}>{description}</p>
      
      {!disabled && (
        <Link href={link} className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">
          Open module <span aria-hidden="true">&rarr;</span>
        </Link>
      )}
    </div>
  );
}
