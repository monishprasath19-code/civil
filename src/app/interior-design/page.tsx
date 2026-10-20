import Link from "next/link";
import { 
  Sparkles, 
  Wand2, 
  Compass, 
  ArrowRight, 
  Box, 
  Layers, 
  Palette, 
  CheckCircle2, 
  Sliders, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import DehomeInteriorStudio from "@/components/interior/DehomeInteriorStudio";

export const metadata = {
  title: "AI Interior Design & Visual Staging Studio | Maison Civil",
  description: "Transform raw rooms, sketches, or 2D floor plans into award-winning photorealistic interiors in seconds. Interactive before-and-after slider and PBR physical materials.",
};

export default function InteriorDesignPublicPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Luxury Navigation */}
      <nav className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-zinc-950 font-serif font-bold text-sm shadow-md">
              <Compass className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-sm font-serif tracking-wider text-white uppercase font-semibold block leading-tight">
                Maison Civil
              </span>
              <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-amber-400/80 block">
                Interior Design AI
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/interior" 
              className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-amber-400 transition-colors hidden sm:block"
            >
              Atelier Dashboard
            </Link>
            <Link 
              href="/dashboard/projects/new" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
            >
              Start Designing <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Eyebrow */}
      <section className="pt-12 pb-6 px-6 max-w-7xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-[0.25em]">
          <Sparkles className="w-3.5 h-3.5" />
          The Cartier-Calibrated Interior AI Studio
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Redesign Any Interior Space in Photorealistic 4K
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
          Upload any room photo, sketch, or 2D floor plan. Select from curated architectural styles, customize materials, and inspect real-time before-and-after transformations.
        </p>
      </section>

      {/* Main Interactive Studio Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <DehomeInteriorStudio />
      </main>

      {/* 3-Step Workflow Section */}
      <section className="py-20 border-t border-zinc-900 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-2 mb-16">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-400 font-medium">
              Frictionless Architectural Flow
            </span>
            <h2 className="text-3xl font-serif text-white tracking-tight">
              From Raw Space to Editorial Masterpiece in Three Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload or Select Space",
                desc: "Drop a smartphone photo of an unfurnished room, outdated apartment, CAD blueprint, or choose from our luxury spatial presets.",
                icon: Layers
              },
              {
                step: "02",
                title: "Define Aesthetic & Typology",
                desc: "Select from curated architectural styles like Modern Luxury, Japandi Warm, or Parisian Haussmann. Fine-tune lighting and materials.",
                icon: Palette
              },
              {
                step: "03",
                title: "Generate & Walkthrough in 3D",
                desc: "Slide through the interactive before/after reveal in seconds, download high-res renders, and directly synchronize into the 3D WebGL engine.",
                icon: Wand2
              }
            ].map((col, idx) => (
              <div 
                key={idx} 
                className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 hover:border-amber-500/40 transition-all space-y-4 relative group"
              >
                <div className="text-2xl font-mono text-amber-400/80 font-bold">{col.step}</div>
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition-transform">
                  <col.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-white font-medium">{col.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">{col.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="py-20 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Virtual Staging",
                desc: "Fill empty drywall rooms with luxury designer furniture, rugs, and ambient lighting."
              },
              {
                title: "Material Reskinning",
                desc: "Swap wall finishes to Venetian plaster and floors to Italian Carrara marble or oak parquet."
              },
              {
                title: "Object Replacement",
                desc: "Inpaint and swap individual items like sofas, lighting pendants, and kitchen islands."
              },
              {
                title: "3D BIM Synchronization",
                desc: "Instantly translate AI visual concepts into real parametric 3D models with bill of quantities."
              }
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                <CheckCircle2 className="w-5 h-5 text-amber-400 mb-2" />
                <h4 className="text-base font-serif text-white font-medium">{f.title}</h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="border-t border-zinc-900 py-12 px-6 text-center bg-black">
        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="text-2xl font-serif text-white">Experience Cartier-Level Interior Intelligence</h3>
          <p className="text-xs text-zinc-400 font-light">
            Commission your first architectural project today and discover the future of civil design.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/interior"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
            >
              Enter Interior Studio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
