"use client";

import { ProjectState } from "@/models/project";
import { usePlannerStore } from "@/store/plannerStore";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, RefreshCw, FileText, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { updateProjectAction } from "@/app/dashboard/actions";

export default function CostDashboard({ projectId, projectName, projectState }: { projectId: string; projectName: string; projectState: ProjectState }) {
  const initProject = usePlannerStore(state => state.initProject);
  const generateCostEstimate = usePlannerStore(state => state.generateCostEstimate);
  const costEstimate = usePlannerStore(state => state.costEstimate);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterCat, setFilterCat] = useState<string>('All');
  const [overrides, setOverrides] = useState<Record<string, { material?: number; labour?: number }>>({});
  const [editingItem, setEditingItem] = useState<string | null>(null);

  useEffect(() => {
    initProject(projectState.floors || [], projectState.site, projectState.exterior);
    
    if (projectState.costEstimate) {
      usePlannerStore.setState({ costEstimate: projectState.costEstimate });
    } else {
      handleGenerate();
    }
  }, []);

  const handleSave = async () => {
    if (!costEstimate) return;
    try {
      await updateProjectAction(projectId, { costEstimate });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await generateCostEstimate(overrides);
    setIsGenerating(false);
  };

  useEffect(() => {
    if (costEstimate && !isGenerating) {
      handleSave();
    }
  }, [costEstimate]);

  const handleExportCSV = () => {
    if (!costEstimate) return;
    
    const headers = ['Item', 'Description', 'Category', 'Unit', 'Net Qty', 'Wastage %', 'Gross Qty', 'Mat Rate', 'Lab Rate', 'Mat Amount', 'Lab Amount', 'Total', 'Confidence'];
    const rows = costEstimate.lineItems.map(item => [
      item.id.split('-')[0],
      `"${item.description}"`,
      item.category,
      item.unit,
      item.netQuantity.toFixed(2),
      item.wastageFactor.toFixed(1),
      item.quantity.toFixed(2),
      item.materialRate.toFixed(2),
      item.labourRate.toFixed(2),
      item.materialAmount.toFixed(2),
      item.labourAmount.toFixed(2),
      item.totalAmount.toFixed(2),
      item.confidence
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${projectName.replace(/\s+/g, '_')}_BOQ.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!costEstimate) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#faf8f5] font-sans h-screen">
        <RefreshCw className="w-8 h-8 text-[#1b3a2b] animate-spin mb-4" />
        <p className="text-[#57534e] font-medium">Analyzing geometry & calculating deterministic BOQ...</p>
      </div>
    );
  }

  const budget = projectState.budget?.constructionBudget || 0;
  const difference = costEstimate.grandTotal - budget;
  const isOver = difference > 0;

  const filteredItems = filterCat === 'All' 
    ? costEstimate.lineItems 
    : costEstimate.lineItems.filter(i => i.category === filterCat);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#faf8f5] font-sans">
      {/* Header */}
      <header className="h-16 bg-white/90 backdrop-blur-md border-b border-[#e7e5df] flex items-center justify-between px-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/projects/${projectId}`} className="p-2 hover:bg-[#faf8f5] rounded-full transition-colors text-[#78716c] hover:text-[#1c1917]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-lg text-[#1c1917] flex items-center gap-2.5 font-normal">
              {projectName} 
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 bg-[#1b3a2b]/10 text-[#1b3a2b] rounded-full font-semibold border border-[#1b3a2b]/20">Cost Estimate</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold text-[#1c1917] bg-white border border-[#d6d3cc] rounded-full hover:bg-[#faf8f5] transition-colors disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            Recalculate
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2 text-xs font-mono uppercase tracking-wider font-semibold text-white bg-[#1b3a2b] rounded-full hover:bg-[#14281d] transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export BOQ
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Disclaimer */}
          <div className="bg-[#f5f3ec] border border-[#e7e5df] rounded-2xl p-4 flex gap-3 text-[#1c1917] text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 text-[#1b3a2b]" />
            <p className="font-light leading-relaxed">
              <strong>PRELIMINARY ESTIMATE:</strong> AI Civil Agent provides planning estimates based on geometry, selected materials, and stated assumptions. Quantities, structural requirements, and local regulations must be verified by qualified professionals before construction.
            </p>
          </div>

          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-[#e7e5df] shadow-sm">
              <p className="text-xs font-mono uppercase tracking-widest text-[#78716c] mb-1">Estimated Cost</p>
              <p className="text-3xl font-serif text-[#1c1917]">{formatCurrency(costEstimate.grandTotal, costEstimate.currency)}</p>
              <div className="mt-2 text-xs text-[#a8a29e]">Includes {costEstimate.assumptions.contingencyPercentage}% contingency</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-[#e7e5df] shadow-sm">
              <p className="text-xs font-mono uppercase tracking-widest text-[#78716c] mb-1">Target Budget</p>
              <p className="text-3xl font-serif text-[#1c1917]">{formatCurrency(budget, costEstimate.currency)}</p>
              <div className="mt-2 text-xs text-[#a8a29e]">From project requirements</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-[#e7e5df] shadow-sm">
              <p className="text-xs font-mono uppercase tracking-widest text-[#78716c] mb-1">Difference</p>
              <p className={`text-3xl font-serif ${isOver ? 'text-rose-700' : 'text-emerald-700'}`}>
                {isOver ? '+' : ''}{formatCurrency(difference, costEstimate.currency)}
              </p>
              <div className={`mt-2 text-xs font-medium ${isOver ? 'text-rose-600' : 'text-emerald-700'}`}>
                {isOver ? 'Over budget' : 'Under budget'} ({(Math.abs(difference) / (budget || 1) * 100).toFixed(1)}%)
              </div>
            </div>
          </div>

          {/* Breakdown & Assumptions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Category Breakdown */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-[#e7e5df] shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#f0ede6] flex items-center justify-between">
                <h2 className="font-serif text-base text-[#1c1917] flex items-center gap-2 font-normal">
                  <FileText className="w-4 h-4 text-[#1b3a2b]" />
                  Preliminary Bill of Quantities (BOQ)
                </h2>
                <select 
                  value={filterCat} 
                  onChange={e => setFilterCat(e.target.value)}
                  className="text-xs font-mono border border-[#d6d3cc] rounded-full px-3 py-1.5 focus:border-[#1b3a2b] bg-[#faf8f5] text-[#1c1917]"
                >
                  <option value="All">All Categories</option>
                  {Array.from(new Set(costEstimate.lineItems.map(i => i.category))).map(cat => (
                    <option key={cat} value={cat} className="capitalize">{cat}</option>
                  ))}
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#faf8f5] border-b border-[#e7e5df] text-[#78716c] font-mono uppercase text-[10px] tracking-wider">
                      <th className="p-3.5">Description</th>
                      <th className="p-3.5 text-right">Qty</th>
                      <th className="p-3.5 text-right">Mat Rate</th>
                      <th className="p-3.5 text-right">Lab Rate</th>
                      <th className="p-3.5 text-right">Total</th>
                      <th className="p-3.5 text-center">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ede6]">
                    {filteredItems.map(item => (
                      <tr key={item.id} className="hover:bg-[#faf8f5]/80 transition-colors">
                        <td className="p-3.5">
                          <div className="font-medium text-[#1c1917]">{item.description}</div>
                          <div className="text-[10px] font-mono text-[#a8a29e] capitalize">{item.category}</div>
                        </td>
                        <td className="p-3.5 text-right font-mono">
                          {item.quantity.toFixed(1)} <span className="text-[#a8a29e]">{item.unit}</span>
                          {item.wastageFactor > 0 && <div className="text-[10px] text-amber-700">+{item.wastageFactor.toFixed(0)}% waste</div>}
                        </td>
                        
                        {editingItem === item.id ? (
                          <>
                            <td className="p-3.5 text-right">
                              <input 
                                type="number" 
                                className="w-20 p-1 text-right text-xs border border-[#d6d3cc] rounded"
                                defaultValue={overrides[item.id]?.material ?? item.materialRate}
                                onChange={e => setOverrides(prev => ({ ...prev, [item.id]: { ...prev[item.id], material: parseFloat(e.target.value) || 0 } }))}
                              />
                            </td>
                            <td className="p-3.5 text-right">
                              <input 
                                type="number" 
                                className="w-20 p-1 text-right text-xs border border-[#d6d3cc] rounded"
                                defaultValue={overrides[item.id]?.labour ?? item.labourRate}
                                onChange={e => setOverrides(prev => ({ ...prev, [item.id]: { ...prev[item.id], labour: parseFloat(e.target.value) || 0 } }))}
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-3.5 text-right text-[#57534e] font-mono cursor-pointer hover:bg-[#f5f3ec] rounded" onClick={() => setEditingItem(item.id)}>
                              {item.materialRate > 0 ? formatCurrency(item.materialRate) : '-'}
                              {overrides[item.id]?.material !== undefined && <span className="text-[10px] text-emerald-700 block">Overridden</span>}
                            </td>
                            <td className="p-3.5 text-right text-[#57534e] font-mono cursor-pointer hover:bg-[#f5f3ec] rounded" onClick={() => setEditingItem(item.id)}>
                              {item.labourRate > 0 ? formatCurrency(item.labourRate) : '-'}
                              {overrides[item.id]?.labour !== undefined && <span className="text-[10px] text-emerald-700 block">Overridden</span>}
                            </td>
                          </>
                        )}
                        
                        <td className="p-3.5 text-right font-mono font-semibold text-[#1c1917]">
                          {formatCurrency(item.totalAmount)}
                        </td>
                        <td className="p-3.5 text-center">
                          {editingItem === item.id ? (
                            <button onClick={() => { setEditingItem(null); handleGenerate(); }} className="text-xs bg-[#1b3a2b] text-white px-2.5 py-1 rounded-full font-mono">Save</button>
                          ) : (
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                              item.confidence === 'high' ? 'bg-emerald-600' :
                              item.confidence === 'medium' ? 'bg-amber-500' :
                              item.confidence === 'low' ? 'bg-orange-500' : 'bg-rose-500'
                            }`} title={`Confidence: ${item.confidence}`} />
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredItems.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-[#78716c]">
                          No items found for this category.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assumptions Panel */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-[#e7e5df] shadow-sm">
                <h3 className="font-serif text-base text-[#1c1917] mb-4 font-normal">Cost Assumptions</h3>
                <ul className="space-y-3 text-xs">
                  <li className="flex justify-between border-b border-[#f0ede6] pb-2 font-mono">
                    <span className="text-[#78716c]">Pricing Source</span>
                    <span className="font-medium text-[#1c1917] text-right">{costEstimate.assumptions.pricingSource}</span>
                  </li>
                  <li className="flex justify-between border-b border-[#f0ede6] pb-2 font-mono">
                    <span className="text-[#78716c]">Rate Date</span>
                    <span className="font-medium text-[#1c1917] text-right">{new Date(costEstimate.assumptions.rateDate).toLocaleDateString()}</span>
                  </li>
                  <li className="flex justify-between border-b border-[#f0ede6] pb-2 font-mono">
                    <span className="text-[#78716c]">Regional Factor</span>
                    <span className="font-medium text-[#1c1917] text-right">{costEstimate.assumptions.regionalFactor}x</span>
                  </li>
                  <li className="flex justify-between border-b border-[#f0ede6] pb-2 font-mono">
                    <span className="text-[#78716c]">Contingency</span>
                    <span className="font-medium text-[#1c1917] text-right">{costEstimate.assumptions.contingencyPercentage}%</span>
                  </li>
                  <li className="flex justify-between pb-2 font-mono">
                    <span className="text-[#78716c]">Labour</span>
                    <span className="font-medium text-[#1c1917] text-right">{costEstimate.assumptions.labourAssumptions}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#14281d] p-6 rounded-3xl text-white shadow-sm">
                <h3 className="font-serif text-base mb-2 font-normal">Higher Precision Takeoff</h3>
                <p className="text-xs text-white/80 mb-5 leading-relaxed font-light">
                  Add more materials in the 3D Planner, or input custom contractor rates to override default approximations.
                </p>
                <Link href={`/dashboard/projects/${projectId}/3d`} className="block text-center w-full bg-white hover:bg-[#faf8f5] text-[#14281d] font-semibold py-2.5 rounded-full transition-colors text-xs font-mono uppercase tracking-wider shadow-sm">
                  Return to 3D Editor
                </Link>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
