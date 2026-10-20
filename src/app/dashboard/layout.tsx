"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Bot, 
  Grid2X2, 
  Box, 
  Building, 
  Layers, 
  Calculator, 
  FileSpreadsheet, 
  Hammer, 
  FileText, 
  Settings,
  Bell,
  User,
  Plus,
  Sparkles,
  Compass
} from "lucide-react";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/LogoutButton";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'AI Civil Assistant', href: '/dashboard/ai-assistant', icon: Bot },
  { name: 'Floor Planner', href: '/dashboard/planner', icon: Grid2X2 },
  { name: '3D Interior', href: '/dashboard/interior', icon: Box },
  { name: '3D Exterior', href: '/dashboard/exterior', icon: Building },
  { name: 'Materials Atelier', href: '/dashboard/materials', icon: Layers },
  { name: 'Cost Estimator', href: '/dashboard/estimator', icon: Calculator },
  { name: 'BOQ Schedules', href: '/dashboard/boq', icon: FileSpreadsheet },
  { name: 'Construction Milestones', href: '/dashboard/construction', icon: Hammer },
  { name: 'Executive Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Studio Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden font-sans text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Cartier Atelier Luxury Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col bg-zinc-950 border-r border-zinc-900/90 shadow-2xl">
        <div className="flex flex-col flex-grow pt-6 overflow-y-auto">
          
          {/* Brand Emblem */}
          <div className="flex items-center flex-shrink-0 px-6 mb-6 gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-zinc-950 font-serif font-bold text-base shadow-lg shadow-amber-500/20 border border-amber-300/30">
              <Compass className="w-5 h-5 text-zinc-950" />
            </div>
            <div>
              <span className="text-base font-serif tracking-wider text-white block uppercase leading-tight font-semibold">
                Maison Civil
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-amber-400/80 block">
                Atelier Architectural
              </span>
            </div>
          </div>
          
          {/* New Project Action */}
          <div className="px-5 mb-5">
            <Link 
              href="/dashboard/projects/new" 
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 px-4 py-2.5 rounded-xl transition-all text-xs font-mono tracking-wider uppercase font-semibold shadow-lg shadow-amber-500/15 hover:shadow-amber-500/30 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              New Architectural Project
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 space-y-1 pb-6">
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400">
              Navigation Modules
            </div>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? 'bg-amber-500/10 text-amber-300 border-l-2 border-amber-400 font-medium shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border-l-2 border-transparent',
                    'group flex items-center px-3 py-2.5 text-xs font-medium rounded-r-lg transition-all'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-amber-400' : 'text-zinc-400 group-hover:text-amber-400/80',
                      'mr-3 flex-shrink-0 h-4 w-4 transition-colors'
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Studio Telemetry Footer */}
          <div className="p-4 mx-3 mb-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-400">
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span className="font-mono text-[9px] uppercase tracking-wider">Engine Status</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                PBR Ready
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight">
              WebGL 2.0 • Drei Atmospheric Sky • Gemini 1.5 Pro
            </p>
          </div>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="flex flex-col flex-1 overflow-hidden bg-zinc-950">
        {/* Topbar */}
        <header className="flex-shrink-0 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900/90 h-16 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400/80 block leading-tight">
                Architectural Studio
              </span>
              <h1 className="text-base font-serif tracking-tight text-white font-medium">
                {navigation.find(n => n.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Cartier Mineral Suite Active</span>
            </div>

            <button className="p-2 text-zinc-400 hover:text-amber-400 rounded-full hover:bg-zinc-900 transition-colors">
              <Bell className="w-4 h-4" />
            </button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500/20 to-amber-400/40 flex items-center justify-center text-amber-300 border border-amber-500/30">
              <User className="w-4 h-4" />
            </div>

            <LogoutButton />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gradient-to-b from-zinc-950 via-zinc-950 to-black">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
