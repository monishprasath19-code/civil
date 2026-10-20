"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Building, 
  Layers, 
  Component, 
  Calculator, 
  Box, 
  Cpu, 
  Sparkles, 
  Sun, 
  ShieldCheck, 
  CheckCircle2, 
  Compass, 
  Video, 
  FileSpreadsheet, 
  Zap, 
  BarChart3,
  Globe,
  Leaf
} from "lucide-react";

export default function FuturisticLanding() {
  const [activeTab, setActiveTab] = useState<'3d' | 'cad' | 'cost' | 'ai' | 'solar'>('3d');

  const showcaseData = {
    '3d': {
      title: "Real-Time Photorealistic 3D Engine",
      tagline: "Three.js WebGL 2.0 with Physical Sky, Soft PCF Shadows & Matterport Walkthrough",
      metrics: [
        { label: "Shadow Resolution", value: "4096² Soft PCF" },
        { label: "Atmosphere Engine", value: "Physical Rayleigh Sky" },
        { label: "Camera Modes", value: "Orbit, Top, Drone & FPS" },
        { label: "Frame Rate", value: "60 FPS Hardware Accel" }
      ],
      description: "Convert 2D vectors into continuous 3D solids in milliseconds. Inspect multi-floor buildings, furnish interiors with real PBR materials, and fly cinematic 360° drone tours around the site.",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      cta: "Explore 3D Workspace"
    },
    'cad': {
      title: "Precision 2D CAD Floor Planner",
      tagline: "Real-World Metric Vector Coordinates with Snap-to-Grid & Automatic Room Polygonization",
      metrics: [
        { label: "Scale Accuracy", value: "1:50 Architectural Metric" },
        { label: "Wall Snapping", value: "0.25m / 0.5m Orthogonal" },
        { label: "Floor Stacking", value: "Multi-Storey Elevation" },
        { label: "Rendering Tech", value: "React-Konva GPU Canvas" }
      ],
      description: "Draw architectural walls with realistic thicknesses. Doors, windows, and custom furniture snap deterministically to walls with real structural constraints.",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      cta: "Launch 2D Planner"
    },
    'cost': {
      title: "Deterministic Cost Engine & BOQ Generator",
      tagline: "Live Mathematical Quantity Takeoffs with Dynamic Rate Overrides & CSV Export",
      metrics: [
        { label: "Quantity Calculation", value: "Deterministic Formulae" },
        { label: "Custom Overrides", value: "Material & Labour Rates" },
        { label: "Export Formats", value: "CSV & Printable PDF Report" },
        { label: "Wastage Modeling", value: "Dynamic 5-10% Factors" }
      ],
      description: "Never guess construction costs. Calculate masonry volume, concrete slabs, plaster surface area, flooring tiles, and door fixtures directly from your geometric data.",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      cta: "View Cost Dashboard"
    },
    'ai': {
      title: "Autonomous AI Civil & Interior Co-Pilot",
      tagline: "Semantic Spatial Language with Deterministic Boundary & Collision Validation",
      metrics: [
        { label: "Core Model", value: "Gemini 2.5 Pro Vision" },
        { label: "Safety Pipeline", value: "Zero Direct JSON Mutation" },
        { label: "Transaction Mode", value: "Preview → Apply → Undo" },
        { label: "Latency", value: "< 1.2s Spatial Synthesis" }
      ],
      description: "Instruct the co-pilot in natural language ('Move the sofa near the window', 'Optimize living room for natural ventilation'). All actions pass through strict civil engineering validation.",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      cta: "Try AI Civil Agent"
    },
    'solar': {
      title: "Passive Solar & Carbon Sustainability Analytics",
      tagline: "Sun Azimuth Trajectory, Glazing Ratios & Embodied Carbon Calculations",
      metrics: [
        { label: "Daylight Factor", value: "Glazing-to-Wall Ratio" },
        { label: "Solar Tracking", value: "Azimuth & Altitude Dial" },
        { label: "Embodied Carbon", value: "kgCO₂e/m² Life-Cycle" },
        { label: "Plot Ratio", value: "FAR & Footprint Coverage" }
      ],
      description: "Simulate solar illumination across morning, afternoon, and evening. Evaluate thermal mass efficiency and ensure code-compliant window-to-wall ratios before construction begins.",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      cta: "Run Solar Audit"
    }
  };

  const currentShowcase = showcaseData[activeTab];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Futuristic Blueprint Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-sky-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Futuristic Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center text-white font-extrabold shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
              AI
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                CIVIL AGENT <span className="text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30 px-1.5 py-0.5 rounded-full font-mono">2.0</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider -mt-0.5">GENERATIVE BIM ARCHITECTURE</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link href="#architecture" className="text-slate-400 hover:text-sky-400 transition-colors">Architecture</Link>
            <Link href="#engine" className="text-slate-400 hover:text-sky-400 transition-colors">3D Engine</Link>
            <Link href="#costing" className="text-slate-400 hover:text-sky-400 transition-colors">Cost & BOQ</Link>
            <Link href="#co-pilot" className="text-slate-400 hover:text-sky-400 transition-colors">AI Co-Pilot</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 flex items-center gap-1.5"
            >
              Launch Studio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 z-10">
        <section className="relative pt-20 pb-28 overflow-hidden">
          <div className="container mx-auto px-4 text-center max-w-5xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-xs text-sky-400 mb-8 shadow-inner">
              <Zap className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span className="font-medium">Deterministic Spatial Intelligence & 3D WebGL Visualization</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
              Architectural Design. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400">
                Engineered for Tomorrow.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              AI Civil Agent unifies CAD floor planning, photorealistic 3D visualization, preliminary Bill of Quantities estimation, and autonomous AI spatial layout into a seamless, high-performance web platform.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                href="/signup" 
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl font-bold text-base transition-all shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 flex items-center justify-center gap-2.5 group"
              >
                <span>Start New Project</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/login" 
                className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 rounded-xl font-semibold text-base transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Box className="w-5 h-5 text-sky-400" />
                <span>Open Workspace</span>
              </Link>
            </div>

            {/* Real-time Ticker Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              <MetricTicker label="Geometric Unit" value="Meters (1:50 True Scale)" />
              <MetricTicker label="Graphics Pipeline" value="Three.js WebGL 2.0" />
              <MetricTicker label="Cost Engine" value="Formulaic Deterministic BOQ" />
              <MetricTicker label="AI Boundary Check" value="100% Collision-Safe" />
            </div>
          </div>
        </section>

        {/* Interactive Holographic Showcase Module */}
        <section id="architecture" className="py-16 bg-slate-900/50 border-y border-slate-800/80">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Architectural Studio Matrix</h2>
              <p className="text-sm text-slate-400 max-w-xl mx-auto">
                Explore the synchronized engineering subsystems running natively in your browser.
              </p>
            </div>

            {/* Interactive Showcase Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {[
                { id: '3d', label: '3D Photoreal Engine', icon: <Box className="w-4 h-4" /> },
                { id: 'cad', label: '2D Floor Planner', icon: <Layers className="w-4 h-4" /> },
                { id: 'cost', label: 'Cost & BOQ Engine', icon: <Calculator className="w-4 h-4" /> },
                { id: 'ai', label: 'AI Spatial Co-Pilot', icon: <Cpu className="w-4 h-4" /> },
                { id: 'solar', label: 'Solar & Carbon Index', icon: <Sun className="w-4 h-4" /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 border border-sky-400'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Showcase Stage Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
                <div className="flex-1 space-y-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border ${currentShowcase.badgeColor}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>SYSTEM COMPONENT ACTIVE</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{currentShowcase.title}</h3>
                  <p className="text-sm font-medium text-sky-400 font-mono">{currentShowcase.tagline}</p>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-xl">{currentShowcase.description}</p>

                  <div className="pt-4">
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700"
                    >
                      <span>{currentShowcase.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                    </Link>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="w-full lg:w-80 grid grid-cols-2 gap-3 bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80">
                  {currentShowcase.metrics.map(metric => (
                    <div key={metric.label} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 font-mono block uppercase mb-1">{metric.label}</span>
                      <span className="text-xs font-bold text-slate-100 font-mono">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Feature Matrix */}
        <section id="engine" className="py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Engineering Capabilities</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
                Purpose-built for architects, civil engineers, structural draftsmen, and forward-thinking homeowners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BentoCard
                icon={<Box className="w-6 h-6 text-sky-400" />}
                title="Cinematic Three.js Rendering"
                description="Experience full PBR textures, soft contact shadows, physical Rayleigh sky, and depth fog with instantaneous 60 FPS performance."
                tag="3D GRAPHICS"
              />
              <BentoCard
                icon={<Layers className="w-6 h-6 text-blue-400" />}
                title="Multi-Floor Vertical Stacking"
                description="Parametric floor levels with elevation control. View individual floors, exterior envelopes, or entire multi-storey compounds."
                tag="BIM STACKING"
              />
              <BentoCard
                icon={<Calculator className="w-6 h-6 text-emerald-400" />}
                title="Formulaic BOQ Estimation"
                description="Instantaneous Bill of Quantities broken down by substructure, masonry, joinery, and finishes with editable rate overrides."
                tag="COST ENGINE"
              />
              <BentoCard
                icon={<Cpu className="w-6 h-6 text-purple-400" />}
                title="Strict AI Safety Validation"
                description="Natural language instructions pass through strict collision and polygon validation pipelines to protect geometric truth."
                tag="AGENT CO-PILOT"
              />
              <BentoCard
                icon={<Sun className="w-6 h-6 text-amber-400" />}
                title="Solar & Climate Trajectory"
                description="Analyze daylight angles across morning, afternoon, and evening to maximize natural lighting and passive thermal comfort."
                tag="PASSIVE SOLAR"
              />
              <BentoCard
                icon={<Leaf className="w-6 h-6 text-teal-400" />}
                title="Embodied Carbon Scorecards"
                description="Evaluate material life-cycle carbon footprints and glazing ratios to target green building compliance from day one."
                tag="GREEN ARCHITECTURE"
              />
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
          <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              Ready to construct your vision?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8 text-base">
              Start designing your site plan, exploring in photorealistic 3D, and calculating accurate construction budgets today.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-sky-500/30 transition-all hover:scale-105"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Futuristic Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800/80 z-10 text-xs">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-sky-500 flex items-center justify-center text-white font-extrabold text-xs">
              AI
            </div>
            <span className="font-bold text-white tracking-wider">AI CIVIL AGENT</span>
            <span className="text-slate-600 font-mono">• v2.0 Production Release</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px] text-slate-500">
            <span>REACT 19</span>
            <span>THREE.JS WEBGL</span>
            <span>NEXT.JS APP ROUTER</span>
            <span>SUPABASE RLS</span>
          </div>

          <p className="text-slate-600">
            © {new Date().getFullYear()} AI Civil Agent. Precision Architectural Engineering.
          </p>
        </div>
      </footer>
    </div>
  );
}

function MetricTicker({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-left backdrop-blur-sm">
      <span className="text-[10px] text-slate-500 font-mono uppercase block">{label}</span>
      <span className="text-xs font-semibold text-slate-200 font-mono truncate block">{value}</span>
    </div>
  );
}

function BentoCard({ 
  icon, 
  title, 
  description, 
  tag 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  tag: string; 
}) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 p-6 rounded-2xl transition-all hover:shadow-xl hover:shadow-sky-500/5 group flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/40">
            {tag}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">{title}</h3>
        <p className="text-slate-400 text-xs leading-relaxed font-light">{description}</p>
      </div>
    </div>
  );
}
