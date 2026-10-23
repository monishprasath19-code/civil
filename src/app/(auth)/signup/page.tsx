"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signup, instantDemoLogin } from "@/app/(auth)/actions";
import { Compass, Sparkles, Zap, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [showBypass, setShowBypass] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setShowBypass(false);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await signup(formData);
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
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#1b3a2b]/20 selection:text-[#1b3a2b]">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1b3a2b] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 stroke-[2.2]" />
          </div>
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#1b3a2b] font-semibold block">
          Maison & Civil • Registration
        </span>
        <h2 className="mt-2 text-3xl font-serif text-[#1c1917] tracking-tight font-normal">
          Create Atelier Profile
        </h2>
        <p className="mt-2 text-xs text-[#78716c] font-light">
          Set up your civil architecture account to author blueprints and 3D scenes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#e7e5df] shadow-sm space-y-6">
          
          {/* 1-Click Instant Access Button (NO EMAIL VERIFICATION NEEDED) */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleInstantAccess}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-full bg-[#1b3a2b] hover:bg-[#14281d] text-white font-semibold text-xs font-mono uppercase tracking-wider transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              Instant Access (Skip Verification)
            </button>
            <p className="text-[10px] text-[#78716c] text-center font-mono">
              Enters dashboard immediately without email confirmation
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[#f0ede6]" />
            <span className="absolute bg-white px-3 text-[10px] font-mono uppercase tracking-wider text-[#a8a29e]">
              Or register credentials
            </span>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs space-y-2">
              <p>{error}</p>
              {showBypass && (
                <button
                  type="button"
                  onClick={handleInstantAccess}
                  className="w-full py-2 bg-[#1b3a2b] text-white font-mono text-[10px] uppercase font-bold rounded-full hover:bg-[#14281d] transition-colors"
                >
                  ⚡ Click Here for Instant Access
                </button>
              )}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-1.5 font-medium">
                Full Name
              </label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                autoComplete="name" 
                required 
                placeholder="Architectural Director"
                className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#d6d3cc] rounded-xl text-sm text-[#1c1917] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b3a2b] transition-colors font-sans" 
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-1.5 font-medium">
                Email Address
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                placeholder="architect@atelier.com"
                className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#d6d3cc] rounded-xl text-sm text-[#1c1917] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b3a2b] transition-colors font-sans" 
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-1.5 font-medium">
                Password
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="new-password" 
                required 
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#d6d3cc] rounded-xl text-sm text-[#1c1917] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b3a2b] transition-colors font-sans" 
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-1.5 font-medium">
                Confirm Password
              </label>
              <input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                autoComplete="new-password" 
                required 
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#faf8f5] border border-[#d6d3cc] rounded-xl text-sm text-[#1c1917] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b3a2b] transition-colors font-sans" 
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2.5 px-4 rounded-full text-xs font-mono uppercase tracking-wider font-semibold text-[#1c1917] bg-white hover:bg-[#faf8f5] border border-[#d6d3cc] transition-colors disabled:opacity-50 shadow-sm"
              >
                {isPending ? "Creating profile..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-[#f0ede6]">
            <p className="text-xs text-[#78716c]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#1b3a2b] hover:text-[#14281d] font-mono uppercase tracking-wider text-[11px] font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
