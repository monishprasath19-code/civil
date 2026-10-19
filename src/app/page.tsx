import Link from "next/link";
import { ArrowRight, Building, Layers, Component, Calculator, Box, Cpu } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              AI
            </div>
            <span className="text-xl font-semibold tracking-tight text-slate-900">Civil Agent</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How it Works</Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-24 pb-32">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>
          
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
              Design. Build. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">
                Visualize. Estimate.
              </span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              An AI-powered workspace for planning, designing, visualizing and managing construction projects.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
                Start Designing <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#explore" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-lg font-medium text-lg transition-all shadow-sm flex items-center justify-center gap-2">
                Explore 3D <Box className="w-5 h-5 text-blue-500" />
              </Link>
            </div>
            
            {/* Hero Visual Flow */}
            <div className="mt-20 mx-auto max-w-5xl">
              <div className="bg-white/60 backdrop-blur-xl border border-white p-6 md:p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-sky-50/50 rounded-2xl -z-10"></div>
                 <StepCard icon={<Layers className="w-8 h-8 text-blue-500" />} title="2D Blueprint" />
                 <ArrowRight className="hidden md:block w-6 h-6 text-slate-300" />
                 <StepCard icon={<Building className="w-8 h-8 text-sky-500" />} title="3D House" />
                 <ArrowRight className="hidden md:block w-6 h-6 text-slate-300" />
                 <StepCard icon={<Component className="w-8 h-8 text-indigo-500" />} title="Interior" />
                 <ArrowRight className="hidden md:block w-6 h-6 text-slate-300" />
                 <StepCard icon={<Building className="w-8 h-8 text-teal-500" />} title="Exterior" />
                 <ArrowRight className="hidden md:block w-6 h-6 text-slate-300" />
                 <StepCard icon={<Building className="w-8 h-8 text-blue-700" />} title="Finished" highlight />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Professional Civil Tools</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Everything you need to take your project from a blank canvas to a fully estimated construction plan.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <FeatureCard 
                icon={<Cpu className="w-6 h-6 text-blue-600" />}
                title="AI Floor Planning"
                description="Generate optimized 2D layouts based on your plot dimensions and specific room requirements."
              />
              <FeatureCard 
                icon={<Box className="w-6 h-6 text-sky-600" />}
                title="3D Walkthrough"
                description="Instantly convert your 2D plans into a realistic 3D model with first-person navigation."
              />
              <FeatureCard 
                icon={<Component className="w-6 h-6 text-indigo-600" />}
                title="Smart Interior"
                description="Furnish your rooms automatically. Edit, move, and customize interior objects effortlessly."
              />
              <FeatureCard 
                icon={<Building className="w-6 h-6 text-teal-600" />}
                title="Exterior Designer"
                description="Design beautiful elevations with customizable materials, roofing, and landscaping."
              />
              <FeatureCard 
                icon={<Layers className="w-6 h-6 text-amber-600" />}
                title="Material Intelligence"
                description="Search and apply real-world materials with intelligent recommendations for your budget."
              />
              <FeatureCard 
                icon={<Calculator className="w-6 h-6 text-emerald-600" />}
                title="Cost Estimation"
                description="Generate preliminary Bills of Quantities (BOQ) and construction cost estimates instantly."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
             <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                AI
              </div>
              <span className="text-lg font-semibold text-white">Civil Agent</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              The next generation of AI-powered civil engineering and architecture software.
            </p>
          </div>
          <div className="flex gap-8 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StepCard({ icon, title, highlight = false }: { icon: React.ReactNode, title: string, highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-3 p-4 rounded-xl w-full md:w-auto transition-transform hover:scale-105 ${highlight ? 'bg-blue-50 border border-blue-200 shadow-md' : ''}`}>
      <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100">
        {icon}
      </div>
      <span className={`font-medium text-sm ${highlight ? 'text-blue-700 font-semibold' : 'text-slate-700'}`}>{title}</span>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
