"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Compass, 
  Layers, 
  Box, 
  Calculator, 
  Sparkles, 
  Check, 
  ChevronDown, 
  CheckCircle2, 
  Wand2, 
  Eye, 
  Coins, 
  FileSpreadsheet, 
  Maximize2,
  Building
} from "lucide-react";

export default function FigmaArchitecturalLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [currency, setCurrency] = useState<"USD" | "INR" | "EUR">("USD");

  const faqs = [
    {
      q: "How does AI Civil Agent turn 2D plans into 3D models?",
      a: "Our continuous geometric synthesis pipeline evaluates 2D vector coordinates (walls, doors, windows, and rooms) and extrudes continuous 3D solids in milliseconds using Three.js WebGL 2.0. Walls, parametric furniture, and materials update synchronously without manual modeling."
    },
    {
      q: "Are the cost estimates and BOQs accurate to local markets?",
      a: "Yes. Our deterministic cost engine derives exact material volumes (concrete m³, Fe500 TMT steel kg, masonry m², and interior finishes) directly from geometric boundary math, paired with customizable labor and material index rate overrides."
    },
    {
      q: "Can I customize materials, finishes, and lighting?",
      a: "Absolutely. Our Materials Atelier includes physical PBR textures for Italian Carrara marble, light oak parquet, polished concrete, Venetian plaster, and terracotta shingles. You can also simulate the sun's trajectory across dawn, noon, golden hour, and midnight."
    },
    {
      q: "Can I export my designs to CAD, CSV, or PDF reports?",
      a: "Yes. Export comprehensive Bill of Quantities schedules directly to CSV for contractor bidding, snapshot 4K photorealistic renders, or compile executive client dossiers to printable PDF format."
    },
    {
      q: "Do I need prior CAD or 3D modeling experience?",
      a: "No. The platform is designed with intuitive snapping, smart room polygonization, and an autonomous AI Civil Co-Pilot that interprets natural language instructions like 'Change living room flooring to marble' or 'Add a king bed to the bedroom suite'."
    }
  ];

  const currencyRates = {
    USD: { symbol: "$", total: "385,000", concrete: "48,200", steel: "52,400", masonry: "78,500", finishes: "115,000", mep: "90,900" },
    INR: { symbol: "₹", total: "48,50,000", concrete: "6,20,000", steel: "6,80,000", masonry: "9,90,000", finishes: "14,50,000", mep: "11,10,000" },
    EUR: { symbol: "€", total: "355,000", concrete: "44,500", steel: "48,300", masonry: "72,400", finishes: "106,000", mep: "83,800" }
  };

  const curr = currencyRates[currency];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] font-sans antialiased selection:bg-[#1b3a2b] selection:text-white">
      
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-50 w-full bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e7e5df]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-[#1b3a2b] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-serif font-semibold tracking-tight text-[#1c1917] leading-none">
                Maison Civil
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#78716c] mt-0.5">
                Atelier Architectural
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-wider text-[#78716c]">
            <Link href="#approach" className="hover:text-[#1c1917] transition-colors">Approach</Link>
            <Link href="#interiors" className="hover:text-[#1c1917] transition-colors">Interiors</Link>
            <Link href="#exteriors" className="hover:text-[#1c1917] transition-colors">Exteriors</Link>
            <Link href="#cost-engine" className="hover:text-[#1c1917] transition-colors">Cost & BOQ</Link>
            <Link href="/interior-design" className="hover:text-[#1c1917] text-[#1b3a2b] font-semibold flex items-center gap-1.5 transition-colors">
              <Sparkles className="w-3.5 h-3.5" /> AI Studio
            </Link>
            <Link href="#faq" className="hover:text-[#1c1917] transition-colors">FAQ</Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-xs font-mono uppercase tracking-wider text-[#57534e] hover:text-[#1c1917] transition-colors px-2 py-1"
            >
              Sign In
            </Link>
            <Link 
              href="/dashboard/projects/new" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1b3a2b] hover:bg-[#14281d] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-sm transition-all hover:shadow-md"
            >
              Start Project
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: "Great spaces begin with a clear vision." */}
      <section className="pt-16 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          
          {/* Main Title Left (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8e6df] text-[#1b3a2b] text-[11px] font-mono uppercase tracking-[0.2em] font-medium">
              <Sparkles className="w-3 h-3 text-[#1b3a2b]" />
              Generative Civil & Interior Studio
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-[#1c1917] tracking-tight leading-[1.08] font-normal">
              Great spaces begin with a clear vision.
            </h1>
          </div>

          {/* Subhead & CTAs Right (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:pb-2">
            <p className="text-base sm:text-lg text-[#57534e] font-light leading-relaxed">
              Transform your architectural ideas into reality with AI-powered floor planning, photorealistic 3D visualization, and real-time deterministic cost takeoffs.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link 
                href="/dashboard/projects/new" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1b3a2b] hover:bg-[#14281d] text-white text-xs font-mono uppercase tracking-wider font-bold shadow-md transition-all group"
              >
                <span>Start Designing</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/interior-design" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#f0ede6] text-[#1c1917] border border-[#d6d3cc] text-xs font-mono uppercase tracking-wider font-medium transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#1b3a2b]" />
                <span>Explore AI Studio</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Large Architectural Hero Card */}
        <div className="relative w-full aspect-[16/9] max-h-[640px] rounded-3xl overflow-hidden shadow-2xl border border-[#e7e5df] bg-[#e8e6df] group">
          <Image 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85"
            alt="Modern Architectural Pavilion"
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
          
          {/* Floating Hero Info Bar */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-xl">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716c] block">
                Featured Commission • Residential Pavilion
              </span>
              <h3 className="text-base sm:text-lg font-serif font-semibold text-[#1c1917]">
                Villa Serena • 450 m² Contemporary Living
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1b3a2b] hover:bg-[#14281d] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
              >
                <span>Explore in 3D</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Metric Ticker Bar Below Hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-b border-[#e7e5df] pb-12">
          <div>
            <span className="text-3xl sm:text-4xl font-serif text-[#1b3a2b] font-medium block">500+</span>
            <span className="text-xs text-[#78716c] font-light mt-1 block">Architectural Blueprints Authored</span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-serif text-[#1b3a2b] font-medium block">98%</span>
            <span className="text-xs text-[#78716c] font-light mt-1 block">Quantity Takeoff Accuracy</span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-serif text-[#1b3a2b] font-medium block">60 FPS</span>
            <span className="text-xs text-[#78716c] font-light mt-1 block">Real-Time WebGL Walkthrough</span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-serif text-[#1b3a2b] font-medium block">100%</span>
            <span className="text-xs text-[#78716c] font-light mt-1 block">Deterministic Formulae Validation</span>
          </div>
        </div>
      </section>

      {/* 3. Three Pillars Section: "Your vision, from every angle." */}
      <section id="approach" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16 space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#1b3a2b] font-semibold">
            Our Approach
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#1c1917] tracking-tight">
            Your vision, from every angle.
          </h2>
          <p className="text-base text-[#57534e] font-light leading-relaxed">
            Everything you need to plan, design, visualize, and budget your architectural project in one unified workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 01 */}
          <div className="p-8 rounded-3xl bg-[#f5f3ec] border border-[#e7e5df] hover:border-[#1b3a2b]/30 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md">
            <div className="space-y-4">
              <span className="text-sm font-mono text-[#78716c] block font-semibold">01</span>
              <h3 className="text-2xl font-serif text-[#1c1917] group-hover:text-[#1b3a2b] transition-colors">
                Reimagine the inside.
              </h3>
              <p className="text-sm text-[#57534e] font-light leading-relaxed">
                Explore interior floor plans, material finishes, and lighting with real-time 3D walkthroughs and furniture staging.
              </p>
            </div>
            <div className="pt-8">
              <Link 
                href="/interior-design" 
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-semibold text-[#1b3a2b] hover:text-[#14281d] transition-colors"
              >
                <span>Explore Interiors</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 02 */}
          <div className="p-8 rounded-3xl bg-[#f5f3ec] border border-[#e7e5df] hover:border-[#1b3a2b]/30 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md">
            <div className="space-y-4">
              <span className="text-sm font-mono text-[#78716c] block font-semibold">02</span>
              <h3 className="text-2xl font-serif text-[#1c1917] group-hover:text-[#1b3a2b] transition-colors">
                Shape the outside.
              </h3>
              <p className="text-sm text-[#57534e] font-light leading-relaxed">
                Design façades, rooflines, compound walls, and driveways that harmonize with solar angles and site geometry.
              </p>
            </div>
            <div className="pt-8">
              <Link 
                href="/dashboard/projects/new" 
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-semibold text-[#1b3a2b] hover:text-[#14281d] transition-colors"
              >
                <span>Explore Exteriors</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 03 */}
          <div className="p-8 rounded-3xl bg-[#f5f3ec] border border-[#e7e5df] hover:border-[#1b3a2b]/30 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md">
            <div className="space-y-4">
              <span className="text-sm font-mono text-[#78716c] block font-semibold">03</span>
              <h3 className="text-2xl font-serif text-[#1c1917] group-hover:text-[#1b3a2b] transition-colors">
                Know what it costs.
              </h3>
              <p className="text-sm text-[#57534e] font-light leading-relaxed">
                Calculate accurate bill of quantities, material schedules, and contractor estimates directly from blueprint data.
              </p>
            </div>
            <div className="pt-8">
              <Link 
                href="/dashboard/projects/new" 
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-semibold text-[#1b3a2b] hover:text-[#14281d] transition-colors"
              >
                <span>Explore Cost & BOQ</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Split Feature 1: "A fresh perspective. A familiar feeling." (Interior Spotlight) */}
      <section id="interiors" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#e7e5df]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Image Left (7 cols) */}
          <div className="lg:col-span-7 relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-[#e7e5df] group">
            <Image 
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
              alt="Scandinavian Modern Living Room"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716c] block">PBR Material Pipeline</span>
                <span className="text-sm font-serif font-medium text-[#1c1917]">Italian Carrara Marble & Light Oak Floor</span>
              </div>
              <span className="text-xs font-mono text-[#1b3a2b] font-semibold">60 FPS</span>
            </div>
          </div>

          {/* Text Right (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#1b3a2b] font-semibold block">
              Interior Architecture
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif text-[#1c1917] tracking-tight leading-tight">
              A fresh perspective. A familiar feeling.
            </h2>
            <p className="text-sm sm:text-base text-[#57534e] font-light leading-relaxed">
              Step inside your floor plans before breaking ground. Experiment with physical marble, oak hardwood, warm recessed downlighting, and custom furniture arrangements in real-time.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "True-to-scale parametric furniture catalog",
                "High-fidelity procedural PBR material textures",
                "Interactive first-person WASD walkthroughs",
                "Automated daylight factor & glazing evaluation"
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-[#1c1917]">
                  <div className="w-5 h-5 rounded-full bg-[#1b3a2b]/10 flex items-center justify-center text-[#1b3a2b] shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="font-light">{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link 
                href="/interior-design" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1b3a2b] hover:bg-[#14281d] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-sm group"
              >
                <span>Launch 3D Interior Studio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Split Feature 2: "Make a lasting first impression." (Exterior Spotlight) */}
      <section id="exteriors" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#e7e5df]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Left (5 cols) */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#1b3a2b] font-semibold block">
              Exterior & Site Planning
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif text-[#1c1917] tracking-tight leading-tight">
              Make a lasting first impression.
            </h2>
            <p className="text-sm sm:text-base text-[#57534e] font-light leading-relaxed">
              Craft façades, rooflines, compound walls, and driveways that maximize solar orientation, ventilation, and architectural curb appeal.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Physical Sky & Sun Azimuth trajectory simulation",
                "Custom architectural rooflines: flat, sloped, or terracotta",
                "Perimeter boundary walls, sliding gates & driveway pavers",
                "Plot coverage and Floor Area Ratio (FAR) compliance"
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-[#1c1917]">
                  <div className="w-5 h-5 rounded-full bg-[#1b3a2b]/10 flex items-center justify-center text-[#1b3a2b] shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="font-light">{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link 
                href="/dashboard/projects/new" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1b3a2b] hover:bg-[#14281d] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-sm group"
              >
                <span>Explore Exterior Tools</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Image Right (7 cols) */}
          <div className="lg:col-span-7 relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-[#e7e5df] order-1 lg:order-2 group">
            <Image 
              src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85"
              alt="Modern Exterior Residence"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716c] block">Façade & Site Studio</span>
                <span className="text-sm font-serif font-medium text-[#1c1917]">Sloped Roof & Compound Enclosure</span>
              </div>
              <span className="text-xs font-mono text-[#1b3a2b] font-semibold">Active Sun Simulation</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Deep Forest Green Section: "Big ideas. Grounded in real numbers." (Cost & BOQ) */}
      <section id="cost-engine" className="py-24 px-6 bg-[#14281d] text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-white/10 pb-10">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#a7c4b5] font-semibold block">
                Cost Estimation & Takeoffs
              </span>
              <h2 className="text-4xl sm:text-5xl font-serif text-white tracking-tight">
                Big ideas. Grounded in real numbers.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm sm:text-base text-[#c5d8cd] font-light leading-relaxed">
                Never guess construction costs. Turn floor plans into deterministic material quantities, bill of quantities (BOQ), and contractor schedules instantly.
              </p>
            </div>
          </div>

          {/* Interactive Takeoff Preview Card Component */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white text-[#1c1917] shadow-2xl border border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e5df] pb-6 mb-8">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716c] block">
                  Deterministic Takeoff Summary
                </span>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-[#1b3a2b] mt-1">
                  {curr.symbol}{curr.total}
                </div>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#f5f3ec] border border-[#e7e5df]">
                {(["USD", "INR", "EUR"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all ${
                      currency === c ? "bg-[#1b3a2b] text-white shadow-sm" : "text-[#78716c] hover:text-[#1c1917]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Breakdown List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e5df] space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] block">Concrete Substructure</span>
                <div className="text-lg font-serif font-semibold text-[#1c1917]">{curr.symbol}{curr.concrete}</div>
                <span className="text-xs text-[#57534e] font-light block">48.5 m³ M25 Reinforced Slabs</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e5df] space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] block">Fe500 Reinforcement Steel</span>
                <div className="text-lg font-serif font-semibold text-[#1c1917]">{curr.symbol}{curr.steel}</div>
                <span className="text-xs text-[#57534e] font-light block">4,120 kg High-Tensile Rebar</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e5df] space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] block">Brick Masonry & Plaster</span>
                <div className="text-lg font-serif font-semibold text-[#1c1917]">{curr.symbol}{curr.masonry}</div>
                <span className="text-xs text-[#57534e] font-light block">380 m² External & Internal Walls</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e5df] space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] block">Interior Millwork & Finishes</span>
                <div className="text-lg font-serif font-semibold text-[#1c1917]">{curr.symbol}{curr.finishes}</div>
                <span className="text-xs text-[#57534e] font-light block">Italian Marble & Oak Flooring</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e5df] space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] block">MEP & Electrical Rough-Ins</span>
                <div className="text-lg font-serif font-semibold text-[#1c1917]">{curr.symbol}{curr.mep}</div>
                <span className="text-xs text-[#57534e] font-light block">Sanitary Lines, Conduit & Panels</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#1b3a2b]/5 border border-[#1b3a2b]/20 space-y-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#1b3a2b] font-semibold block">Export Contractor Schedule</span>
                  <p className="text-xs text-[#57534e] font-light mt-1">Download complete line-item specifications in CSV format.</p>
                </div>
                <Link
                  href="/dashboard/projects/new"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#1b3a2b] hover:text-[#14281d] mt-2"
                >
                  <span>Export BOQ CSV</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#e7e5df] text-xs text-[#78716c]">
              <span>Calculated deterministically from CAD wall lengths and room polygons.</span>
              <span className="font-mono text-[#1b3a2b] font-semibold">Zero Invented Data</span>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Process Steps: "Less guesswork. More forward." */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16 space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#1b3a2b] font-semibold">
            Workflow
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#1c1917] tracking-tight">
            Less guesswork. More forward.
          </h2>
          <p className="text-base text-[#57534e] font-light leading-relaxed">
            A frictionless, end-to-end design pipeline built for architects, engineers, and homeowners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              num: "01",
              title: "Draft your floor plan",
              desc: "Draw exterior walls, interior partitions, doors, and windows with millimeter-accurate metric coordinates and orthogonal grid magnet snapping."
            },
            {
              num: "02",
              title: "Step into 3D",
              desc: "Instantly convert 2D vectors into photorealistic 3D spaces with physical sky illumination, soft PCF shadows, and real PBR architectural textures."
            },
            {
              num: "03",
              title: "Export BOQ & build",
              desc: "Derive automated Bill of Quantities schedules, material takeoffs, and executive client dossiers ready for municipal permits and contractor bids."
            }
          ].map((step, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-[#f5f3ec] border border-[#e7e5df] space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#78716c] font-semibold block">
                {step.num}
              </span>
              <h3 className="text-2xl font-serif text-[#1c1917]">
                {step.title}
              </h3>
              <p className="text-sm text-[#57534e] font-light leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Showcase Gallery: "Different spaces. Endless possibilities." */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[#e7e5df]">
        <div className="max-w-2xl mb-16 space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#1b3a2b] font-semibold">
            Curated Portfolio
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#1c1917] tracking-tight">
            Different spaces. Endless possibilities.
          </h2>
          <p className="text-base text-[#57534e] font-light leading-relaxed">
            Explore diverse typologies authored and visualized on the Maison Civil platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "The Minimalist Suite",
              type: "Primary Bedroom • 32 m²",
              img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=85"
            },
            {
              title: "The Courtyard Villa",
              type: "Contemporary Residence • 280 m²",
              img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85"
            },
            {
              title: "The Atelier Kitchen",
              type: "Chef's Culinary Space • 45 m²",
              img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=85"
            }
          ].map((item, i) => (
            <div key={i} className="group rounded-3xl overflow-hidden bg-white border border-[#e7e5df] shadow-sm hover:shadow-lg transition-all">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image 
                  src={item.img} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716c] block">
                  {item.type}
                </span>
                <h3 className="text-xl font-serif text-[#1c1917] group-hover:text-[#1b3a2b] transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ Section: "Good questions. Clear answers." */}
      <section id="faq" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#e7e5df]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* FAQ Left Header (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#1b3a2b] font-semibold block">
              Frequently Asked Questions
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif text-[#1c1917] tracking-tight">
              Good questions. Clear answers.
            </h2>
            <p className="text-sm text-[#57534e] font-light leading-relaxed">
              Everything you need to know about our architectural and civil engineering platform.
            </p>
          </div>

          {/* Accordion Right (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-[#e7e5df] bg-white transition-all overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4"
                  >
                    <span className="text-base font-serif font-medium text-[#1c1917]">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#78716c] transition-transform duration-300 ${isOpen ? "rotate-180 text-[#1b3a2b]" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-[#57534e] font-light leading-relaxed border-t border-[#f5f3ec] pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. Pre-Footer Banner: "See the potential. Build with confidence." */}
      <section className="py-20 px-6 bg-[#14281d] text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#a7c4b5] font-semibold block">
            Start Designing Today
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-[1.1]">
            See the potential. Build with confidence.
          </h2>
          <p className="text-base text-[#c5d8cd] font-light max-w-xl mx-auto leading-relaxed">
            Join architects, interior designers, and homeowners bringing vision and mathematical rigor to architectural projects.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#14281d] font-bold text-xs font-mono uppercase tracking-wider hover:bg-[#f0ede6] transition-all shadow-lg"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/interior-design"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-transparent border border-white/30 text-white font-medium text-xs font-mono uppercase tracking-wider hover:bg-white/10 transition-all"
            >
              <span>Explore AI Studio</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Architectural Footer */}
      <footer className="border-t border-[#e7e5df] bg-[#faf8f5] py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#1b3a2b] flex items-center justify-center text-white">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-serif font-semibold text-[#1c1917]">Maison Civil</span>
            </div>
            <p className="text-xs text-[#78716c] font-light max-w-sm leading-relaxed">
              Unified generative civil engineering platform. 2D vector CAD drafting, Three.js photoreal 3D WebGL engine, and deterministic quantity takeoff calculations.
            </p>
            <span className="text-[11px] font-mono text-[#a8a29e] block pt-2">
              © {new Date().getFullYear()} Maison Civil Associates. All rights reserved.
            </span>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1c1917] font-semibold block">Product</span>
            <ul className="space-y-2 text-xs text-[#78716c] font-light">
              <li><Link href="/dashboard/planner" className="hover:text-[#1c1917]">2D CAD Planner</Link></li>
              <li><Link href="/dashboard/interior" className="hover:text-[#1c1917]">3D Design Engine</Link></li>
              <li><Link href="/interior-design" className="hover:text-[#1c1917]">Interior AI Studio</Link></li>
              <li><Link href="/dashboard/estimator" className="hover:text-[#1c1917]">Cost Takeoffs & BOQ</Link></li>
              <li><Link href="/dashboard/materials" className="hover:text-[#1c1917]">Materials Atelier</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1c1917] font-semibold block">Solutions</span>
            <ul className="space-y-2 text-xs text-[#78716c] font-light">
              <li><Link href="/dashboard/projects/new" className="hover:text-[#1c1917]">Residential Architecture</Link></li>
              <li><Link href="/interior-design" className="hover:text-[#1c1917]">Virtual Staging</Link></li>
              <li><Link href="/dashboard/construction" className="hover:text-[#1c1917]">Contractor Schedules</Link></li>
              <li><Link href="/dashboard/reports" className="hover:text-[#1c1917]">Executive Dossiers</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1c1917] font-semibold block">Atelier</span>
            <ul className="space-y-2 text-xs text-[#78716c] font-light">
              <li><Link href="/login" className="hover:text-[#1c1917]">Client Portal</Link></li>
              <li><Link href="/dashboard/settings" className="hover:text-[#1c1917]">Studio Calibration</Link></li>
              <li><Link href="/signup" className="hover:text-[#1c1917]">Create Profile</Link></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}
