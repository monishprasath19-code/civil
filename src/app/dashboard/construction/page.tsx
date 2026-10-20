import { getUserProjects } from "@/services/projectService";
import Link from "next/link";
import { Hammer, ArrowRight, ShieldCheck, CheckCircle2, Clock } from "lucide-react";

export default async function ConstructionMilestonesPage() {
  let projects: any[] = [];
  try {
    projects = await getUserProjects();
  } catch (e) {}

  const standardMilestones = [
    { phase: "Phase 1: Site & Substructure", tasks: ["Plot boundary pegging", "Excavation & footing trenches", "Anti-termite treatment", "Plinth beam casting"], progress: 100 },
    { phase: "Phase 2: Superstructure & Masonry", tasks: ["RCC column casting", "Brickwork / AAC block masonry", "Lintel beams & sunshades", "Roof slab casting"], progress: 75 },
    { phase: "Phase 3: MEP & Rough-Ins", tasks: ["Concealed electrical conduit", "Plumbing inlet & soil lines", "HVAC ducting & drainage", "Door/window frame fixing"], progress: 40 },
    { phase: "Phase 4: Finishes & Handover", tasks: ["Internal cement plastering", "Tile & Italian marble laying", "Joinery & glass glazing", "Final coat luxury painting"], progress: 15 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-[0.25em] text-amber-400 uppercase">SUIVI DE CHANTIER</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-xs text-zinc-400 font-mono">Structural Execution Tracking</span>
          </div>
          <h1 className="text-3xl font-serif text-white tracking-wide">Construction Milestones</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Track site execution progress against verified architectural drawings, structural milestones, and material delivery schedules.
          </p>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {standardMilestones.map((m, idx) => (
          <div 
            key={idx}
            className="p-6 rounded-2xl bg-zinc-950/90 border border-zinc-800/80 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-white">{m.phase}</h3>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                {m.progress}% Completed
              </span>
            </div>

            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden mb-5">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500" 
                style={{ width: `${m.progress}%` }} 
              />
            </div>

            <ul className="space-y-2.5 text-xs text-zinc-300">
              {m.tasks.map((task, tidx) => (
                <li key={tidx} className="flex items-center gap-2.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${tidx === 0 || m.progress > 50 ? 'text-amber-400' : 'text-zinc-600'}`} />
                  <span className={tidx === 0 || m.progress > 50 ? 'text-zinc-200' : 'text-zinc-500'}>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Connected Projects */}
      <div className="pt-6">
        <h2 className="text-xl font-serif text-white mb-4">Active Projects in Construction Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map(p => (
            <Link
              key={p.id}
              href={`/dashboard/projects/${p.id}`}
              className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-amber-500/40 transition-all flex items-center justify-between group"
            >
              <div>
                <h4 className="font-serif text-white group-hover:text-amber-300 transition-colors">{p.name}</h4>
                <p className="text-[11px] font-mono text-zinc-500 mt-0.5">{p.site?.location || 'Custom Site'}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
