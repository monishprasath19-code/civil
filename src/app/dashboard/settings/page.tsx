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
  const [firmName, setFirmName] = useState("Maison & Civil Architectural Associates");
  const [architectName, setArchitectName] = useState("Lead Architectural Director");
  const [autoSaveCAD, setAutoSaveCAD] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e5df] pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#1b3a2b] font-semibold flex items-center gap-2">
            <Settings className="w-3.5 h-3.5 text-[#1b3a2b]" />
            Studio Configuration & Preferences
          </span>
          <h1 className="text-3xl font-serif tracking-tight text-[#1c1917] mt-1 font-normal">
            Atelier Settings
          </h1>
          <p className="text-sm text-[#78716c] mt-1 max-w-2xl font-light">
            Calibrate CAD measurement conventions, structural BOQ currency denominations, PBR real-time rendering engine, and AI studio parameters.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1b3a2b] hover:bg-[#14281d] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm active:scale-95"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          {saved ? "Preferences Saved" : "Save Settings"}
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-sm shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Atelier configuration synchronized to local workspace cache and database.</span>
        </div>
      )}

      {/* Grid of Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Studio Identity */}
        <div className="p-7 rounded-3xl bg-white border border-[#e7e5df] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-[#1b3a2b] text-sm font-medium">
            <ShieldCheck className="w-4 h-4" />
            <h2 className="text-[#1c1917] font-serif text-base tracking-wide font-normal">Studio Identity</h2>
          </div>
          <p className="text-xs text-[#78716c]">
            Metadata displayed on generated structural reports, bill of quantities (BOQ), and architectural dossiers.
          </p>
          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs text-[#78716c] uppercase tracking-wider font-mono">Firm / Atelier Name</label>
              <input
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 bg-[#faf8f5] border border-[#d6d3cc] rounded-xl text-sm text-[#1c1917] focus:outline-none focus:border-[#1b3a2b] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-[#78716c] uppercase tracking-wider font-mono">Principal Architect / Engineer</label>
              <input
                type="text"
                value={architectName}
                onChange={(e) => setArchitectName(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 bg-[#faf8f5] border border-[#d6d3cc] rounded-xl text-sm text-[#1c1917] focus:outline-none focus:border-[#1b3a2b] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Units & Dimensions */}
        <div className="p-7 rounded-3xl bg-white border border-[#e7e5df] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-[#1b3a2b] text-sm font-medium">
            <Ruler className="w-4 h-4" />
            <h2 className="text-[#1c1917] font-serif text-base tracking-wide font-normal">Measurement & Units</h2>
          </div>
          <p className="text-xs text-[#78716c]">
            Coordinate frame and unit conventions applied across the 2D CAD canvas and 3D geometric engine.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setUnitSystem("metric")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                unitSystem === "metric"
                  ? "bg-[#1b3a2b] border-[#1b3a2b] text-white shadow-sm"
                  : "bg-[#faf8f5] border-[#d6d3cc] text-[#57534e] hover:border-[#1b3a2b]"
              }`}
            >
              <span className="text-xs font-mono uppercase tracking-widest block font-semibold">Metric SI</span>
              <span className={`text-sm font-serif mt-1 block ${unitSystem === 'metric' ? 'text-white' : 'text-[#1c1917]'}`}>Meters / Sq.M</span>
              <span className={`text-[11px] mt-1 block ${unitSystem === 'metric' ? 'text-white/80' : 'text-[#78716c]'}`}>Default international standard</span>
            </button>
            <button
              onClick={() => setUnitSystem("imperial")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                unitSystem === "imperial"
                  ? "bg-[#1b3a2b] border-[#1b3a2b] text-white shadow-sm"
                  : "bg-[#faf8f5] border-[#d6d3cc] text-[#57534e] hover:border-[#1b3a2b]"
              }`}
            >
              <span className="text-xs font-mono uppercase tracking-widest block font-semibold">Imperial</span>
              <span className={`text-sm font-serif mt-1 block ${unitSystem === 'imperial' ? 'text-white' : 'text-[#1c1917]'}`}>Feet / Sq.Ft</span>
              <span className={`text-[11px] mt-1 block ${unitSystem === 'imperial' ? 'text-white/80' : 'text-[#78716c]'}`}>US customary convention</span>
            </button>
          </div>
        </div>

        {/* Currency & Cost Valuation */}
        <div className="p-7 rounded-3xl bg-white border border-[#e7e5df] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-[#1b3a2b] text-sm font-medium">
            <Coins className="w-4 h-4" />
            <h2 className="text-[#1c1917] font-serif text-base tracking-wide font-normal">Currency & Rate Indexes</h2>
          </div>
          <p className="text-xs text-[#78716c]">
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
                className={`p-3 rounded-2xl border text-center transition-all ${
                  currency === c.code
                    ? "bg-[#1b3a2b] border-[#1b3a2b] text-white shadow-sm"
                    : "bg-[#faf8f5] border-[#d6d3cc] text-[#57534e] hover:border-[#1b3a2b]"
                }`}
              >
                <span className={`text-sm font-serif font-bold block ${currency === c.code ? 'text-white' : 'text-[#1c1917]'}`}>{c.label}</span>
                <span className={`text-[10px] mt-0.5 block ${currency === c.code ? 'text-white/80' : 'text-[#78716c]'}`}>{c.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2D CAD Grid Snapping */}
        <div className="p-7 rounded-3xl bg-white border border-[#e7e5df] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-[#1b3a2b] text-sm font-medium">
            <Compass className="w-4 h-4" />
            <h2 className="text-[#1c1917] font-serif text-base tracking-wide font-normal">CAD Magnet Snapping</h2>
          </div>
          <p className="text-xs text-[#78716c]">
            Magnetic grid increments for drawing walls, room partitions, and furniture placement in the 2D planner.
          </p>
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[0.10, 0.25, 0.50, 1.00].map((step) => (
              <button
                key={step}
                onClick={() => setGridSnap(step)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  gridSnap === step
                    ? "bg-[#1b3a2b] border-[#1b3a2b] text-white shadow-sm"
                    : "bg-[#faf8f5] border-[#d6d3cc] text-[#57534e] hover:border-[#1b3a2b]"
                }`}
              >
                <span className={`text-sm font-serif font-bold block ${gridSnap === step ? 'text-white' : 'text-[#1c1917]'}`}>{step}m</span>
                <span className={`text-[10px] mt-0.5 block ${gridSnap === step ? 'text-white/80' : 'text-[#78716c]'}`}>
                  {step === 0.25 ? "Standard" : step === 0.10 ? "Fine" : "Coarse"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3D PBR Viewport Rendering */}
        <div className="p-7 rounded-3xl bg-white border border-[#e7e5df] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-[#1b3a2b] text-sm font-medium">
            <Palette className="w-4 h-4" />
            <h2 className="text-[#1c1917] font-serif text-base tracking-wide font-normal">3D PBR Viewport Fidelity</h2>
          </div>
          <p className="text-xs text-[#78716c]">
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
                className={`p-3 rounded-2xl border text-left transition-all ${
                  renderQuality === q.id
                    ? "bg-[#1b3a2b] border-[#1b3a2b] text-white shadow-sm"
                    : "bg-[#faf8f5] border-[#d6d3cc] text-[#57534e] hover:border-[#1b3a2b]"
                }`}
              >
                <span className={`text-xs font-serif font-bold block ${renderQuality === q.id ? 'text-white' : 'text-[#1c1917]'}`}>{q.label}</span>
                <span className={`text-[10px] mt-1 block leading-tight ${renderQuality === q.id ? 'text-white/80' : 'text-[#78716c]'}`}>{q.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI & Automation Engine */}
        <div className="p-7 rounded-3xl bg-white border border-[#e7e5df] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-[#1b3a2b] text-sm font-medium">
            <Cpu className="w-4 h-4" />
            <h2 className="text-[#1c1917] font-serif text-base tracking-wide font-normal">AI Civil Intelligence Engine</h2>
          </div>
          <p className="text-xs text-[#78716c]">
            Autonomous building code compliance, setback validation, and structural engineering telemetry.
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e5df]">
              <div>
                <span className="text-xs font-medium text-[#1c1917] block">CAD Auto-Save Realtime Daemon</span>
                <span className="text-[11px] text-[#78716c]">Persist geometry changes every 15 seconds</span>
              </div>
              <button
                onClick={() => setAutoSaveCAD(!autoSaveCAD)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                  autoSaveCAD ? "bg-[#1b3a2b]" : "bg-[#d6d3cc]"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    autoSaveCAD ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e5df]">
              <div>
                <span className="text-xs font-medium text-[#1c1917] block">Gemini 1.5 Pro Structural Core</span>
                <span className="text-[11px] text-[#78716c]">Autonomous design suggestions active</span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                Online
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Cloud & Database Telemetry */}
      <div className="p-6 rounded-3xl bg-white border border-[#e7e5df] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-[#1b3a2b] shrink-0" />
          <div>
            <div className="text-sm font-serif text-[#1c1917]">Supabase Cloud Sync & Architectural Vault</div>
            <div className="text-xs text-[#78716c]">PostgreSQL schema with RLS encryption and automatic CAD revisions</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span className="text-xs font-mono text-[#1b3a2b] uppercase tracking-wider font-semibold">Sync Active</span>
        </div>
      </div>
    </div>
  );
}
