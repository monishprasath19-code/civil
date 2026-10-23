import { defaultMaterials } from "@/data/materials";
import Link from "next/link";
import { Layers, ArrowLeft, Sparkles, Filter, ExternalLink, ShieldCheck, Compass } from "lucide-react";

export default function MaterialsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e5df] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#1b3a2b] uppercase font-semibold">
              MATÉRIAUX & PIERRES
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span className="text-xs text-[#78716c] font-mono">BIM Material Intelligence Vault</span>
          </div>
          <h1 className="text-3xl font-serif text-[#1c1917] tracking-tight font-normal">Materials Atelier</h1>
          <p className="text-[#78716c] text-sm mt-1 max-w-2xl font-light">
            Explore architectural PBR textures, Italian marble slabs, timber hardwoods, and structural finishes with real-world physical specifications.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#d6d3cc] hover:bg-[#faf8f5] text-[#1c1917] text-xs font-mono tracking-wider transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#e7e5df] shadow-sm">
          <span className="text-[10px] font-mono text-[#78716c] uppercase tracking-widest block mb-1">Total Assets</span>
          <span className="text-2xl font-serif text-[#1b3a2b]">{defaultMaterials.length} Minerals</span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#e7e5df] shadow-sm">
          <span className="text-[10px] font-mono text-[#78716c] uppercase tracking-widest block mb-1">Shader Fidelity</span>
          <span className="text-2xl font-serif text-[#1c1917]">Full PBR</span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#e7e5df] shadow-sm">
          <span className="text-[10px] font-mono text-[#78716c] uppercase tracking-widest block mb-1">Cost Association</span>
          <span className="text-2xl font-serif text-emerald-700">Live BOQ Sync</span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#e7e5df] shadow-sm">
          <span className="text-[10px] font-mono text-[#78716c] uppercase tracking-widest block mb-1">Surface Targets</span>
          <span className="text-2xl font-serif text-[#1c1917]">Walls • Floors • Site</span>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {defaultMaterials.map((mat) => {
          return (
            <div 
              key={mat.id}
              className="group relative bg-white rounded-3xl border border-[#e7e5df] hover:border-[#1b3a2b] transition-all duration-300 p-5 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md"
            >
              <div>
                {/* Visual Swatch */}
                <div className="w-full h-32 rounded-2xl mb-4 relative overflow-hidden border border-[#e7e5df] shadow-inner flex items-center justify-center">
                  <div 
                    className="absolute inset-0 transition-transform group-hover:scale-105 duration-500" 
                    style={{ 
                      backgroundColor: mat.color || '#e4e4e7',
                      opacity: 0.95
                    }}
                  />
                  <div className="relative z-10 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[10px] font-mono text-[#1c1917] uppercase tracking-widest border border-white/40 font-medium">
                    {mat.style || 'Modern'}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#1b3a2b] font-semibold">{mat.category}</span>
                  <span className="text-[10px] font-mono text-[#a8a29e]">{mat.id}</span>
                </div>

                <h3 className="font-serif text-lg text-[#1c1917] group-hover:text-[#1b3a2b] transition-colors">{mat.name}</h3>
                
                {mat.description && (
                  <p className="text-xs text-[#78716c] mt-1.5 leading-relaxed font-light">{mat.description}</p>
                )}
              </div>

              {/* Technical Specifications */}
              <div className="mt-5 pt-4 border-t border-[#f0ede6] grid grid-cols-2 gap-2 text-[11px] font-mono text-[#57534e]">
                <div>
                  <span className="text-[#a8a29e] block text-[9px] uppercase">Roughness</span>
                  <span className="text-[#1c1917]">{mat.roughness ?? 0.8}</span>
                </div>
                <div>
                  <span className="text-[#a8a29e] block text-[9px] uppercase">Metallic</span>
                  <span className="text-[#1c1917]">{mat.metallic ?? 0}</span>
                </div>
                <div className="col-span-2 flex items-center justify-between pt-1 text-xs">
                  <span className="text-[#78716c]">Rate:</span>
                  <span className="font-bold text-[#1b3a2b]">
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
