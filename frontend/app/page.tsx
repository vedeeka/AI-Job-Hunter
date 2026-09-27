'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, Mail, Linkedin, TrendingUp, BarChart3, Brain, 
  Code2, Clock, CheckCircle, ArrowRight, Menu, X, Search,
  Sparkles, GitBranch, ExternalLink, ShieldCheck, Target,
  FileSpreadsheet, FileText, ChevronRight, Star, Cpu
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Search,
      title: "Smart Job Discovery",
      description: "Aggregates, deduplicates, and filters hundreds of real-time software & AI roles tailored to your exact skills.",
      badge: "Real-time Scraper",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: FileSpreadsheet,
      title: "Google Maps Leads & CSV",
      description: "Scrapes companies, domains, social profiles, and extracts verified decision-maker emails into clean CSV datasets.",
      badge: "Lead Engine",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Mail,
      title: "AI Cold Emailer",
      description: "Generates bespoke, high-converting outreach emails tuned specifically for the target job description and hiring team.",
      badge: "Gemini 2.5 Flash",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: FileText,
      title: "Resume Doctor ATS Tailor",
      description: "Scores your resume against target job requirements, calculates ATS match percentages, and highlights missing keywords.",
      badge: "ATS Optimizer",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Brain,
      title: "Live Resume Builder",
      description: "Interactive real-time A4 resume editor with instant AI prompt updates and one-click PDF export.",
      badge: "Live A4 Preview",
      color: "from-violet-500 to-purple-700"
    },
    {
      icon: TrendingUp,
      title: "Skill Graph & Career Path",
      description: "Visualizes your skill proficiencies, identifies learning gaps, and generates tailored prep roadmaps.",
      badge: "Skill Intelligence",
      color: "from-pink-500 to-rose-600"
    }
  ];

  const metrics = [
    { value: "94%", label: "ATS Match Accuracy", sub: "NLP Semantic Alignment", icon: CheckCircle },
    { value: "3.6x", label: "Higher Response Rate", sub: "Compared to generic emails", icon: TrendingUp },
    { value: "100+", label: "Leads Extracted / Run", sub: "With direct decision-maker emails", icon: FileSpreadsheet },
    { value: "20+", label: "Hours Saved Weekly", sub: "Zero manual prospecting", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-purple-500 selection:text-white relative overflow-hidden">
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-tr from-purple-400/20 via-indigo-300/20 to-pink-300/15 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-purple-300/10 blur-[140px] pointer-events-none -z-10" />

      {/* Sticky Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-purple-100/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl text-white gradient-brand shadow-sm group-hover:scale-105 transition-transform">
              <Zap size={20} className="fill-white/20" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                AI Job <span className="text-purple-600">Hunter</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-100 text-purple-700">
                v2.0
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-purple-600 transition-colors">Features</a>
            <a href="#leads" className="hover:text-purple-600 transition-colors">CSV Lead Engine</a>
            <a href="#resume" className="hover:text-purple-600 transition-colors">Resume Doctor</a>
            <a href="#metrics" className="hover:text-purple-600 transition-colors">Performance</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-purple-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 text-sm font-bold text-white gradient-brand rounded-xl shadow-md hover:shadow-purple-500/25 hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Launch Dashboard</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-purple-100 bg-white p-6 space-y-4 shadow-xl">
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-slate-700 py-1"
            >
              Features
            </a>
            <a 
              href="#leads" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-slate-700 py-1"
            >
              CSV Lead Engine
            </a>
            <a 
              href="#resume" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-slate-700 py-1"
            >
              Resume Doctor
            </a>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link 
                href="/auth/login"
                className="w-full text-center py-2.5 font-semibold text-slate-700 rounded-lg border border-slate-200"
              >
                Sign In
              </Link>
              <Link 
                href="/dashboard"
                className="w-full text-center py-2.5 font-bold text-white gradient-brand rounded-lg shadow-md"
              >
                Launch Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        
        {/* HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto mb-20">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-200 bg-purple-50/80 text-purple-700 text-xs font-bold mb-8 shadow-xs hover:bg-purple-100 transition-colors">
            <Sparkles size={14} className="text-purple-600 animate-pulse" />
            <span>Next-Gen Autonomous Career Pipeline & Lead Scraper</span>
            <ChevronRight size={14} />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
            Land High-Paying Roles <br />
            <span className="gradient-text">10x Faster with AI</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Automate live job discovery, extract verified company leads into interactive CSVs, craft high-converting cold outreach, and ATS-optimize your resume in seconds.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white gradient-brand rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 glow-purple"
            >
              <Sparkles size={18} />
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/dashboard/email_section"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-800 bg-white border-2 border-purple-200/80 hover:border-purple-400 hover:bg-purple-50/50 rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <FileSpreadsheet size={18} className="text-purple-600" />
              <span>Explore CSV Scraper</span>
            </Link>
          </div>

          {/* Social Proof Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 pt-4">
            <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-500" /> 100% Free & Open Source</span>
            <span className="flex items-center gap-1.5"><Star size={16} className="text-amber-500 fill-amber-500" /> Powered by Gemini & Fast ML</span>
            <span className="flex items-center gap-1.5"><Cpu size={16} className="text-purple-500" /> Ready for Vercel Deployment</span>
          </div>

        </section>

        {/* METRICS SHOWCASE */}
        <section id="metrics" className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-24">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div 
                key={idx} 
                className="bg-white p-6 sm:p-7 rounded-2xl border border-purple-100/90 shadow-sm hover:shadow-md hover:border-purple-300 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={20} />
                </div>
                <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-1">{metric.value}</p>
                <p className="text-sm font-bold text-slate-700">{metric.label}</p>
                <p className="text-xs text-slate-500 mt-1">{metric.sub}</p>
              </div>
            );
          })}
        </section>

        {/* INTERACTIVE BENTO GRID / CORE MODULES */}
        <section id="features" className="mb-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black tracking-widest text-purple-600 uppercase">Core Ecosystem</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Everything Needed to Dominate the Job Market
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              Six modular AI tools engineered to eliminate weeks of repetitive work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl p-7 border border-purple-100 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon size={22} />
                      </div>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {feat.description}
                    </p>
                  </div>

                  <Link 
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors group-hover:translate-x-1"
                  >
                    <span>Launch Module</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM HERO CTA */}
        <section className="rounded-3xl gradient-brand p-10 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-purple-100 text-base sm:text-lg mb-8 leading-relaxed">
              Start searching jobs, extracting targeted company leads, and building ATS-ready resumes today.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-700 hover:bg-purple-50 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-base"
            >
              <Zap size={20} className="fill-purple-600 text-purple-600" />
              <span>Open AI Job Hunter Dashboard</span>
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-purple-600 text-white">
              <Zap size={14} />
            </div>
            <span className="font-bold text-slate-800">AI Job Hunter</span>
            <span>— Automated Career Intelligence</span>
          </div>
          <p className="text-xs">
            © {new Date().getFullYear()} AI Job Hunter. Built for modern engineers and job seekers.
          </p>
        </div>
      </footer>

    </div>
  );
}