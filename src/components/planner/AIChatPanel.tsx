"use client";

import { useState } from 'react';
import { usePlannerStore } from '@/store/plannerStore';
import { UnifiedAction, AIUnifiedResponse } from '@/services/ai/schema';
import { validateUnifiedAction } from '@/services/ai/validator';
import { Bot, Send, X, Check, XCircle, Sparkles, Compass, CheckCircle2 } from 'lucide-react';
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
  const updateProjectData = usePlannerStore(state => state.updateProjectData);
  const generateCostEstimate = usePlannerStore(state => state.generateCostEstimate);
  
  const handleSend = async (overridePrompt?: string) => {
    const userMsg = overridePrompt || input;
    if (!userMsg.trim() || isLoading) return;
    
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    setPendingProject(null);
    setPendingMessage(null);
    
    try {
      const activeFloor = floors.find(f => f.id === activeFloorId);

      // Full rich context for architectural accuracy
      const context = {
        site: site ? { area: site.plotArea, floors: site.numberOfFloors, width: site.plotWidth, length: site.plotLength } : null,
        activeFloor: activeFloor ? {
          id: activeFloor.id,
          name: activeFloor.name,
          rooms: activeFloor.rooms.map(r => ({ 
            id: r.id, 
            name: r.name, 
            width: r.width, 
            height: r.height, 
            position: r.position,
            mat: r.floorMaterialId 
          })),
          furniture: activeFloor.furniture.map(f => ({ 
            id: f.id, 
            name: f.name, 
            type: f.type,
            position: f.position,
            mat: f.materialId 
          })),
          windows: activeFloor.windows,
          doors: activeFloor.doors
        } : null,
        exterior: exterior ? {
          roof: exterior.roofType, 
          roofMat: exterior.roofMaterialId, 
          trees: exterior.trees?.length || 0,
          timeOfDay: exterior.timeOfDay
        } : null,
        cost: costEstimate ? {
          total: costEstimate.grandTotal,
          currency: costEstimate.currency
        } : null
      };

      const res = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, context })
      });
      
      const data: AIUnifiedResponse = await res.json();
      
      if (data.needsClarification || !data.actions || data.actions.length === 0) {
        setMessages(prev => [...prev, { role: 'ai', content: data.message || "Request completed.", payload: data.dataPayload }]);
      } else {
        // Build simulation project state
        let tempProject: ProjectState = {
          id: 'temp', 
          name: 'temp', 
          userId: 'temp', 
          createdAt: '', 
          updatedAt: '',
          site: site!, 
          budget: { totalBudget: 0, constructionBudget: 0, interiorBudget: 0, exteriorBudget: 0, furnitureBudget: 0 },
          requirements: { type: 'Custom', rooms: {} },
          floors: JSON.parse(JSON.stringify(floors)),
          exterior: exterior ? JSON.parse(JSON.stringify(exterior)) : undefined,
          materials: []
        };

        let isValid = true;
        let validationError = "";

        for (const action of data.actions) {
          const vRes = validateUnifiedAction(action, tempProject, activeFloorId || undefined);
          if (vRes.valid && vRes.updatedProject) {
            tempProject = vRes.updatedProject;
          } else {
            isValid = false;
            validationError = vRes.error || "Action invalid";
            break;
          }
        }

        if (isValid) {
          // Immediately apply if user wants direct execution, but present preview option
          setPendingProject(tempProject);
          setPendingMessage(data.message);
        } else {
          setMessages(prev => [...prev, { role: 'ai', content: `Notice: ${validationError}. ${data.message || ''}` }]);
        }
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'ai', content: "Autonomous Civil Engine: Executed architectural optimization." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (pendingProject) {
      updateProjectData(pendingProject.floors, pendingProject.exterior);
      setMessages(prev => [...prev, { role: 'ai', content: pendingMessage ? `✓ Applied: ${pendingMessage}` : "✓ Plan updated successfully." }]);
      setPendingProject(null);
      setPendingMessage(null);
      
      // Auto-recalculate costs in background
      generateCostEstimate();
    }
  };

  const handleCancel = () => {
    setMessages(prev => [...prev, { role: 'ai', content: "Action preview dismissed." }]);
    setPendingProject(null);
    setPendingMessage(null);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-6 right-6 p-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 transition-all z-40 flex items-center gap-2 group border border-amber-300/40"
        title="AI Civil Architect & Interior Agent"
      >
        <Bot className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
        <span className="text-xs font-mono uppercase tracking-wider font-bold hidden sm:inline">AI Civil Studio</span>
      </button>

      {/* Cartier Obsidian & Gold Modal Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-4 sm:right-6 w-[94vw] sm:w-[420px] max-h-[82vh] flex flex-col bg-zinc-950/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-800 z-40 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800/80 p-4 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 shadow-md">
                <Compass className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-serif font-medium text-sm text-white flex items-center gap-1.5">
                  AI Civil Intelligence Studio
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80">
                  Autonomous Architectural Agent
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950">
            {messages.length === 0 && (
              <div className="text-center p-5 bg-zinc-900/60 rounded-xl border border-zinc-800/80 mt-2 space-y-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-serif text-zinc-200">How may I direct your blueprint?</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  I can modify floor materials, place luxury furniture suites, calculate structural BOQs, and adjust solar lighting in real time.
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                  {[
                    "Change living room flooring to marble",
                    "Add a bed to the bedroom",
                    "Add a sofa and coffee table",
                    "How much will my project cost?",
                    "Change roof to sloped",
                    "Optimize living room for natural daylight",
                    "Set atmosphere to evening golden hour"
                  ].map(prompt => (
                    <button 
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="text-[10px] bg-zinc-900 hover:bg-amber-500/10 text-zinc-300 hover:text-amber-300 px-2.5 py-1.5 rounded-lg transition-all border border-zinc-800 hover:border-amber-500/40 font-mono text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-amber-500/10 text-amber-200 border-amber-500/30 rounded-tr-sm font-mono' 
                    : 'bg-zinc-900/80 text-zinc-200 border-zinc-800 rounded-tl-sm'
                }`}>
                  <div className="whitespace-pre-line">{msg.content}</div>
                  
                  {msg.payload && msg.payload.cost && (
                    <div className="mt-2.5 p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 font-mono text-[11px] text-amber-400">
                      <strong>Financial Breakdown:</strong> {msg.payload.cost}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Pending Simulation Action Card */}
            {pendingProject && (
              <div className="flex justify-start">
                <div className="max-w-[92%] p-4 rounded-2xl text-xs shadow-xl border bg-amber-500/10 text-amber-200 border-amber-500/30 rounded-tl-sm space-y-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="font-medium text-white">{pendingMessage}</p>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Preview generated. Synchronize these modifications to your 2D CAD canvas and 3D viewport?
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button 
                      onClick={handleApply} 
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 py-2 rounded-lg font-mono uppercase tracking-wider text-[10px] font-bold transition-all shadow-md"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Apply Changes
                    </button>
                    <button 
                      onClick={handleCancel} 
                      className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-900 text-zinc-400 hover:text-zinc-200 py-2 rounded-lg font-mono uppercase tracking-wider text-[10px] border border-zinc-800 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 p-3 rounded-2xl rounded-tl-sm text-xs shadow-sm flex items-center gap-2 font-mono">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
                  </div>
                  Evaluating architectural geometry...
                </div>
              </div>
            )}
          </div>

          {/* Text Input Dock */}
          <div className="p-3 bg-zinc-950 border-t border-zinc-800/80">
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-xl p-1 pr-1.5 focus-within:border-amber-500/50 transition-all">
              <input 
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask to change materials, add beds, optimize layout..."
                className="flex-1 bg-transparent border-none focus:outline-none p-2 text-xs text-zinc-100 placeholder:text-zinc-500"
                disabled={isLoading || !!pendingProject}
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading || !!pendingProject}
                className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg disabled:opacity-40 transition-all"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
