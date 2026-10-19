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

  // Add auto-save when estimate is generated
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
      <div className="flex-1 flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Analyzing geometry & generating estimate...</p>
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
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/projects/${projectId}`} className="p-2 hover:bg-slate-100 rounded-md transition-colors text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-semibold text-slate-800 flex items-center gap-2">
              {projectName} 
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">Cost Estimate</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            Recalculate
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export BOQ
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p>
              <strong>PRELIMINARY ESTIMATE:</strong> AI Civil Agent provides planning estimates based on geometry, selected materials, and stated assumptions. Quantities, structural requirements, and local regulations must be verified by qualified professionals before construction.
            </p>
          </div>

          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">Estimated Cost</p>
              <p className="text-3xl font-bold text-slate-800">{formatCurrency(costEstimate.grandTotal, costEstimate.currency)}</p>
              <div className="mt-2 text-xs text-slate-400">Includes {costEstimate.assumptions.contingencyPercentage}% contingency</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">Target Budget</p>
              <p className="text-3xl font-bold text-slate-800">{formatCurrency(budget, costEstimate.currency)}</p>
              <div className="mt-2 text-xs text-slate-400">From project requirements</div>
            </div>
            <div className={`bg-white p-5 rounded-xl border ${isOver ? 'border-red-200' : 'border-green-200'} shadow-sm`}>
              <p className="text-sm font-medium text-slate-500 mb-1">Difference</p>
              <p className={`text-3xl font-bold ${isOver ? 'text-red-600' : 'text-green-600'}`}>
                {isOver ? '+' : ''}{formatCurrency(difference, costEstimate.currency)}
              </p>
              <div className={`mt-2 text-xs font-medium ${isOver ? 'text-red-500' : 'text-green-500'}`}>
                {isOver ? 'Over budget' : 'Under budget'} ({(Math.abs(difference) / budget * 100).toFixed(1)}%)
              </div>
            </div>
          </div>

          {/* Breakdown & Assumptions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Category Breakdown */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  Preliminary Bill of Quantities (BOQ)
                </h2>
                <select 
                  value={filterCat} 
                  onChange={e => setFilterCat(e.target.value)}
                  className="text-sm border-slate-200 rounded-md focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="All">All Categories</option>
                  {Array.from(new Set(costEstimate.lineItems.map(i => i.category))).map(cat => (
                    <option key={cat} value={cat} className="capitalize">{cat}</option>
                  ))}
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Qty</th>
                      <th className="p-3 text-right">Mat Rate</th>
                      <th className="p-3 text-right">Lab Rate</th>
                      <th className="p-3 text-right">Total</th>
                      <th className="p-3 text-center">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map(item => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-3">
                          <div className="font-medium text-slate-800">{item.description}</div>
                          <div className="text-xs text-slate-400 capitalize">{item.category}</div>
                        </td>
                        <td className="p-3 text-right">
                          {item.quantity.toFixed(1)} <span className="text-slate-400">{item.unit}</span>
                          {item.wastageFactor > 0 && <div className="text-[10px] text-amber-600">+{item.wastageFactor.toFixed(0)}% waste</div>}
                        </td>
                        
                        {editingItem === item.id ? (
                          <>
                            <td className="p-3 text-right">
                              <input 
                                type="number" 
                                className="w-20 p-1 text-right text-xs border rounded"
                                defaultValue={overrides[item.id]?.material ?? item.materialRate}
                                onChange={e => setOverrides(prev => ({ ...prev, [item.id]: { ...prev[item.id], material: parseFloat(e.target.value) || 0 } }))}
                              />
                            </td>
                            <td className="p-3 text-right">
                              <input 
                                type="number" 
                                className="w-20 p-1 text-right text-xs border rounded"
                                defaultValue={overrides[item.id]?.labour ?? item.labourRate}
                                onChange={e => setOverrides(prev => ({ ...prev, [item.id]: { ...prev[item.id], labour: parseFloat(e.target.value) || 0 } }))}
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-3 text-right text-slate-600 cursor-pointer hover:bg-slate-100 rounded" onClick={() => setEditingItem(item.id)}>
                              {item.materialRate > 0 ? formatCurrency(item.materialRate) : '-'}
                              {overrides[item.id]?.material !== undefined && <span className="text-[10px] text-blue-500 block">Overridden</span>}
                            </td>
                            <td className="p-3 text-right text-slate-600 cursor-pointer hover:bg-slate-100 rounded" onClick={() => setEditingItem(item.id)}>
                              {item.labourRate > 0 ? formatCurrency(item.labourRate) : '-'}
                              {overrides[item.id]?.labour !== undefined && <span className="text-[10px] text-blue-500 block">Overridden</span>}
                            </td>
                          </>
                        )}
                        
                        <td className="p-3 text-right font-medium text-slate-700">
                          {formatCurrency(item.totalAmount)}
                        </td>
                        <td className="p-3 text-center">
                          {editingItem === item.id ? (
                            <button onClick={() => { setEditingItem(null); handleGenerate(); }} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Save</button>
                          ) : (
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              item.confidence === 'high' ? 'bg-green-500' :
                              item.confidence === 'medium' ? 'bg-amber-400' :
                              item.confidence === 'low' ? 'bg-orange-500' : 'bg-red-500'
                            }`} title={`Confidence: ${item.confidence}`} />
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredItems.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
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
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4">Cost Assumptions</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Pricing Source</span>
                    <span className="font-medium text-slate-700 text-right">{costEstimate.assumptions.pricingSource}</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Rate Date</span>
                    <span className="font-medium text-slate-700 text-right">{new Date(costEstimate.assumptions.rateDate).toLocaleDateString()}</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Regional Factor</span>
                    <span className="font-medium text-slate-700 text-right">{costEstimate.assumptions.regionalFactor}x</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Contingency</span>
                    <span className="font-medium text-slate-700 text-right">{costEstimate.assumptions.contingencyPercentage}%</span>
                  </li>
                  <li className="flex justify-between pb-2">
                    <span className="text-slate-500">Labour</span>
                    <span className="font-medium text-slate-700 text-right">{costEstimate.assumptions.labourAssumptions}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-800 p-5 rounded-xl text-white shadow-sm">
                <h3 className="font-semibold mb-2">Want better accuracy?</h3>
                <p className="text-sm text-slate-300 mb-4">
                  Add more materials in the 3D Planner, or input custom contractor rates to override default approximations.
                </p>
                <Link href={`/dashboard/projects/${projectId}/3d`} className="block text-center w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors text-sm">
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
