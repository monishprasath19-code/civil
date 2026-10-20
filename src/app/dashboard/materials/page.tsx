import { defaultMaterials } from "@/data/materials";
import Link from "next/link";
import { Layers, ArrowLeft, Sparkles, Filter, ExternalLink, ShieldCheck } from "lucide-react";

export default function MaterialsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-[0.25em] text-amber-400 uppercase">MATÉRIAUX & PIERRES</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-xs text-zinc-400 font-mono">BIM Material Intelligence Vault</span>
          </div>
          <h1 className="text-3xl font-serif text-white tracking-wide">Materials Atelier</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Explore architectural PBR textures, Italian marble slabs, timber hardwoods, and structural finishes with real-world specifications.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-zinc-300 hover:text-amber-400 text-xs font-mono tracking-wider transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Total Assets</span>
          <span className="text-2xl font-serif text-amber-300">{defaultMaterials.length} Minerals</span>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Shader Fidelity</span>
          <span className="text-2xl font-serif text-white">Full PBR</span>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Cost Association</span>
          <span className="text-2xl font-serif text-emerald-400">Live BOQ Sync</span>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Surface Targets</span>
          <span className="text-2xl font-serif text-amber-200">Walls • Floors • Site</span>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {defaultMaterials.map((mat) => {
          return (
            <div 
              key={mat.id}
              className="group relative bg-zinc-950/90 rounded-2xl border border-zinc-800/80 hover:border-amber-500/40 transition-all duration-300 p-5 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-amber-500/5"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />

              <div>
                {/* Visual Swatch */}
                <div className="w-full h-32 rounded-xl mb-4 relative overflow-hidden border border-zinc-800/80 shadow-inner flex items-center justify-center">
                  <div 
                    className="absolute inset-0 transition-transform group-hover:scale-105 duration-500" 
                    style={{ 
                      backgroundColor: mat.color || '#3f3f46',
                      opacity: 0.95
                    }}
                  />
                  <div className="relative z-10 p-2 rounded-lg bg-black/40 backdrop-blur-md text-[10px] font-mono text-amber-300 uppercase tracking-widest border border-white/10">
                    {mat.style || 'Modern'}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90">{mat.category}</span>
                  <span className="text-[10px] font-mono text-zinc-500">{mat.id}</span>
                </div>

                <h3 className="font-serif text-lg text-white group-hover:text-amber-200 transition-colors">{mat.name}</h3>
                
                {mat.description && (
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-light">{mat.description}</p>
                )}
              </div>

              {/* Technical Specifications */}
              <div className="mt-5 pt-4 border-t border-zinc-900 grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
                <div>
                  <span className="text-zinc-600 block text-[9px] uppercase">Roughness</span>
                  <span className="text-zinc-300">{mat.roughness ?? 0.8}</span>
                </div>
                <div>
                  <span className="text-zinc-600 block text-[9px] uppercase">Metallic</span>
                  <span className="text-zinc-300">{mat.metallic ?? 0}</span>
                </div>
                <div className="col-span-2 flex items-center justify-between pt-1 text-xs">
                  <span className="text-zinc-500">Rate:</span>
                  <span className="font-bold text-amber-300">
                    {mat.price ? `₹${mat.price} / ${mat.priceUnit || 'sqm'}` : 'Base Specification'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
