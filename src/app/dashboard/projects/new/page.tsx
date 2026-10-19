"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { createProjectAction } from "@/app/dashboard/actions";
import { SiteInfo, Budget, Requirements } from "@/models/project";

const steps = [
  { id: 'site', name: 'Site Information' },
  { id: 'budget', name: 'Budget' },
  { id: 'requirements', name: 'Requirements' },
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
  const [unit, setUnit] = useState<"feet" | "meters">("feet");
  const [roadDirection, setRoadDirection] = useState<"N" | "S" | "E" | "W">("N");
  const [floors, setFloors] = useState("1");

  // Budget
  const [totalBudget, setTotalBudget] = useState("");
  const [constructionBudget, setConstructionBudget] = useState("");
  const [interiorBudget, setInteriorBudget] = useState("");

  // Requirements
  const [bhkType, setBhkType] = useState<"1BHK" | "2BHK" | "3BHK" | "4BHK" | "Custom">("2BHK");
  
  const handleNext = () => {
    setError(null);
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      if (!projectName) {
        setError("Project name is required.");
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
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Project</h2>
        <p className="text-slate-500 text-sm">Enter the initial details to setup your workspace.</p>
      </div>

      {/* Progress */}
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
              <div className="flex items-center">
                <div 
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                    stepIdx < currentStep ? 'bg-blue-600' : stepIdx === currentStep ? 'border-2 border-blue-600 bg-white' : 'border-2 border-slate-300 bg-white'
                  }`}
                >
                  {stepIdx < currentStep ? (
                    <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  ) : (
                    <span className={stepIdx === currentStep ? 'text-blue-600' : 'text-slate-500'}>
                      {stepIdx + 1}
                    </span>
                  )}
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div className={`absolute top-4 w-full h-0.5 ${stepIdx < currentStep ? 'bg-blue-600' : 'bg-slate-300'}`} style={{ left: '2rem', right: '-2rem' }} />
                )}
              </div>
              <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium ${stepIdx <= currentStep ? 'text-blue-600' : 'text-slate-500'}`}>
                {step.name}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 bg-white shadow-sm rounded-xl border border-slate-200 p-6 sm:p-8">
        
        {/* Step 1: Site */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Project Name</label>
                <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g. Dream Villa" />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Location</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="City, State" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Plot Length</label>
                <input type="number" min="0" value={plotLength} onChange={e => setPlotLength(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Plot Width</label>
                <input type="number" min="0" value={plotWidth} onChange={e => setPlotWidth(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Measurement Unit</label>
                <select value={unit} onChange={e => setUnit(e.target.value as "feet" | "meters")} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option value="feet">Feet</option>
                  <option value="meters">Meters</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Calculated Area</label>
                <div className="mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-600">
                  {plotArea > 0 ? `${plotArea} sq ${unit}` : "0"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Road Direction</label>
                <select value={roadDirection} onChange={e => setRoadDirection(e.target.value as "N" | "S" | "E" | "W")} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option value="N">North</option>
                  <option value="E">East</option>
                  <option value="W">West</option>
                  <option value="S">South</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Number of Floors</label>
                <input type="number" min="1" value={floors} onChange={e => setFloors(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Budget */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Total Budget (Estimated)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 sm:text-sm">₹</span>
                  </div>
                  <input type="number" min="0" value={totalBudget} onChange={e => setTotalBudget(e.target.value)} className="block w-full pl-7 pr-12 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="0" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700">Construction Budget</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 sm:text-sm">₹</span>
                  </div>
                  <input type="number" min="0" value={constructionBudget} onChange={e => setConstructionBudget(e.target.value)} className="block w-full pl-7 pr-12 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="0" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Interior Budget</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 sm:text-sm">₹</span>
                  </div>
                  <input type="number" min="0" value={interiorBudget} onChange={e => setInteriorBudget(e.target.value)} className="block w-full pl-7 pr-12 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="0" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Requirements */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Requirement Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['1BHK', '2BHK', '3BHK', '4BHK', 'Custom'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBhkType(type)}
                    className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                      bhkType === type 
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-sm font-medium text-slate-900 mb-3">Room Checklist (Auto-filled by {bhkType})</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                {[
                  'Living Room', 'Dining', 'Kitchen', 'Bedrooms', 'Bathrooms', 
                  'Balcony', 'Utility', 'Pooja Room', 'Study', 'Store', 'Parking'
                ].map((room) => (
                  <div key={room} className="flex items-center">
                    <input id={room} type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" />
                    <label htmlFor={room} className="ml-2 block text-sm text-slate-700">{room}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0 || isPending}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
            currentStep === 0 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
          }`}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={isPending}
          className="flex items-center px-5 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {currentStep === steps.length - 1 ? (isPending ? 'Creating...' : 'Create Project') : 'Continue'}
          {currentStep !== steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
        </button>
      </div>
    </div>
  );
}
