"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Sparkles, 
  Upload, 
  Sliders, 
  Layers, 
  Palette, 
  Download, 
  RefreshCw, 
  Check, 
  Eye, 
  SplitSquareVertical, 
  Columns, 
  Wand2, 
  Box, 
  CheckCircle2, 
  ArrowRight, 
  Compass,
  Maximize2
} from "lucide-react";
import Link from "next/link";

export interface StylePreset {
  id: string;
  name: string;
  tagline: string;
  category: string;
  image: string;
  palette: string[];
  materials: string[];
}

const STYLE_PRESETS: StylePreset[] = [
  {
    id: "modern-luxury",
    name: "Modern Luxury",
    tagline: "Cartier Noir, Italian marble, warm brass & ambient cove lighting",
    category: "Luxury",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80",
    palette: ["#09090b", "#d4af37", "#f8fafc", "#475569"],
    materials: ["Carrara Marble", "Brushed Brass", "Velvet", "Smoked Glass"]
  },
  {
    id: "japandi-minimal",
    name: "Japandi Warm",
    tagline: "Organic minimalism, raw oak, textured bouclé & serene diffuse sun",
    category: "Minimal",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80",
    palette: ["#f5f5f0", "#d4a373", "#e6ccb2", "#7f5539"],
    materials: ["White Oak", "Textured Bouclé", "Limewash", "Wabi-Sabi Ceramics"]
  },
  {
    id: "scandinavian",
    name: "Scandinavian Pure",
    tagline: "Airy daylight, bleached timber, cozy wool textiles & clean lines",
    category: "Contemporary",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
    palette: ["#ffffff", "#e2e8f0", "#94a3b8", "#cbd5e1"],
    materials: ["Bleached Pine", "Chunky Knit Wool", "Matte Aluminium", "Cotton Linen"]
  },
  {
    id: "french-haussmann",
    name: "Parisian Haussmann",
    tagline: "Ornate wall boiserie, chevron parquet, antique bronze & crystal",
    category: "Classical",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=80",
    palette: ["#fafaf9", "#b45309", "#d97706", "#292524"],
    materials: ["Chevron Parquet", "Ornate Molding", "Antiqued Gilt", "Silk Velvet"]
  },
  {
    id: "industrial-loft",
    name: "Architectural Loft",
    tagline: "Exposed brick masonry, blackened steel, cognac leather & high ceilings",
    category: "Urban",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80",
    palette: ["#1c1917", "#78350f", "#57534e", "#a8a29e"],
    materials: ["Reclaimed Brick", "A36 Structural Steel", "Cognac Leather", "Fluted Glass"]
  },
  {
    id: "biophilic-sanctuary",
    name: "Biophilic Haven",
    tagline: "Travertine stone, indoor botanical gardens, raw teak & skylights",
    category: "Organic",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    palette: ["#2d6a4f", "#e9edc9", "#ccd5ae", "#d4a373"],
    materials: ["Travertine Stone", "Living Green Walls", "Teak Wood", "Linen Drapery"]
  }
];

export interface SampleRoom {
  id: string;
  name: string;
  type: string;
  beforeImage: string;
  afterImage: string;
  style: string;
  description: string;
}

const SAMPLE_ROOMS: SampleRoom[] = [
  {
    id: "living-penthouse",
    name: "Penthouse Grand Salon",
    type: "Living Room",
    beforeImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    style: "Modern Luxury",
    description: "Transformed an unfurnished white drywall shell into a warm Cartier-inspired luxury salon with marble fireplace and curved modular seating."
  },
  {
    id: "master-bedroom",
    name: "Primary Suite Retreat",
    type: "Master Bedroom",
    beforeImage: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    style: "Parisian Haussmann",
    description: "Reimagined a plain bedroom into a 5-star hotel suite with fluted acoustic panelling, brass bedside illumination, and custom linen runner."
  },
  {
    id: "chef-kitchen",
    name: "Culinary Island & Dining",
    type: "Kitchen & Dining",
    beforeImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    style: "Biophilic Luxury",
    description: "Converted standard builder-grade space into a monolithic waterfall Carrara marble island with integrated concealed induction cooktops."
  }
];

export default function DehomeInteriorStudio({ activeProjectId }: { activeProjectId?: string }) {
  // State
  const [selectedSample, setSelectedSample] = useState<SampleRoom>(SAMPLE_ROOMS[0]);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(STYLE_PRESETS[0]);
  const [roomType, setRoomType] = useState<string>("Living Room");
  const [designMode, setDesignMode] = useState<"redesign" | "staging" | "reskin" | "replace">("redesign");
  const [promptInput, setPromptInput] = useState<string>("Italian Carrara marble coffee table, curved cream bouclé sofa, warm concealed ceiling LED cove lighting");
  const [creativityStrength, setCreativityStrength] = useState<number>(75);
  const [colorTone, setColorTone] = useState<string>("Obsidian & Gold");
  
  // Viewer Controls
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100%
  const [viewMode, setViewMode] = useState<"slider" | "sideBySide" | "afterOnly" | "beforeOnly">("slider");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genProgress, setGenProgress] = useState<number>(0);
  const [genStage, setGenStage] = useState<string>("");

  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  // Slider Mouse/Touch Handlers
  const handleMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const onMouseDown = () => { isDragging.current = true; };
  const onMouseUp = () => { isDragging.current = false; };
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) handleMove(e.touches[0].clientX);
  };

  // Simulate AI Generation cycle
  const handleGenerate = () => {
    setIsGenerating(true);
    setGenProgress(10);
    setGenStage("Deconstructing room perspective & structural bounds...");

    const steps = [
      { p: 35, text: "Synthesizing architectural PBR materials & lighting..." },
      { p: 65, text: `Applying ${selectedStyle.name} luxury finishes & bespoke millwork...` },
      { p: 90, text: "Balancing ambient raymarched occlusion and reflections..." },
      { p: 100, text: "Rendering 4K photorealistic architectural concept complete!" }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setGenProgress(step.p);
        setGenStage(step.text);
        if (idx === steps.length - 1) {
          setTimeout(() => {
            setIsGenerating(false);
            setSliderPos(50);
          }, 600);
        }
      }, (idx + 1) * 700);
    });
  };

  return (
    <div className="space-y-10">
      
      {/* Studio Header Bar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800/80 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              Dehome AI Studio • Architectural Redesign Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
              AI Interior Design & Visual Staging
            </h1>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Transform raw floor plans, empty spatial shells, or existing room snapshots into award-winning photorealistic interiors in seconds. Drag the slider to inspect before-and-after transformations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {activeProjectId && (
              <Link
                href={`/dashboard/projects/${activeProjectId}/3d`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono uppercase tracking-wider transition-all"
              >
                <Box className="w-4 h-4 text-amber-400" />
                Open 3D Viewport
              </Link>
            )}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4 stroke-[2.5]" />
              {isGenerating ? "Synthesizing..." : "Generate AI Concept"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Before/After Visual Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Canvas Viewport Toolbar */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Live Inspection Viewport
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400 font-serif">{selectedSample.name}</span>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("slider")}
                className={`p-1.5 rounded-lg text-xs font-mono transition-colors ${
                  viewMode === "slider" ? "bg-amber-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
                title="Interactive Split Slider"
              >
                <SplitSquareVertical className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("sideBySide")}
                className={`p-1.5 rounded-lg text-xs font-mono transition-colors ${
                  viewMode === "sideBySide" ? "bg-amber-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
                title="Side by Side Inspection"
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("afterOnly")}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  viewMode === "afterOnly" ? "bg-amber-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                AI Render
              </button>
              <button
                onClick={() => setViewMode("beforeOnly")}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  viewMode === "beforeOnly" ? "bg-amber-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Raw Space
              </button>
            </div>
          </div>

          {/* Interactive Visual Container */}
          <div 
            ref={sliderContainerRef}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
            className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800/80 shadow-2xl select-none group"
          >
            {isGenerating && (
              <div className="absolute inset-0 z-40 bg-zinc-950/85 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
                  <Wand2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-serif text-white font-medium">Dehome Neural Generation</h3>
                  <p className="text-xs text-amber-400 font-mono mt-1">{genStage}</p>
                </div>
                {/* Progress Bar */}
                <div className="w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300 rounded-full"
                    style={{ width: `${genProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Split Slider View */}
            {viewMode === "slider" && (
              <>
                {/* After Image (Background: 100% width) */}
                <div className="absolute inset-0 w-full h-full">
                  <Image 
                    src={selectedSample.afterImage} 
                    alt="AI Generated Interior" 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-zinc-950/80 backdrop-blur border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-widest font-semibold">
                    AI Interior Concept
                  </div>
                </div>

                {/* Before Image (Clipped Left Layer) */}
                <div 
                  className="absolute inset-0 h-full overflow-hidden z-20"
                  style={{ width: `${sliderPos}%` }}
                >
                  <div className="relative w-full h-full min-w-full">
                    <Image 
                      src={selectedSample.beforeImage} 
                      alt="Raw Before Space" 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                    />
                  </div>
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-zinc-950/80 backdrop-blur border border-zinc-700 text-zinc-300 text-[10px] font-mono uppercase tracking-widest font-semibold">
                    Raw Space / Blueprint
                  </div>
                </div>

                {/* Interactive Drag Handle Divider */}
                <div 
                  className="absolute top-0 bottom-0 z-30 w-1 bg-amber-400 shadow-2xl cursor-ew-resize flex items-center justify-center -ml-[2px]"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="w-9 h-9 rounded-full bg-zinc-950 border-2 border-amber-400 shadow-xl flex items-center justify-center text-amber-400 hover:scale-110 active:scale-95 transition-transform">
                    <SplitSquareVertical className="w-4 h-4" />
                  </div>
                </div>
              </>
            )}

            {/* Side by Side View */}
            {viewMode === "sideBySide" && (
              <div className="grid grid-cols-2 h-full w-full">
                <div className="relative h-full border-r border-zinc-800">
                  <Image src={selectedSample.beforeImage} alt="Raw Space" fill className="object-cover" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-zinc-950/80 text-[10px] font-mono text-zinc-300">
                    Raw Space
                  </span>
                </div>
                <div className="relative h-full">
                  <Image src={selectedSample.afterImage} alt="AI Design" fill className="object-cover" />
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-zinc-950/80 text-[10px] font-mono text-amber-300 border border-amber-500/30">
                    AI Interior
                  </span>
                </div>
              </div>
            )}

            {/* After Only */}
            {viewMode === "afterOnly" && (
              <div className="relative w-full h-full">
                <Image src={selectedSample.afterImage} alt="AI Design" fill className="object-cover" />
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-zinc-950/80 text-[10px] font-mono text-amber-300 border border-amber-500/30">
                  4K AI Photoreal Render
                </span>
              </div>
            )}

            {/* Before Only */}
            {viewMode === "beforeOnly" && (
              <div className="relative w-full h-full">
                <Image src={selectedSample.beforeImage} alt="Raw Space" fill className="object-cover" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-zinc-950/80 text-[10px] font-mono text-zinc-300">
                  Original Space
                </span>
              </div>
            )}
          </div>

          {/* Sample Rooms Selector Bar */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 block">
              Curated Space Transformations
            </span>
            <div className="grid grid-cols-3 gap-3">
              {SAMPLE_ROOMS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    setSelectedSample(sample);
                    setRoomType(sample.type);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedSample.id === sample.id
                      ? "bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/20"
                      : "bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block font-semibold">
                    {sample.type}
                  </span>
                  <span className="text-xs font-serif text-white font-medium block truncate mt-0.5">
                    {sample.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dehome AI Design Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Operation Mode Tabs (Redesign / Staging / Reskin / Replace) */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400">
              <span className="text-amber-400 flex items-center gap-1.5 font-semibold">
                <Wand2 className="w-3.5 h-3.5" />
                Design Operation Mode
              </span>
              <span className="text-[10px] text-zinc-500">Step 1 of 4</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { id: "redesign", label: "Full Redesign", desc: "Complete aesthetic transformation" },
                { id: "staging", label: "Virtual Staging", desc: "Furnish empty drywall shell" },
                { id: "reskin", label: "Surface Reskin", desc: "Swap floors, walls & finishes" },
                { id: "replace", label: "Object Swap", desc: "Inpaint & replace furniture" }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setDesignMode(mode.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    designMode === mode.id
                      ? "bg-amber-500/10 border-amber-500/60 text-amber-300 ring-1 ring-amber-500/20"
                      : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-xs font-serif font-bold text-white block">{mode.label}</span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5 leading-tight">{mode.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Room Type Selector */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400">
              <span className="text-amber-400 flex items-center gap-1.5 font-semibold">
                <Layers className="w-3.5 h-3.5" />
                Target Space Typology
              </span>
              <span className="text-[10px] text-zinc-500">Step 2 of 4</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                "Living Room", "Master Bedroom", "Kitchen & Dining", 
                "Luxury Bathroom", "Executive Office", "Outdoor Terrace"
              ].map((t) => (
                <button
                  key={t}
                  onClick={() => setRoomType(t)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    roomType === t
                      ? "bg-amber-500/10 border-amber-500/60 text-amber-300 font-semibold"
                      : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-xs font-serif block truncate">{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Style Presets Grid (Modern Luxury, Japandi, Parisian, etc.) */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400">
              <span className="text-amber-400 flex items-center gap-1.5 font-semibold">
                <Palette className="w-3.5 h-3.5" />
                Architectural Style Preset
              </span>
              <span className="text-[10px] text-zinc-500">Step 3 of 4</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1 max-h-56 overflow-y-auto pr-1">
              {STYLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedStyle(preset)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedStyle.id === preset.id
                      ? "bg-amber-500/10 border-amber-500/60 text-amber-300 ring-1 ring-amber-500/20"
                      : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-serif font-bold text-white truncate">{preset.name}</span>
                    <div className="flex gap-1">
                      {preset.palette.slice(0, 3).map((c, i) => (
                        <div key={i} className="w-2.5 h-2.5 rounded-full border border-black/40" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400 block line-clamp-2 leading-tight">
                    {preset.tagline}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Granular Custom Prompt & Fine-Tuning */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400">
              <span className="text-amber-400 flex items-center gap-1.5 font-semibold">
                <Sliders className="w-3.5 h-3.5" />
                Fine-Tuning Prompts & Fidelity
              </span>
              <span className="text-[10px] text-zinc-500">Step 4 of 4</span>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Custom Architectural Directive
              </label>
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 transition-colors resize-none font-sans"
              />
            </div>

            {/* Prompt Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5">
              {[
                "Curved bouclé sofa with travertine table",
                "Warm 2700K recessed cove downlights",
                "Monolithic Carrara marble kitchen island",
                "Vertical fluted walnut feature wall"
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setPromptInput(chip)}
                  className="text-[9px] font-mono px-2 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
                >
                  + {chip}
                </button>
              ))}
            </div>

            {/* AI Creativity Slider */}
            <div className="pt-2">
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span>Preserve 100% Geometry</span>
                <span className="text-amber-400">{creativityStrength}% Creative Reimagining</span>
              </div>
              <input 
                type="range"
                min="20"
                max="100"
                value={creativityStrength}
                onChange={(e) => setCreativityStrength(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Primary Action Button */}
            <div className="pt-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4 stroke-[2.5]" />
                {isGenerating ? "Executing Neural Render..." : "Generate High-Fidelity Interior Concept"}
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
