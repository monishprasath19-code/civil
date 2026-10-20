"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ChevronLeft, Loader2, Sparkles, Compass } from "lucide-react";
import { createProjectAction } from "@/app/dashboard/actions";
import { SiteInfo, Budget, Requirements } from "@/models/project";

const steps = [
  { id: 'site', name: 'Site Geometry' },
  { id: 'budget', name: 'Budget Capital' },
  { id: 'requirements', name: 'Spatial Program' },
];

export default function NewProjectWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  // Site
  const [projectName, setProjectName] = useState("");
  const [location, setLocation] = useState("");
  const [plotLength, setPlotLength] = useState("");
  const [plotWidth, setPlotWidth] = useState("");
  const [unit, setUnit] = useState<"feet" | "meters">("meters");
  const [roadDirection, setRoadDirection] = useState<"N" | "S" | "E" | "W">("N");
  const [floors, setFloors] = useState("1");

  // Budget
  const [totalBudget, setTotalBudget] = useState("");
  const [constructionBudget, setConstructionBudget] = useState("");
  const [interiorBudget, setInteriorBudget] = useState("");

  // Requirements
  const [bhkType, setBhkType] = useState<"1BHK" | "2BHK" | "3BHK" | "4BHK" | "Custom">("3BHK");
  
  const handleNext = () => {
    setError(null);
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      if (!projectName) {
        setError("Project commission name is required.");
        return;
      }
      const plotArea = (parseFloat(plotLength) || 0) * (parseFloat(plotWidth) || 0);

      const siteData: SiteInfo = {
        projectName,
        location,
        plotLength: parseFloat(plotLength) || 0,
        plotWidth: parseFloat(plotWidth) || 0,
        plotArea,
        unit,
        roadDirection,
        northDirection: 0,
        numberOfFloors: parseInt(floors) || 1,
        terrain: 'flat',
        climate: 'tropical'
      };

      const budgetData: Budget = {
        totalBudget: parseFloat(totalBudget) || 0,
        constructionBudget: parseFloat(constructionBudget) || 0,
        interiorBudget: parseFloat(interiorBudget) || 0,
        exteriorBudget: 0,
        furnitureBudget: 0
      };

      const requirementsData: Requirements = {
        type: bhkType,
        rooms: {
          living: 1, dining: 1, kitchen: 1, bedroom: bhkType === '1BHK' ? 1 : 2, 
          masterBedroom: 1, bathroom: 2, balcony: 1, utility: 1, poojaRoom: 0, 
          study: 0, homeTheatre: 0, store: 0, parking: 1, garden: 0, terrace: 1
        }
      };

      startTransition(async () => {
        const { data, error } = await createProjectAction(projectName, siteData, budgetData, requirementsData);
        if (error) {
          setError(error);
        } else if (data) {
          router.push(`/dashboard/projects/${data.id}`);
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const plotArea = (parseFloat(plotLength) || 0) * (parseFloat(plotWidth) || 0);

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-400/90 font-medium flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          Atelier Commissioning Intake
        </span>
        <h1 className="text-3xl font-serif tracking-tight text-white mt-1">
          Commission Architectural Project
        </h1>
        <p className="text-sm text-zinc-400 font-light mt-1">
          Establish the foundational site dimensions, financial capital boundaries, and spatial typology.
        </p>
      </div>

      {/* Progress Steps */}
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-12 sm:pr-24' : ''}`}>
              <div className="flex items-center">
                <div 
                  className={`relative flex h-8 w-8 items-center justify-center rounded-xl text-xs font-mono transition-all ${
                    stepIdx < currentStep 
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20' 
                      : stepIdx === currentStep 
                        ? 'border border-amber-400 bg-amber-500/10 text-amber-300 font-bold' 
                        : 'border border-zinc-800 bg-zinc-900 text-zinc-500'
                  }`}
                >
                  {stepIdx < currentStep ? (
                    <Check className="h-4 w-4 stroke-[3]" aria-hidden="true" />
                  ) : (
                    <span>{stepIdx + 1}</span>
                  )}
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div 
                    className={`absolute top-4 w-full h-[2px] ${stepIdx < currentStep ? 'bg-amber-500/80' : 'bg-zinc-800'}`} 
                    style={{ left: '2.5rem', right: '-2.5rem' }} 
                  />
                )}
              </div>
              <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest whitespace-nowrap ${
                stepIdx <= currentStep ? 'text-amber-400' : 'text-zinc-600'
              }`}>
                {step.name}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {/* Form Container */}
      <div className="mt-10 bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800/80 p-6 sm:p-8 shadow-2xl">
        
        {/* Step 1: Site Geometry */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Project Title</label>
                <input 
                  type="text" 
                  value={projectName} 
                  onChange={e => setProjectName(e.target.value)} 
                  className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 transition-colors" 
                  placeholder="e.g. Maison de Verre / Obsidian Villa" 
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Geographic Location</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 transition-colors" 
                  placeholder="e.g. Mumbai, Maharashtra" 
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Plot Length</label>
                <input 
                  type="number" 
                  min="0" 
                  value={plotLength} 
                  onChange={e => setPlotLength(e.target.value)} 
                  className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-500/60 transition-colors" 
                  placeholder="15"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Plot Width</label>
                <input 
                  type="number" 
                  min="0" 
                  value={plotWidth} 
                  onChange={e => setPlotWidth(e.target.value)} 
                  className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-500/60 transition-colors" 
                  placeholder="12"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Measurement Standard</label>
                <select 
                  value={unit} 
                  onChange={e => setUnit(e.target.value as "feet" | "meters")} 
                  className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-500/60 transition-colors"
                >
                  <option value="meters">Meters (SI International)</option>
                  <option value="feet">Feet (Imperial Standard)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Computed Plot Surface</label>
                <div className="px-3.5 py-2.5 bg-zinc-950/40 border border-zinc-800/60 rounded-lg text-sm font-mono text-amber-400">
                  {plotArea > 0 ? `${plotArea.toFixed(1)} sq.${unit}` : "0.0"}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Approach Road Cardinal</label>
                <select 
                  value={roadDirection} 
                  onChange={e => setRoadDirection(e.target.value as "N" | "S" | "E" | "W")} 
                  className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-500/60 transition-colors"
                >
                  <option value="N">North (Ideal for diffuse lighting)</option>
                  <option value="E">East (Morning sun orientation)</option>
                  <option value="W">West (Sunset orientation)</option>
                  <option value="S">South (Maximum solar exposure)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Storey Levels</label>
                <input 
                  type="number" 
                  min="1" 
                  value={floors} 
                  onChange={e => setFloors(e.target.value)} 
                  className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-500/60 transition-colors" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Budget */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Total Estimated Capital (INR)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400 font-mono text-sm">₹</span>
                  <input 
                    type="number" 
                    min="0" 
                    value={totalBudget} 
                    onChange={e => setTotalBudget(e.target.value)} 
                    className="w-full pl-8 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 transition-colors font-mono" 
                    placeholder="5000000" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Core Civil Structure Sub-Budget</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 font-mono text-sm">₹</span>
                  <input 
                    type="number" 
                    min="0" 
                    value={constructionBudget} 
                    onChange={e => setConstructionBudget(e.target.value)} 
                    className="w-full pl-8 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 transition-colors font-mono" 
                    placeholder="3500000" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Interior Millwork Sub-Budget</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 font-mono text-sm">₹</span>
                  <input 
                    type="number" 
                    min="0" 
                    value={interiorBudget} 
                    onChange={e => setInteriorBudget(e.target.value)} 
                    className="w-full pl-8 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 transition-colors font-mono" 
                    placeholder="1500000" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Requirements */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Architectural Typology</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {(['1BHK', '2BHK', '3BHK', '4BHK', 'Custom'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBhkType(type)}
                    className={`px-4 py-3 border rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                      bhkType === type 
                        ? 'bg-amber-500/10 border-amber-500/60 text-amber-300 font-bold ring-1 ring-amber-500/20' 
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80">
              <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3">
                Programmatic Spatial Scope ({bhkType})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'Living Salon', 'Dining Hall', 'Culinary Kitchen', 'Master Suite', 
                  'Guest Suites', 'Sanitary Ensuites', 'Panoramic Terrace', 'Service Balcony', 
                  'Private Library / Study', 'Pooja Sanctuary', 'Covered Portico'
                ].map((room) => (
                  <div key={room} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950/40 border border-zinc-800/50">
                    <input 
                      id={room} 
                      type="checkbox" 
                      defaultChecked 
                      className="h-3.5 w-3.5 accent-amber-500 rounded bg-zinc-950 border-zinc-700" 
                    />
                    <label htmlFor={room} className="text-xs text-zinc-300">{room}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex justify-between pt-2">
        <button
          onClick={handleBack}
          disabled={currentStep === 0 || isPending}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all ${
            currentStep === 0 
              ? 'text-zinc-600 cursor-not-allowed opacity-50' 
              : 'text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Step
        </button>
        <button
          onClick={handleNext}
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold rounded-xl text-zinc-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {currentStep === steps.length - 1 ? (isPending ? 'Commencing Project...' : 'Launch Project Hub') : 'Proceed Next'}
          {currentStep !== steps.length - 1 && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
