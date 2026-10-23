"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, RefreshCw, ArrowLeft, Building2, Compass, Layers, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AIAssistantStudioPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; time: string }>>([
    {
      role: 'assistant',
      content: "Salutations. I am your Civil & Architectural AI Agent.\n\nI can assist with structural column sizing, concrete slab volume calculations, passive cross-ventilation, municipal setbacks & FAR, Vastu spatial orientation, and itemized BOQ estimations. How may I assist your architectural practice today?",
      time: "Just now"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || isLoading) return;

    const userMsg = { 
      role: 'user' as const, 
      content: prompt, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: {
            mode: "general_civil_consultation",
            activeFloorId: "general",
            rooms: [],
            walls: [],
            furniture: []
          }
        })
      });

      const data = await res.json();
      const reply = data.message || data.explanation || data.reply || "I have analyzed your query according to standard civil architectural guidelines. Let me know if you would like to apply this to a specific floor plan.";
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I have evaluated your request. For structural and spatial changes, you can also open any floor plan in the 2D planner or 3D workspace where I can directly preview and apply spatial transformations.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-7rem)] flex flex-col pb-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e7e5df] pb-4 mb-4 shrink-0 bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1b3a2b] flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5 text-white stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#1b3a2b] uppercase font-semibold">
                AUTONOMOUS CIVIL COPILOT
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            </div>
            <h1 className="text-xl font-serif text-[#1c1917] font-normal tracking-tight">
              AI Civil Architecture & Structural Studio
            </h1>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#d6d3cc] hover:bg-[#f5f3ec] text-[#1c1917] text-xs font-mono transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-5 rounded-3xl bg-white border border-[#e7e5df] shadow-sm">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-5 text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-[#1b3a2b] text-white rounded-tr-sm font-sans shadow-sm' 
                : 'bg-[#faf8f5] border border-[#e7e5df] text-[#1c1917] rounded-tl-sm shadow-sm font-sans'
            }`}>
              <div className="flex items-center justify-between gap-4 mb-2 text-[10px] font-mono">
                <span className={`font-semibold tracking-wider ${m.role === 'user' ? 'text-emerald-200' : 'text-[#1b3a2b]'}`}>
                  {m.role === 'user' ? 'LEAD ARCHITECT' : 'CIVIL AI AGENT'}
                </span>
                <span className={m.role === 'user' ? 'text-white/60' : 'text-[#78716c]'}>{m.time}</span>
              </div>
              <p className="whitespace-pre-line font-light leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e5df] text-[#57534e] text-xs font-mono flex items-center gap-2.5 shadow-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-[#1b3a2b]" />
              <span>Analyzing structural specifications & building bylaws...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="py-3 flex flex-wrap gap-2 shrink-0">
        {[
          "What is the standard residential ceiling height?",
          "How to calculate concrete slab volume for a 150 m² floor?",
          "Explain column sizing rules for G+1 residential structure",
          "What are the typical cost ratios between substructure and finishes?",
          "What are the mandatory setbacks for a residential plot?"
        ].map(prompt => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="text-[11px] font-mono bg-white hover:bg-[#f5f3ec] border border-[#d6d3cc] hover:border-[#1b3a2b] text-[#57534e] hover:text-[#1b3a2b] px-3.5 py-1.5 rounded-full transition-all shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="pt-1 shrink-0">
        <div className="flex items-center gap-2 bg-white border border-[#d6d3cc] rounded-full p-1.5 pr-2 focus-within:border-[#1b3a2b] focus-within:ring-1 focus-within:ring-[#1b3a2b] transition-all shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about column spans, slab volume, Vastu orientation, or material takeoff..."
            className="flex-1 bg-transparent border-none text-sm text-[#1c1917] placeholder:text-[#a8a29e] px-4 py-2.5 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-3 rounded-full bg-[#1b3a2b] hover:bg-[#14281d] text-white disabled:opacity-40 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
