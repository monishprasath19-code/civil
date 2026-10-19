"use client";

import { usePlannerStore, ToolType } from "@/store/plannerStore";
import { MousePointer2, Square, Spline, DoorOpen, LayoutGrid, Armchair, Ruler } from "lucide-react";

export default function LeftToolbar() {
  const activeTool = usePlannerStore(state => state.activeTool);
  const setTool = usePlannerStore(state => state.setTool);

  const tools: { id: ToolType; icon: React.ReactNode; label: string }[] = [
    { id: 'select', icon: <MousePointer2 className="w-5 h-5" />, label: 'Select' },
    { id: 'wall', icon: <Spline className="w-5 h-5" />, label: 'Wall' },
    { id: 'room', icon: <Square className="w-5 h-5" />, label: 'Room' },
    { id: 'door', icon: <DoorOpen className="w-5 h-5" />, label: 'Door' },
    { id: 'window', icon: <LayoutGrid className="w-5 h-5" />, label: 'Window' },
    { id: 'furniture', icon: <Armchair className="w-5 h-5" />, label: 'Furniture' },
    { id: 'dimension', icon: <Ruler className="w-5 h-5" />, label: 'Dimension' },
  ];

  return (
    <div className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-2 z-10 shadow-sm shrink-0">
      {tools.map(t => (
        <button
          key={t.id}
          onClick={() => setTool(t.id)}
          title={t.label}
          className={`p-3 rounded-xl transition-all ${
            activeTool === t.id 
              ? 'bg-blue-100 text-blue-700 shadow-inner' 
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
          }`}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}
