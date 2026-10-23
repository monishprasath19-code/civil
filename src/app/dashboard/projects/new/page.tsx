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
    <div className="max-w-3xl mx-auto py-6 space-y-8 font-sans">
      {/* Header */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#1b3a2b] font-semibold flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-[#1b3a2b]" />
          Atelier Commissioning Intake
        </span>
        <h1 className="text-3xl font-serif tracking-tight text-[#1c1917] mt-1 font-normal">
          Commission Architectural Project
        </h1>
        <p className="text-sm text-[#78716c] font-light mt-1">
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
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-mono transition-all ${
                    stepIdx < currentStep 
                      ? 'bg-[#1b3a2b] text-white font-bold shadow-sm' 
                      : stepIdx === currentStep 
                        ? 'border-2 border-[#1b3a2b] bg-white text-[#1b3a2b] font-bold' 
                        : 'border border-[#d6d3cc] bg-[#faf8f5] text-[#a8a29e]'
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
                    className={`absolute top-4 w-full h-[2px] ${stepIdx < currentStep ? 'bg-[#1b3a2b]' : 'bg-[#e7e5df]'}`} 
                    style={{ left: '2.5rem', right: '-2.5rem' }} 
                  />
                )}
              </div>
              <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest whitespace-nowrap ${
                stepIdx <= currentStep ? 'text-[#1b3a2b] font-semibold' : 'text-[#a8a29e]'
              }`}>
                {step.name}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {/* Form Container */}
      <div className="mt-10 bg-white rounded-3xl border border-[#e7e5df] p-6 sm:p-8 shadow-sm">
        
        {/* Step 1: Site Geometry */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-1.5 font-medium">Project Title</label>
                <input 
                  type="text" 
                  value={projectName} 
                  onChange={e => setProjectName(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#d6d3cc] rounded-xl text-sm text-[#1c1917] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b3a2b] transition-colors" 
                  placeholder="e.g. Modern Cascading Villa / Alabaster Residence" 
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-1.5 font-medium">Geographic Location</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#d6d3cc] rounded-xl text-sm text-[#1c1917] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b3a2b] transition-colors" 
                  placeholder="e.g. Mumbai, Maharashtra" 
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-1.5 font-medium">Plot Length</label>
                <input 
                  type="number" 
                  min="0" 
                  value={plotLength} 
                  onChange={e => setPlotLength(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#d6d3cc] rounded-xl text-sm text-[#1c1917] focus:outline-none focus:border-[#1b3a2b] transition-colors" 
                  placeholder="15"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-1.5 font-medium">Plot Width</label>
                <input 
                  type="number" 
                  min="0" 
                  value={plotWidth} 
                  onChange={e => setPlotWidth(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#d6d3cc] rounded-xl text-sm text-[#1c1917] focus:outline-none focus:border-[#1b3a2b] transition-colors" 
                  placeholder="12"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-1.5 font-medium">Measurement Standard</label>
                <select 
                  value={unit} 
                  onChange={e => setUnit(e.target.value as "feet" | "meters")} 
                  className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#d6d3cc] rounded-xl text-sm text-[#1c1917] focus:outline-none focus:border-[#1b3a2b] transition-colors"
                >
                  <option value="meters">Meters (SI International)</option>
                  <option value="feet">Feet (Imperial Standard)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-1.5 font-medium">Computed Plot Surface</label>
                <div className="px-4 py-2.5 bg-[#f5f3ec] border border-[#e7e5df] rounded-xl text-sm font-mono text-[#1b3a2b] font-semibold">
                  {plotArea > 0 ? `${plotArea.toFixed(1)} sq.${unit}` : "0.0"}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-1.5 font-medium">Approach Road Cardinal</label>
                <select 
                  value={roadDirection} 
                  onChange={e => setRoadDirection(e.target.value as "N" | "S" | "E" | "W")} 
                  className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#d6d3cc] rounded-xl text-sm text-[#1c1917] focus:outline-none focus:border-[#1b3a2b] transition-colors"
                >
                  <option value="N">North (Ideal for diffuse lighting)</option>
                  <option value="E">East (Morning sun orientation)</option>
                  <option value="W">West (Sunset orientation)</option>
                  <option value="S">South (Maximum solar exposure)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-1.5 font-medium">Storey Levels</label>
                <input 
                  type="number" 
                  min="1" 
                  value={floors} 
                  onChange={e => setFloors(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#d6d3cc] rounded-xl text-sm text-[#1c1917] focus:outline-none focus:border-[#1b3a2b] transition-colors" 
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
                <label className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-1.5 font-medium">Total Estimated Capital (INR)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1b3a2b] font-mono text-sm font-semibold">₹</span>
                  <input 
                    type="number" 
                    min="0" 
                    value={totalBudget} 
                    onChange={e => setTotalBudget(e.target.value)} 
                    className="w-full pl-8 pr-4 py-2.5 bg-[#faf8f5] border border-[#d6d3cc] rounded-xl text-sm text-[#1c1917] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b3a2b] transition-colors font-mono" 
                    placeholder="5000000" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-1.5 font-medium">Core Civil Structure Sub-Budget</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#78716c] font-mono text-sm">₹</span>
                  <input 
                    type="number" 
                    min="0" 
                    value={constructionBudget} 
                    onChange={e => setConstructionBudget(e.target.value)} 
                    className="w-full pl-8 pr-4 py-2.5 bg-[#faf8f5] border border-[#d6d3cc] rounded-xl text-sm text-[#1c1917] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b3a2b] transition-colors font-mono" 
                    placeholder="3500000" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-1.5 font-medium">Interior Millwork Sub-Budget</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#78716c] font-mono text-sm">₹</span>
                  <input 
                    type="number" 
                    min="0" 
                    value={interiorBudget} 
                    onChange={e => setInteriorBudget(e.target.value)} 
                    className="w-full pl-8 pr-4 py-2.5 bg-[#faf8f5] border border-[#d6d3cc] rounded-xl text-sm text-[#1c1917] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b3a2b] transition-colors font-mono" 
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
              <label className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-2 font-medium">Architectural Typology</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {(['1BHK', '2BHK', '3BHK', '4BHK', 'Custom'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBhkType(type)}
                    className={`px-4 py-3 border rounded-2xl text-xs font-mono uppercase tracking-wider transition-all ${
                      bhkType === type 
                        ? 'bg-[#1b3a2b] border-[#1b3a2b] text-white font-bold shadow-sm' 
                        : 'bg-[#faf8f5] border-[#d6d3cc] text-[#57534e] hover:border-[#1b3a2b]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#f0ede6]">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#78716c] mb-3">
                Programmatic Spatial Scope ({bhkType})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'Living Salon', 'Dining Hall', 'Culinary Kitchen', 'Master Suite', 
                  'Guest Suites', 'Sanitary Ensuites', 'Panoramic Terrace', 'Service Balcony', 
                  'Private Library / Study', 'Pooja Sanctuary', 'Covered Portico'
                ].map((room) => (
                  <div key={room} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e5df]">
                    <input 
                      id={room} 
                      type="checkbox" 
                      defaultChecked 
                      className="h-4 w-4 accent-[#1b3a2b] rounded border-[#d6d3cc]" 
                    />
                    <label htmlFor={room} className="text-xs text-[#1c1917] font-medium">{room}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs">
          {error}
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex justify-between pt-2">
        <button
          onClick={handleBack}
          disabled={currentStep === 0 || isPending}
          className={`flex items-center gap-1.5 px-5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-full transition-all ${
            currentStep === 0 
              ? 'text-[#a8a29e] cursor-not-allowed opacity-50' 
              : 'text-[#1c1917] bg-white border border-[#d6d3cc] hover:bg-[#faf8f5]'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Step
        </button>
        <button
          onClick={handleNext}
          disabled={isPending}
          className="flex items-center gap-2 px-7 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold rounded-full text-white bg-[#1b3a2b] hover:bg-[#14281d] shadow-sm transition-all disabled:opacity-50"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {currentStep === steps.length - 1 ? (isPending ? 'Commencing Project...' : 'Launch Project Hub') : 'Proceed Next'}
          {currentStep !== steps.length - 1 && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
