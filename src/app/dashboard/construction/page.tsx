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
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e5df] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#1b3a2b] uppercase font-semibold">SUIVI DE CHANTIER</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span className="text-xs text-[#78716c] font-mono">Structural Execution Tracking</span>
          </div>
          <h1 className="text-3xl font-serif text-[#1c1917] tracking-tight font-normal">Construction Milestones</h1>
          <p className="text-[#78716c] text-sm mt-1 max-w-2xl font-light">
            Track site execution progress against verified architectural drawings, structural milestones, and material delivery schedules.
          </p>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {standardMilestones.map((m, idx) => (
          <div 
            key={idx}
            className="p-7 rounded-3xl bg-white border border-[#e7e5df] shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-[#1c1917] font-normal">{m.phase}</h3>
              <span className="text-xs font-mono font-semibold text-[#1b3a2b] bg-[#1b3a2b]/10 border border-[#1b3a2b]/20 px-3 py-1 rounded-full">
                {m.progress}% Completed
              </span>
            </div>

            <div className="h-2 w-full bg-[#f0ede6] rounded-full overflow-hidden mb-5">
              <div 
                className="h-full bg-[#1b3a2b] rounded-full transition-all duration-500" 
                style={{ width: `${m.progress}%` }} 
              />
            </div>

            <ul className="space-y-2.5 text-xs text-[#57534e]">
              {m.tasks.map((task, tidx) => (
                <li key={tidx} className="flex items-center gap-2.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${tidx === 0 || m.progress > 50 ? 'text-[#1b3a2b]' : 'text-[#a8a29e]'}`} />
                  <span className={tidx === 0 || m.progress > 50 ? 'text-[#1c1917]' : 'text-[#78716c]'}>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Connected Projects */}
      <div className="pt-6">
        <h2 className="text-xl font-serif text-[#1c1917] mb-4 font-normal">Active Projects in Construction Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map(p => (
            <Link
              key={p.id}
              href={`/dashboard/projects/${p.id}`}
              className="p-5 rounded-3xl bg-white border border-[#e7e5df] hover:border-[#1b3a2b] transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                <h4 className="font-serif text-[#1c1917] group-hover:text-[#1b3a2b] transition-colors">{p.name}</h4>
                <p className="text-[11px] font-mono text-[#78716c] mt-0.5">{p.site?.location || 'Custom Site'}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#78716c] group-hover:text-[#1b3a2b] group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
