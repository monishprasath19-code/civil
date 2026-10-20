"use client";

import { useState } from 'react';
import { usePlannerStore } from '@/store/plannerStore';
import { UnifiedAction, AIUnifiedResponse } from '@/services/ai/schema';
import { validateUnifiedAction } from '@/services/ai/validator';
import { Bot, Send, X, Check, XCircle } from 'lucide-react';
import { ProjectState } from '@/models/project';

export default function AIChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string, payload?: any }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [pendingProject, setPendingProject] = useState<ProjectState | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  
  const floors = usePlannerStore(state => state.floors);
  const site = usePlannerStore(state => state.site);
  const exterior = usePlannerStore(state => state.exterior);
  const costEstimate = usePlannerStore(state => state.costEstimate);
  const activeFloorId = usePlannerStore(state => state.activeFloorId);
  const setFloors = usePlannerStore(state => state.setFloors);
  const updateProjectData = usePlannerStore(state => state.updateProjectData);
  const updateExterior = usePlannerStore(state => state.updateExterior);
  const generateCostEstimate = usePlannerStore(state => state.generateCostEstimate);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    setPendingProject(null);
    setPendingMessage(null);
    
    try {
      const activeFloor = floors.find(f => f.id === activeFloorId);

      // 1. Build hyper-compact context (Token optimization)
      const context = {
        site: site ? { area: site.plotArea, floors: site.numberOfFloors } : null,
        activeFloor: activeFloor ? {
          rooms: activeFloor.rooms.map(r => ({ id: r.id, name: r.name, mat: r.floorMaterialId })),
          furniture: activeFloor.furniture.map(f => ({ id: f.id, name: f.name, mat: f.materialId })),
        } : null,
        exterior: exterior ? {
          roof: exterior.roofType, roofMat: exterior.roofMaterialId, trees: exterior.trees.length
        } : null,
        cost: costEstimate ? {
          total: costEstimate.grandTotal,
          currency: costEstimate.currency
        } : null
      };

      // 2. Fetch from Unified API
      const res = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, context })
      });
      
      const data: AIUnifiedResponse = await res.json();
      
      if (data.needsClarification || !data.actions || data.actions.length === 0) {
        setMessages(prev => [...prev, { role: 'ai', content: data.message, payload: data.dataPayload }]);
      } else {
        // We have actions. Simulate them on the state.
        let tempProject: ProjectState = {
          id: 'temp', name: 'temp', userId: 'temp', createdAt: '', updatedAt: '',
          site: site!, budget: { totalBudget: 0, constructionBudget: 0, interiorBudget: 0, exteriorBudget: 0, furnitureBudget: 0 },
          requirements: { type: 'Custom', rooms: {} },
          floors: [...floors],
          exterior,
          materials: []
        };

        let isValid = true;
        let validationError = "";

        for (const action of data.actions) {
          const res = validateUnifiedAction(action, tempProject, activeFloorId || undefined);
          if (res.valid && res.updatedProject) {
            tempProject = res.updatedProject;
          } else {
            isValid = false;
            validationError = res.error || "Action invalid";
            break;
          }
        }

        if (isValid) {
          setPendingProject(tempProject);
          setPendingMessage(data.message);
        } else {
          setMessages(prev => [...prev, { role: 'ai', content: `Sorry, I couldn't do that. Error: ${validationError}` }]);
        }
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'ai', content: "Failed to reach AI service." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (pendingProject) {
      // Grouped undo implicitly handled by Zustand since we push the final floor/exterior state at once
      updateProjectData(pendingProject.floors, pendingProject.exterior);
      setMessages(prev => [...prev, { role: 'ai', content: pendingMessage || "Applied." }]);
      setPendingProject(null);
      setPendingMessage(null);
      
      // Auto-recalculate costs in background if geometry changed
      generateCostEstimate();
    }
  };

  const handleCancel = () => {
    setMessages(prev => [...prev, { role: 'ai', content: "Preview cancelled." }]);
    setPendingProject(null);
    setPendingMessage(null);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all z-40"
      >
        <Bot className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute bottom-24 right-6 w-96 max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 z-40 overflow-hidden">
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Civil Agent</h3>
                <p className="text-xs text-blue-100">Project Architect & Planner</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1.5 rounded-lg transition-colors text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.length === 0 && (
              <div className="text-center p-6 text-slate-500 bg-white rounded-xl border border-slate-100 shadow-sm mt-4">
                <Bot className="w-10 h-10 mx-auto mb-3 text-blue-300" />
                <p className="text-sm mb-4">I can help you design, estimate, and evaluate scenarios. How can I assist you today?</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {[
                    "Change living room flooring to marble",
                    "Add a bed to the bedroom",
                    "Move the sofa near the window",
                    "How much will my project cost?",
                    "Generate my BOQ",
                    "Optimize living room for natural daylight",
                    "Estimate embodied carbon footprint"
                  ].map(prompt => (
                    <button 
                      key={prompt}
                      onClick={() => {
                        setInput(prompt);
                        setTimeout(() => document.getElementById('ai-send-btn')?.click(), 50);
                      }}
                      className="text-[10px] bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 px-2.5 py-1.5 rounded-full transition-all border border-slate-200/80 hover:border-sky-300 font-medium"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white border-blue-600 rounded-tr-sm' 
                    : 'bg-white text-slate-700 border-slate-200 rounded-tl-sm'
                }`}>
                  {msg.content}
                  {msg.payload && msg.payload.cost && (
                    <div className="mt-2 p-2 bg-slate-50 rounded border text-xs">
                      <strong className="text-slate-800">Estimate Output:</strong> {msg.payload.cost}
                    </div>
                  )}
                  {msg.payload && msg.payload.materials && (
                    <div className="mt-2 space-y-1">
                      <strong className="text-xs text-slate-800 block">Found Materials:</strong>
                      {msg.payload.materials.map((m: any) => (
                        <div key={m.id} className="p-1.5 bg-slate-50 border rounded text-xs flex justify-between">
                          <span>{m.name}</span>
                          <span className="text-slate-500">₹{m.price}/{m.priceUnit}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {pendingProject && (
              <div className="flex justify-start">
                <div className="max-w-[85%] p-4 rounded-2xl text-sm shadow-md border bg-amber-50 text-amber-900 border-amber-200 rounded-tl-sm">
                  <p className="font-medium mb-3">{pendingMessage}</p>
                  <p className="text-xs text-amber-700/80 mb-4 pb-3 border-b border-amber-200/50">Preview is loaded. Review the 2D/3D workspace and apply if satisfied.</p>
                  <div className="flex gap-2">
                    <button onClick={handleApply} className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                      <Check className="w-4 h-4" /> Apply
                    </button>
                    <button onClick={handleCancel} className="flex-1 flex items-center justify-center gap-1 bg-white text-slate-700 py-2 rounded-lg font-medium border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                      <XCircle className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-500 p-3 rounded-2xl rounded-tl-sm text-sm shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                  </div>
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 pr-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all shadow-sm">
              <input 
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about design, costs, materials..."
                className="flex-1 bg-transparent border-none focus:outline-none p-2 text-sm text-slate-700 placeholder:text-slate-400"
                disabled={isLoading || !!pendingProject}
              />
              <button 
                id="ai-send-btn"
                onClick={handleSend}
                disabled={!input.trim() || isLoading || !!pendingProject}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
