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
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/LogoutButton";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'AI Civil Assistant', href: '/dashboard/ai-assistant', icon: Bot, disabled: true },
  { name: 'Floor Planner', href: '/dashboard/planner', icon: Grid2X2, disabled: true },
  { name: '3D Interior', href: '/dashboard/interior', icon: Box, disabled: true },
  { name: '3D Exterior', href: '/dashboard/exterior', icon: Building, disabled: true },
  { name: 'Materials', href: '/dashboard/materials', icon: Layers, disabled: true },
  { name: 'Cost Estimator', href: '/dashboard/estimator', icon: Calculator, disabled: true },
  { name: 'BOQ', href: '/dashboard/boq', icon: FileSpreadsheet, disabled: true },
  { name: 'Construction', href: '/dashboard/construction', icon: Hammer, disabled: true },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText, disabled: true },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, disabled: true },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col bg-white border-r border-slate-200">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-6 gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <span className="text-xl font-semibold tracking-tight">Civil Agent</span>
          </div>
          
          <div className="px-4 mb-4">
            <Link 
              href="/dashboard/projects/new" 
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Link>
          </div>

          <nav className="flex-1 px-3 space-y-1 pb-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return item.disabled ? (
                <div
                  key={item.name}
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 cursor-not-allowed justify-between"
                  title="Coming soon"
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 flex-shrink-0 h-5 w-5 text-slate-300" aria-hidden="true" />
                    {item.name}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Soon</span>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100',
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-blue-700' : 'text-slate-400 group-hover:text-slate-600',
                      'mr-3 flex-shrink-0 h-5 w-5 transition-colors'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="flex-shrink-0 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-slate-900">
              {navigation.find(n => n.href === pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 border border-slate-300">
              <User className="w-5 h-5" />
            </div>
            <LogoutButton />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
