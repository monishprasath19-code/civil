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
    <div className="flex h-screen bg-[#faf8f5] overflow-hidden font-sans text-[#1c1917] selection:bg-[#1b3a2b]/20 selection:text-[#1b3a2b]">
      {/* Figma Architectural Editorial Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col bg-[#fbfaf8] border-r border-[#e7e5df] shadow-sm">
        <div className="flex flex-col flex-grow pt-6 overflow-y-auto">
          
          {/* Brand Emblem */}
          <div className="flex items-center flex-shrink-0 px-6 mb-6 gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1b3a2b] flex items-center justify-center text-white shadow-sm">
              <Compass className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <span className="text-base font-serif tracking-tight text-[#1c1917] block leading-tight font-normal">
                Maison & Civil
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#78716c] block">
                Architectural Atelier
              </span>
            </div>
          </div>
          
          {/* New Project Action */}
          <div className="px-5 mb-5">
            <Link 
              href="/dashboard/projects/new" 
              className="w-full flex items-center justify-center gap-2 bg-[#1b3a2b] hover:bg-[#14281d] text-white px-4 py-2.5 rounded-full transition-all text-xs font-mono tracking-wider uppercase font-medium shadow-sm hover:shadow active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.2]" />
              New Project
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 space-y-1 pb-6">
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#a8a29e] font-medium">
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
                      ? 'bg-[#1b3a2b] text-white font-medium shadow-sm rounded-full'
                      : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#f0ede6] rounded-full',
                    'group flex items-center px-4 py-2 text-xs transition-all'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-white' : 'text-[#78716c] group-hover:text-[#1c1917]',
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
          <div className="p-4 mx-3 mb-4 rounded-2xl bg-white border border-[#e7e5df] text-[11px] text-[#78716c] shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#a8a29e]">Engine Status</span>
              <span className="flex items-center gap-1.5 text-emerald-700 font-mono text-[10px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                PBR Ready
              </span>
            </div>
            <p className="text-[10px] text-[#78716c] leading-tight">
              WebGL 2.0 • Three.js Physically Based • Gemini Copilot
            </p>
          </div>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="flex flex-col flex-1 overflow-hidden bg-[#faf8f5]">
        {/* Topbar */}
        <header className="flex-shrink-0 bg-white/90 backdrop-blur-md border-b border-[#e7e5df] h-16 flex items-center justify-between px-6 lg:px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#78716c] block leading-tight">
                Architectural Studio
              </span>
              <h1 className="text-base font-serif tracking-tight text-[#1c1917] font-normal">
                {navigation.find(n => n.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5f3ec] border border-[#e7e5df] text-[11px] text-[#1b3a2b] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#1b3a2b]" />
              <span>Figma Architectural Theme Active</span>
            </div>

            <button className="p-2 text-[#78716c] hover:text-[#1c1917] rounded-full hover:bg-[#f0ede6] transition-colors">
              <Bell className="w-4 h-4" />
            </button>

            <div className="w-8 h-8 rounded-full bg-[#1b3a2b]/10 flex items-center justify-center text-[#1b3a2b] border border-[#1b3a2b]/20">
              <User className="w-4 h-4" />
            </div>

            <LogoutButton />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-[#faf8f5]">
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
