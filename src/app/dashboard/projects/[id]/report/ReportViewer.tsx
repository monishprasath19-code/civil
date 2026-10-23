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
    return <div className="text-center p-12 text-[#78716c] font-sans">Generating architectural report...</div>;
  }

  const { overview, site, requirements, floors, exterior, costSummary } = reportData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center print:hidden">
        <Link href={`/dashboard/projects/${projectState.id}`} className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#78716c] hover:text-[#1c1917] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Project Hub
        </Link>
        <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 bg-[#1b3a2b] text-white rounded-full hover:bg-[#14281d] font-semibold text-xs font-mono uppercase tracking-wider transition-all shadow-sm">
          <Printer className="w-4 h-4" /> Print Dossier (PDF)
        </button>
      </div>

      <div className="bg-white p-12 shadow-sm border border-[#e7e5df] rounded-3xl print:shadow-none print:border-none print:p-0">
        {/* Header */}
        <div className="border-b-2 border-[#1b3a2b] pb-8 mb-8 text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#1b3a2b] block mb-1 font-semibold">
            MAISON & CIVIL ARCHITECTURAL DOSSIER
          </span>
          <h1 className="text-3xl font-serif text-[#1c1917] tracking-tight font-normal">Architectural Specification</h1>
          <h2 className="text-xl font-serif text-[#57534e] mt-1 font-normal">{overview.name}</h2>
          <div className="flex justify-center gap-6 mt-4 text-xs font-mono text-[#78716c]">
            <span>Date: {new Date(overview.date).toLocaleDateString()}</span>
            <span>•</span>
            <span>ID: {projectState.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>

        <div className="space-y-12">
          {/* Executive Summary */}
          <section>
            <h3 className="text-base font-serif text-[#1c1917] border-b border-[#f0ede6] pb-2 mb-4 flex items-center gap-2 font-normal">
              <Building2 className="w-4 h-4 text-[#1b3a2b]" /> Executive Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e5df]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c]">Total Built-up</span>
                <p className="text-xl font-serif text-[#1c1917] mt-1">{overview.builtupArea.toFixed(1)} sqm</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e5df]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c]">Estimated Cost</span>
                <p className="text-xl font-serif text-[#1b3a2b] mt-1">{formatCurrency(costSummary.total)}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e5df]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c]">Total Floors</span>
                <p className="text-xl font-serif text-[#1c1917] mt-1">{floors.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e5df]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c]">Typology</span>
                <p className="text-xl font-serif text-[#1c1917] mt-1 capitalize">{requirements.type}</p>
              </div>
            </div>
          </section>

          {/* Site & Exterior */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-3xl bg-[#faf8f5] border border-[#e7e5df]">
              <h3 className="text-base font-serif text-[#1c1917] border-b border-[#e7e5df] pb-2 mb-4 flex items-center gap-2 font-normal">
                <MapPin className="w-4 h-4 text-[#1b3a2b]" /> Site Information
              </h3>
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#e7e5df]/60 font-mono"><dt className="text-[#78716c]">Dimensions</dt><dd className="font-semibold text-[#1c1917]">{site.plotWidth}m × {site.plotLength}m</dd></div>
                <div className="flex justify-between py-1 border-b border-[#e7e5df]/60 font-mono"><dt className="text-[#78716c]">Total Area</dt><dd className="font-semibold text-[#1c1917]">{site.plotArea} sqm</dd></div>
                <div className="flex justify-between py-1 border-b border-[#e7e5df]/60 font-mono"><dt className="text-[#78716c]">Orientation</dt><dd className="font-semibold text-[#1c1917] capitalize">{site.roadDirection || 'Not specified'}</dd></div>
                <div className="flex justify-between py-1 font-mono"><dt className="text-[#78716c]">Terrain</dt><dd className="font-semibold text-[#1c1917] capitalize">{site.terrain || 'Flat'}</dd></div>
              </dl>
            </div>
            
            <div className="p-6 rounded-3xl bg-[#faf8f5] border border-[#e7e5df]">
              <h3 className="text-base font-serif text-[#1c1917] border-b border-[#e7e5df] pb-2 mb-4 flex items-center gap-2 font-normal">
                <Settings2 className="w-4 h-4 text-[#1b3a2b]" /> Exterior Configuration
              </h3>
              {exterior ? (
                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#e7e5df]/60 font-mono"><dt className="text-[#78716c]">Roof Type</dt><dd className="font-semibold text-[#1c1917] capitalize">{exterior.roofType}</dd></div>
                  <div className="flex justify-between py-1 border-b border-[#e7e5df]/60 font-mono"><dt className="text-[#78716c]">Compound Wall</dt><dd className="font-semibold text-[#1c1917]">{exterior.compoundWall?.show ? 'Included' : 'None'}</dd></div>
                  <div className="flex justify-between py-1 border-b border-[#e7e5df]/60 font-mono"><dt className="text-[#78716c]">Parking Spaces</dt><dd className="font-semibold text-[#1c1917]">{exterior.parking?.spaces || 0}</dd></div>
                  <div className="flex justify-between py-1 font-mono"><dt className="text-[#78716c]">Landscaping</dt><dd className="font-semibold text-[#1c1917]">{exterior.trees?.length || 0} Trees</dd></div>
                </dl>
              ) : (
                <p className="text-xs text-[#78716c] italic">No exterior data configured.</p>
              )}
            </div>
          </section>

          {/* Floor Breakdown */}
          <section>
            <h3 className="text-base font-serif text-[#1c1917] border-b border-[#f0ede6] pb-2 mb-4 flex items-center gap-2 font-normal">
              <Layers className="w-4 h-4 text-[#1b3a2b]" /> Architectural Spatial Breakdown
            </h3>
            {floors.length === 0 ? (
              <p className="text-xs text-[#78716c] italic">No floors designed yet.</p>
            ) : (
              <div className="space-y-6">
                {floors.map((f: any, i: number) => (
                  <div key={i} className="bg-[#faf8f5] rounded-3xl p-6 border border-[#e7e5df] print:border-[#e7e5df] print:bg-transparent">
                    <h4 className="font-serif text-sm font-medium text-[#1c1917] mb-3">{f.name}</h4>
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-[#e7e5df] text-[#78716c] font-mono uppercase text-[10px] tracking-wider">
                          <th className="py-2.5">Room Name</th>
                          <th className="py-2.5 text-right">Area (sqm)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e7e5df]/60">
                        {f.rooms.map((r: any, ri: number) => (
                          <tr key={ri}>
                            <td className="py-2.5 text-[#1c1917]">{r.name}</td>
                            <td className="py-2.5 text-[#1c1917] text-right font-mono font-medium">{r.area.toFixed(1)}</td>
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
          <section className="bg-[#faf8f5] border border-[#e7e5df] p-6 rounded-3xl text-xs text-[#78716c] print:bg-transparent print:border-[#e7e5df]">
            <h4 className="font-mono uppercase text-[10px] tracking-widest text-[#1b3a2b] font-semibold mb-2">Professional Engineering Notice</h4>
            <p className="leading-relaxed font-light">
              Maison & Civil Architectural Agent provides preliminary design, visualization, quantity, and cost information based on project data and configured assumptions. 
              Final architectural, structural, electrical, plumbing, regulatory, and construction decisions must be reviewed and certified by licensed civil engineers and local statutory authorities.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
