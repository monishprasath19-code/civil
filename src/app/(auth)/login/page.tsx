"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { login, instantDemoLogin } from "@/app/(auth)/actions";
import { Compass, Sparkles, ArrowRight, Zap, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [showBypass, setShowBypass] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setShowBypass(false);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await login(formData);
      if (res?.error) {
        setError(res.error);
        if (res.showBypass) setShowBypass(true);
      }
    });
  };

  const handleInstantAccess = () => {
    startTransition(async () => {
      await instantDemoLogin();
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-zinc-950 shadow-xl shadow-amber-500/20 group-hover:scale-105 transition-transform border border-amber-300/30">
            <Compass className="w-6 h-6 stroke-[2.5]" />
          </div>
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400/90 font-medium block">
          Maison Civil • Atelier Login
        </span>
        <h2 className="mt-2 text-3xl font-serif text-white tracking-tight">
          Enter Architectural Console
        </h2>
        <p className="mt-2 text-xs text-zinc-400 font-light">
          Access your commissioned 2D CAD floor plans, 3D PBR engines, and structural BOQs.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-zinc-900/60 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl border border-zinc-800/80 shadow-2xl space-y-6">
          
          {/* 1-Click Instant Access Button (NO EMAIL VERIFICATION NEEDED) */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleInstantAccess}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-[0.99] disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-zinc-950" />
              Instant Access (No Verification Needed)
            </button>
            <p className="text-[10px] text-zinc-500 text-center font-mono">
              Bypasses email confirmation • Enters directly into dashboard
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-zinc-800" />
            <span className="absolute bg-zinc-900 px-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Or sign in with email
            </span>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 text-xs space-y-2">
              <p>{error}</p>
              {showBypass && (
                <button
                  type="button"
                  onClick={handleInstantAccess}
                  className="w-full py-2 bg-amber-500 text-zinc-950 font-mono text-[10px] uppercase font-bold rounded-lg hover:bg-amber-400 transition-colors"
                >
                  ⚡ Click Here for Instant Access
                </button>
              )}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Email Address
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                placeholder="architect@atelier.com"
                className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 transition-colors font-sans" 
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Password
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="current-password" 
                required 
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 transition-colors font-sans" 
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2.5 px-4 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors disabled:opacity-50"
              >
                {isPending ? "Authenticating..." : "Sign in with Credentials"}
              </button>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-zinc-800/80">
            <p className="text-xs text-zinc-400">
              New architect?{" "}
              <Link href="/signup" className="text-amber-400 hover:text-amber-300 font-mono uppercase tracking-wider text-[11px] transition-colors">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
