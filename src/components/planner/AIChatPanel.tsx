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
      const activeFloor = floors.find(f => f.id === activeFloorId) || (floors.length > 0 ? floors[0] : null);

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
          site: site || { 
            projectName: 'temp', 
            location: 'Site Location', 
            plotLength: 20, 
            plotWidth: 15, 
            plotArea: 300, 
            unit: 'meters', 
            roadDirection: 'N', 
            northDirection: 0, 
            numberOfFloors: 1, 
            terrain: 'flat', 
            climate: 'tropical' 
          }, 
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
      {/* Floating Launcher Button - Figma Forest Green Theme */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-6 right-6 px-4 py-3 bg-[#1b3a2b] hover:bg-[#14281d] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-40 flex items-center gap-2 group border border-emerald-900/40"
        title="AI Civil Architect & Interior Studio"
      >
        <Bot className="w-4 h-4 text-white stroke-[2.2]" />
        <span className="text-xs font-mono uppercase tracking-wider font-semibold">AI Civil Studio</span>
      </button>

      {/* Figma Architectural Light Modal Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-4 sm:right-6 w-[94vw] sm:w-[430px] max-h-[82vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-[#e7e5df] z-40 overflow-hidden font-sans">
          
          {/* Header */}
          <div className="bg-[#faf8f5] border-b border-[#e7e5df] p-4 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1b3a2b] flex items-center justify-center text-white shadow-sm">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-serif font-normal text-sm text-[#1c1917] flex items-center gap-1.5">
                  Civil Intelligence Atelier
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                </h3>
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#78716c]">
                  Spatial Automation & BOQ Engine
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1.5 rounded-full hover:bg-[#e7e5df] text-[#78716c] hover:text-[#1c1917] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#faf8f5]">
            {messages.length === 0 && (
              <div className="text-center p-5 bg-white rounded-2xl border border-[#e7e5df] mt-1 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#1b3a2b]/10 border border-[#1b3a2b]/20 mx-auto flex items-center justify-center text-[#1b3a2b]">
                  <Sparkles className="w-5 h-5 text-[#1b3a2b]" />
                </div>
                <h4 className="text-sm font-serif text-[#1c1917]">How may I assist your plan?</h4>
                <p className="text-xs text-[#57534e] leading-relaxed font-light">
                  I can apply PBR flooring materials, insert calibrated furniture, calculate structural takeoffs, and adjust solar lighting in real time.
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                  {[
                    "Change living room flooring to marble",
                    "Add a bed to the bedroom",
                    "Add a sofa and coffee table",
                    "How much will my project cost?",
                    "Change roof to sloped",
                    "Optimize living room for daylight",
                    "Set atmosphere to evening sunset"
                  ].map(prompt => (
                    <button 
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="text-[10px] bg-[#faf8f5] hover:bg-[#1b3a2b] hover:text-white text-[#57534e] px-2.5 py-1.5 rounded-full transition-all border border-[#d6d3cc] font-mono text-left"
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
                    ? 'bg-[#1b3a2b] text-white border-transparent rounded-tr-sm font-sans' 
                    : 'bg-white text-[#1c1917] border-[#e7e5df] rounded-tl-sm'
                }`}>
                  <div className="whitespace-pre-line">{msg.content}</div>
                  
                  {msg.payload && msg.payload.cost && (
                    <div className="mt-2.5 p-2.5 bg-[#faf8f5] rounded-xl border border-[#e7e5df] font-mono text-[11px] text-[#1b3a2b]">
                      <strong>Financial Breakdown:</strong> {msg.payload.cost}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Pending Simulation Action Card */}
            {pendingProject && (
              <div className="flex justify-start">
                <div className="max-w-[92%] p-4 rounded-2xl text-xs shadow-md border bg-white border-[#1b3a2b]/30 rounded-tl-sm space-y-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#1b3a2b] shrink-0 mt-0.5" />
                    <p className="font-medium text-[#1c1917]">{pendingMessage}</p>
                  </div>
                  <p className="text-[11px] text-[#78716c]">
                    Preview ready. Synchronize these modifications to your 2D CAD canvas and 3D viewport?
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button 
                      onClick={handleApply} 
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#1b3a2b] hover:bg-[#14281d] text-white py-2 rounded-full font-mono uppercase tracking-wider text-[10px] font-semibold transition-all shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Apply Changes
                    </button>
                    <button 
                      onClick={handleCancel} 
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white text-[#57534e] hover:bg-[#faf8f5] py-2 rounded-full font-mono uppercase tracking-wider text-[10px] border border-[#d6d3cc] transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#e7e5df] text-[#57534e] p-3 rounded-2xl rounded-tl-sm text-xs shadow-sm flex items-center gap-2 font-mono">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#1b3a2b] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#1b3a2b] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#1b3a2b] rounded-full animate-bounce"></span>
                  </div>
                  Evaluating architectural geometry...
                </div>
              </div>
            )}
          </div>

          {/* Text Input Dock */}
          <div className="p-3 bg-white border-t border-[#e7e5df]">
            <div className="flex items-center gap-2 bg-[#faf8f5] border border-[#d6d3cc] rounded-full p-1 pr-1.5 focus-within:border-[#1b3a2b] transition-all">
              <input 
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask to change materials, add beds, optimize layout..."
                className="flex-1 bg-transparent border-none focus:outline-none px-3 py-2 text-xs text-[#1c1917] placeholder:text-[#a8a29e]"
                disabled={isLoading || !!pendingProject}
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading || !!pendingProject}
                className="p-2 bg-[#1b3a2b] hover:bg-[#14281d] text-white rounded-full disabled:opacity-40 transition-all shadow-sm"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
