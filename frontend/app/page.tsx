'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, Mail, Linkedin, TrendingUp, BarChart3, Brain, 
  Code2, Clock, CheckCircle, ArrowRight, Menu, X, Search,
  Sparkles, GitBranch, ExternalLink
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: Search,
      title: "Job Discovery",
      description: "100+ jobs/day from multiple sources",
      tech: "BeautifulSoup + JobsPikr API"
    },
    {
      icon: Mail,
      title: "Email Finder",
      description: "95% accuracy email detection",
      tech: "Hunter.io (50 free/mo)"
    },
    {
      icon: Zap,
      title: "Cold Email Sender",
      description: "Unlimited personalized emails",
      tech: "Gmail SMTP"
    },
    {
      icon: Linkedin,
      title: "LinkedIn Automation",
      description: "80 safe connections/day",
      tech: "Playwright Browser Bot"
    },
    {
      icon: Brain,
      title: "Resume Matching",
      description: "92% accuracy job matching",
      tech: "SentenceTransformers NLP"
    },
    {
      icon: TrendingUp,
      title: "Email Personalization",
      description: "3.6x higher reply rates",
      tech: "HuggingFace LLM"
    }
  ];

  const metrics = [
    { value: "92%", label: "Match Accuracy", icon: CheckCircle },
    { value: "55%", label: "Reply Rate", icon: Mail },
    { value: "80", label: "LinkedIn Conn/Day", icon: Linkedin },
    { value: "20+", label: "Hours Saved/Week", icon: Clock }
  ];

  return (
    <div className="min-h-screen text-gray-900" style={{ background: '#fff' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b shadow-sm" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2 rounded-lg group-hover:shadow-md transition-all" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}>
              <Zap className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#1e1b4b' }}>AI Job Hunter</h1>
          </div>
          
          <nav className="hidden md:flex gap-8">
            {['Overview', 'Features', 'Why It Works', 'Tech Stack'].map((item) => (
              <button
                key={item}
                className="font-medium transition relative group"
                style={{ color: '#6b7280' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#1e1b4b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ background: '#7c3aed' }}></span>
              </button>
            ))}
          </nav>

          <button 
            className="md:hidden"
            style={{ color: '#6b7280' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t p-4 space-y-2" style={{ borderColor: '#e9d5ff', background: '#faf5ff' }}>
            {['Overview', 'Features', 'Why It Works', 'Tech Stack'].map((item) => (
              <button
                key={item}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-4 py-2 rounded transition"
                style={{ color: '#6b7280' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f3f0ff';
                  e.currentTarget.style.color = '#1e1b4b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        
        {/* Hero Section */}
        <section className="mb-32">
          <div className="max-w-4xl mb-12">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 border-2" style={{ background: '#faf5ff', borderColor: '#e9d5ff', color: '#7c3aed' }}>
              <Sparkles size={16} />
              <span className="text-sm font-medium">AI-Powered Job Automation Platform</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight" style={{ color: '#1e1b4b' }}>
              Find Your Next{' '}
              <span style={{ color: '#7c3aed' }}>
                Dream Job
              </span>
            </h2>
            <p className="text-xl mb-8 leading-relaxed" style={{ color: '#6b7280' }}>
              Automate job discovery, personalized outreach, and response analytics. Save 20+ hours per week while achieving 3x higher reply rates with AI-powered intelligence.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}>
                View Demo
              </button>
              <button className="px-8 py-3 rounded-lg font-bold transition flex items-center gap-2 border-2" style={{ borderColor: '#e9d5ff', color: '#1e1b4b' }} onMouseEnter={(e) => e.currentTarget.style.background = '#faf5ff'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <GitBranch size={20} />
                GitHub Repo
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {metrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div 
                  key={idx} 
                  className="border-2 p-6 rounded-xl transition-all"
                  style={{ background: '#fff', borderColor: '#e9d5ff' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#c4b5fd';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(124, 58, 237, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e9d5ff';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <p className="text-4xl font-bold mb-2" style={{ color: '#7c3aed' }}>{metric.value}</p>
                  <p className="text-sm flex items-center gap-2" style={{ color: '#6b7280' }}>
                    <Icon size={16} style={{ color: '#9ca3af' }} />
                    {metric.label}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1e1b4b' }}>
              Everything You Need to
              <span className="block" style={{ color: '#7c3aed' }}>
                Win at Job Hunting
              </span>
            </h3>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#6b7280' }}>Six powerful features working together to automate your entire job search process</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx}
                  className="group relative rounded-xl p-6 border-2 transition-all cursor-pointer"
                  style={{ background: '#fff', borderColor: '#e9d5ff' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#c4b5fd';
                    e.currentTarget.style.boxShadow = '0 10px 15px rgba(124, 58, 237, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e9d5ff';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="w-12 h-12 rounded-lg p-2.5 mb-4 transition-all" style={{ background: '#faf5ff' }}>
                    <Icon style={{ color: '#7c3aed' }} size={20} />
                  </div>
                  
                  <h4 className="text-lg font-bold mb-2" style={{ color: '#1e1b4b' }}>{feature.title}</h4>
                  <p className="text-sm mb-4" style={{ color: '#6b7280' }}>{feature.description}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border-2 text-xs font-medium" style={{ background: '#faf5ff', borderColor: '#e9d5ff', color: '#6b7280' }}>
                    <Code2 size={12} />
                    {feature.tech}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why It Works Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1e1b4b' }}>
              Why AI Job Hunter
              <span className="block" style={{ color: '#7c3aed' }}>
                Works Better
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Zap, title: "100% Automated", desc: "Fire and forget job applications with AI-powered personalization" },
              { icon: Brain, title: "ML-Powered Matching", desc: "92% accuracy with NLP embeddings to find perfect job fits" },
              { icon: TrendingUp, title: "3x Higher Reply Rates", desc: "Personalized outreach increases response from 15% to 55%" },
              { icon: Clock, title: "Save 20+ Hours/Week", desc: "Eliminate manual job searching, applications, and follow-ups" },
              { icon: Mail, title: "Multi-Channel Outreach", desc: "Email, LinkedIn, and connections for maximum reach" },
              { icon: BarChart3, title: "Real-Time Analytics", desc: "Track reply rates, sentiment analysis, and performance metrics" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="flex gap-4 p-6 rounded-xl border-2 transition-all group"
                  style={{ background: '#faf5ff', borderColor: '#e9d5ff' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#c4b5fd';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(124, 58, 237, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e9d5ff';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="p-3 rounded-lg h-fit" style={{ background: '#f3f0ff' }}>
                    <Icon style={{ color: '#7c3aed' }} size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ color: '#1e1b4b' }}>{item.title}</h4>
                    <p className="text-sm" style={{ color: '#6b7280' }}>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1e1b4b' }}>
              Built With Premium
              <span className="block" style={{ color: '#7c3aed' }}>
                Open Source Tools
              </span>
            </h3>
            <p style={{ color: '#6b7280' }}>No vendor lock-in, fully customizable</p>
          </div>

          <div className="rounded-2xl p-8 border-2" style={{ background: '#faf5ff', borderColor: '#e9d5ff' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "BeautifulSoup", role: "Web Scraping" },
                { name: "FastAPI", role: "Backend" },
                { name: "SentenceTransformers", role: "NLP" },
                { name: "Playwright", role: "Automation" },
                { name: "HuggingFace", role: "LLM" },
                { name: "BERT", role: "Sentiment" },
                { name: "React", role: "Frontend" },
                { name: "Three.js", role: "3D Viz" }
              ].map((tool, idx) => (
                <div 
                  key={idx} 
                  className="p-6 rounded-xl border-2 text-center group cursor-pointer transition-all"
                  style={{ background: '#fff', borderColor: '#e9d5ff' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#c4b5fd';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(124, 58, 237, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e9d5ff';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <p className="font-bold mb-1" style={{ color: '#1e1b4b' }}>{tool.name}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>{tool.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-24">
          <div className="rounded-2xl p-12 md:p-16 text-center border-2" style={{ background: '#faf5ff', borderColor: '#e9d5ff' }}>
            <h3 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1e1b4b' }}>Ready to Transform Your Job Search?</h3>
            <p className="mb-8 max-w-2xl mx-auto text-lg" style={{ color: '#374151' }}>
              Join hundreds of job seekers automating their way to better opportunities. No credit card required.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/dashboard">
                <button className="px-8 py-3 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}>
                  Get Started Free
                </button>
              </Link>
              <button className="px-8 py-3 rounded-lg font-bold transition flex items-center gap-2 mx-auto border-2" style={{ borderColor: '#c4b5fd', color: '#7c3aed' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f3f0ff'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                Learn More
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 text-center" style={{ borderColor: '#e9d5ff', color: '#6b7280' }}>
        <p>Built by Vedeeka parab | January 2026</p>
      </footer>
    </div>
  );
}