"use client";

import { ProjectState } from "@/models/project";
import { formatCurrency } from "@/utils/currency";
import { Printer, ArrowLeft, Building2, MapPin, Layers, Settings2, Calculator } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { aiTools } from "@/services/ai/tools";

export default function ReportViewer({ projectState }: { projectState: ProjectState }) {
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    aiTools.generateProjectReportData(projectState).then(setReportData);
  }, [projectState]);

  if (!reportData) {
    return <div className="text-center p-12 text-slate-500">Generating report...</div>;
  }

  const { overview, site, requirements, floors, exterior, costSummary } = reportData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <Link href={`/dashboard/projects/${projectState.id}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Back to Overview
        </Link>
        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
          <Printer className="w-4 h-4" /> Print PDF
        </button>
      </div>

      <div className="bg-white p-12 shadow-sm border border-slate-200 rounded-xl print:shadow-none print:border-none print:p-0">
        {/* Header */}
        <div className="border-b-2 border-slate-800 pb-8 mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">Project Report</h1>
          <h2 className="text-xl text-slate-600 mt-2">{overview.name}</h2>
          <div className="flex justify-center gap-4 mt-4 text-sm text-slate-500">
            <span>Date: {new Date(overview.date).toLocaleDateString()}</span>
            <span>ID: {projectState.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>

        <div className="space-y-12">
          {/* Executive Summary */}
          <section>
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" /> Executive Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Built-up</span>
                <p className="text-lg font-medium text-slate-900">{overview.builtupArea.toFixed(1)} sqm</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Estimated Cost</span>
                <p className="text-lg font-medium text-slate-900">{formatCurrency(costSummary.total)}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Floors</span>
                <p className="text-lg font-medium text-slate-900">{floors.length}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Project Type</span>
                <p className="text-lg font-medium text-slate-900 capitalize">{requirements.type}</p>
              </div>
            </div>
          </section>

          {/* Site & Exterior */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" /> Site Information
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500">Dimensions</dt><dd className="font-medium">{site.plotWidth}m × {site.plotLength}m</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Total Area</dt><dd className="font-medium">{site.plotArea} sqm</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Orientation</dt><dd className="font-medium capitalize">{site.roadDirection || 'Not specified'}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Terrain</dt><dd className="font-medium capitalize">{site.terrain || 'Flat'}</dd></div>
              </dl>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-blue-600" /> Exterior Configuration
              </h3>
              {exterior ? (
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-slate-500">Roof Type</dt><dd className="font-medium capitalize">{exterior.roofType}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">Compound Wall</dt><dd className="font-medium">{exterior.compoundWall?.show ? 'Included' : 'None'}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">Parking Spaces</dt><dd className="font-medium">{exterior.parking?.spaces || 0}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">Landscaping</dt><dd className="font-medium">{exterior.trees?.length || 0} Trees</dd></div>
                </dl>
              ) : (
                <p className="text-sm text-slate-500 italic">No exterior data configured.</p>
              )}
            </div>
          </section>

          {/* Floor Breakdown */}
          <section>
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" /> Architectural Breakdown
            </h3>
            {floors.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No floors designed yet.</p>
            ) : (
              <div className="space-y-6">
                {floors.map((f: any, i: number) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-100 print:border-slate-300 print:bg-transparent">
                    <h4 className="font-semibold text-slate-800 mb-3">{f.name}</h4>
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="py-2 font-medium">Room Name</th>
                          <th className="py-2 font-medium text-right">Area (sqm)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {f.rooms.map((r: any, ri: number) => (
                          <tr key={ri}>
                            <td className="py-2 text-slate-700">{r.name}</td>
                            <td className="py-2 text-slate-700 text-right">{r.area.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Disclaimer */}
          <section className="bg-slate-50 border border-slate-200 p-6 rounded-lg text-sm text-slate-600 print:bg-transparent print:border-slate-300">
            <h4 className="font-semibold text-slate-800 mb-2 uppercase text-xs tracking-wider">Professional Verification Notice</h4>
            <p>
              AI Civil Agent provides preliminary design, visualization, quantity, and cost information based on project data and configured assumptions. 
              Final architectural, structural, electrical, plumbing, regulatory, and construction decisions must be reviewed and approved by qualified professionals and applicable local authorities.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
