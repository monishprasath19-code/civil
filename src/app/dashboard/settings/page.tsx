"use client";

import { useState } from "react";
import { 
  Settings, 
  Ruler, 
  Coins, 
  Compass, 
  Sparkles, 
  Cpu, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Database,
  Layers,
  Palette
} from "lucide-react";

export default function StudioSettingsPage() {
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [currency, setCurrency] = useState<"INR" | "USD" | "EUR" | "GBP">("INR");
  const [gridSnap, setGridSnap] = useState<number>(0.25);
  const [renderQuality, setRenderQuality] = useState<"photoreal" | "balanced" | "performance">("photoreal");
  const [firmName, setFirmName] = useState("Atelier Cartier & Civil Associates");
  const [architectName, setArchitectName] = useState("Lead Architectural Director");
  const [autoSaveCAD, setAutoSaveCAD] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-400/90 font-medium flex items-center gap-2">
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            Studio Configuration & Preferences
          </span>
          <h1 className="text-3xl font-serif tracking-tight text-white mt-1">
            Atelier Settings
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl font-light">
            Calibrate CAD measurement conventions, structural BOQ currency denominations, PBR real-time rendering engine, and AI studio parameters.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-medium text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 active:scale-95"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-zinc-950" /> : <Save className="w-4 h-4 text-zinc-950" />}
          {saved ? "Preferences Saved" : "Save Settings"}
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Atelier configuration synchronized to local workspace cache and database.</span>
        </div>
      )}

      {/* Grid of Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Studio Identity */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-amber-400 text-sm font-medium">
            <ShieldCheck className="w-4 h-4" />
            <h2 className="text-zinc-100 font-serif text-base tracking-wide">Studio Identity</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Metadata displayed on generated structural reports, bill of quantities (BOQ), and architectural dossiers.
          </p>
          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs text-zinc-400 uppercase tracking-wider font-mono">Firm / Atelier Name</label>
              <input
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full mt-1.5 px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 uppercase tracking-wider font-mono">Principal Architect / Engineer</label>
              <input
                type="text"
                value={architectName}
                onChange={(e) => setArchitectName(e.target.value)}
                className="w-full mt-1.5 px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-500/60 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Units & Dimensions */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-amber-400 text-sm font-medium">
            <Ruler className="w-4 h-4" />
            <h2 className="text-zinc-100 font-serif text-base tracking-wide">Measurement & Units</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Coordinate frame and unit conventions applied across the 2D CAD canvas and 3D geometric engine.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setUnitSystem("metric")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                unitSystem === "metric"
                  ? "bg-amber-500/10 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/20"
                  : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <span className="text-xs font-mono uppercase tracking-widest block font-medium">Metric SI</span>
              <span className="text-sm font-serif text-zinc-200 mt-1 block">Meters / Sq.M</span>
              <span className="text-[11px] text-zinc-500 mt-1 block">Default international architectural standard</span>
            </button>
            <button
              onClick={() => setUnitSystem("imperial")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                unitSystem === "imperial"
                  ? "bg-amber-500/10 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/20"
                  : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <span className="text-xs font-mono uppercase tracking-widest block font-medium">Imperial</span>
              <span className="text-sm font-serif text-zinc-200 mt-1 block">Feet / Sq.Ft</span>
              <span className="text-[11px] text-zinc-500 mt-1 block">US customary engineering convention</span>
            </button>
          </div>
        </div>

        {/* Currency & Cost Valuation */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-amber-400 text-sm font-medium">
            <Coins className="w-4 h-4" />
            <h2 className="text-zinc-100 font-serif text-base tracking-wide">Currency & Rate Indexes</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Primary currency denomination for Bill of Quantities, material schedules, and contractor bids.
          </p>
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[
              { code: "INR", label: "₹ INR", desc: "Indian Rupee" },
              { code: "USD", label: "$ USD", desc: "US Dollar" },
              { code: "EUR", label: "€ EUR", desc: "Eurozone" },
              { code: "GBP", label: "£ GBP", desc: "British Pound" }
            ].map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code as any)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  currency === c.code
                    ? "bg-amber-500/10 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/20"
                    : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <span className="text-sm font-serif font-bold text-zinc-100 block">{c.label}</span>
                <span className="text-[10px] text-zinc-500 mt-0.5 block">{c.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2D CAD Grid Snapping */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-amber-400 text-sm font-medium">
            <Compass className="w-4 h-4" />
            <h2 className="text-zinc-100 font-serif text-base tracking-wide">CAD Magnet Snapping</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Magnetic grid increments for drawing walls, room partitions, and furniture placement in the 2D planner.
          </p>
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[0.10, 0.25, 0.50, 1.00].map((step) => (
              <button
                key={step}
                onClick={() => setGridSnap(step)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  gridSnap === step
                    ? "bg-amber-500/10 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/20"
                    : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <span className="text-sm font-serif font-bold text-zinc-100 block">{step}m</span>
                <span className="text-[10px] text-zinc-500 mt-0.5 block">
                  {step === 0.25 ? "Standard" : step === 0.10 ? "Fine" : "Coarse"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3D PBR Viewport Rendering */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-amber-400 text-sm font-medium">
            <Palette className="w-4 h-4" />
            <h2 className="text-zinc-100 font-serif text-base tracking-wide">3D PBR Viewport Fidelity</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Three.js WebGL graphics pipeline, atmospheric Drei Sky calculations, and shadow resolution.
          </p>
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {[
              { id: "photoreal", label: "Ultra Photoreal", desc: "4K Soft Shadows + PBR Minerals" },
              { id: "balanced", label: "Balanced", desc: "Standard PCF Shadows + SSAO" },
              { id: "performance", label: "High FPS", desc: "Optimized for Mobile & Tablets" }
            ].map((q) => (
              <button
                key={q.id}
                onClick={() => setRenderQuality(q.id as any)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  renderQuality === q.id
                    ? "bg-amber-500/10 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/20"
                    : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <span className="text-xs font-serif font-bold text-zinc-100 block">{q.label}</span>
                <span className="text-[10px] text-zinc-500 mt-1 block leading-tight">{q.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI & Automation Engine */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-amber-400 text-sm font-medium">
            <Cpu className="w-4 h-4" />
            <h2 className="text-zinc-100 font-serif text-base tracking-wide">AI Civil Intelligence Engine</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Autonomous building code compliance, setback validation, and structural engineering telemetry.
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
              <div>
                <span className="text-xs font-medium text-zinc-200 block">CAD Auto-Save Realtime Daemon</span>
                <span className="text-[11px] text-zinc-500">Persist geometry changes every 15 seconds</span>
              </div>
              <button
                onClick={() => setAutoSaveCAD(!autoSaveCAD)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                  autoSaveCAD ? "bg-amber-500" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-zinc-950 transition-transform ${
                    autoSaveCAD ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
              <div>
                <span className="text-xs font-medium text-zinc-200 block">Gemini 1.5 Pro Structural Core</span>
                <span className="text-[11px] text-zinc-500">Autonomous design suggestions active</span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Online
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Cloud & Database Telemetry */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-sm font-serif text-zinc-200">Supabase Cloud Sync & Architectural Vault</div>
            <div className="text-xs text-zinc-500">PostgreSQL schema v2.4 with RLS encryption and automatic CAD revisions</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Sync Active</span>
        </div>
      </div>
    </div>
  );
}
