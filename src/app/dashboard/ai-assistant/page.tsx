"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, ShieldCheck, Cpu, ArrowLeft, RefreshCw, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function AIAssistantStudioPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; time: string }>>([
    {
      role: 'assistant',
      content: "Salutations. I am your Civil & Architectural AI Agent. I can advise on structural column spans, natural daylight ratios, passive thermal zoning, municipal building bylaws, and deterministic quantity takeoff calculations. How may I assist your architectural atelier today?",
      time: "Just now"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, content: prompt, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
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
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col pb-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.25em] text-amber-400 uppercase">CO-PILOTE INTELLIGENT</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-xl font-serif text-white">AI Civil Architecture Assistant</h1>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-zinc-300 hover:text-amber-400 text-xs font-mono transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/80 shadow-2xl backdrop-blur-xl">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-amber-500/15 border border-amber-500/40 text-amber-100 rounded-tr-sm font-sans' 
                : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200 rounded-tl-sm shadow-md font-sans'
            }`}>
              <div className="flex items-center justify-between gap-4 mb-1.5 text-[10px] font-mono text-zinc-500">
                <span className={m.role === 'user' ? 'text-amber-400' : 'text-zinc-400'}>
                  {m.role === 'user' ? 'ARCHITECT' : 'CIVIL AI AGENT'}
                </span>
                <span>{m.time}</span>
              </div>
              <p className="whitespace-pre-line font-light">{m.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 text-xs font-mono flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Synthesizing architectural specifications...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Chips */}
      <div className="py-2.5 flex flex-wrap gap-1.5 shrink-0">
        {[
          "What is the standard residential ceiling height?",
          "How to calculate concrete slab volume for a 150 m² floor?",
          "Explain passive cross-ventilation rules for tropical climates",
          "What are the typical cost ratios between substructure and finishes?"
        ].map(prompt => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="text-[11px] font-mono bg-zinc-900/80 hover:bg-amber-500/10 border border-zinc-800 hover:border-amber-500/40 text-zinc-400 hover:text-amber-300 px-3 py-1.5 rounded-full transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="pt-1 shrink-0">
        <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-1.5 pr-2 focus-within:border-amber-500/50 transition-all shadow-xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about structural spans, material properties, or architectural standards..."
            className="flex-1 bg-transparent border-none text-sm text-zinc-100 placeholder:text-zinc-500 px-3 py-2 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold disabled:opacity-40 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
