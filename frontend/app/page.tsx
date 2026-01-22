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
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2 bg-blue-600 rounded-lg group-hover:shadow-md transition-all">
              <Zap className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AI Job Hunter</h1>
          </div>
          
          <nav className="hidden md:flex gap-8">
            {['Overview', 'Features', 'Why It Works', 'Tech Stack'].map((item) => (
              <button
                key={item}
                className="text-gray-600 hover:text-gray-900 font-medium transition relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </nav>

          <button 
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 p-4 space-y-2 bg-gray-50">
            {['Overview', 'Features', 'Why It Works', 'Tech Stack'].map((item) => (
              <button
                key={item}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
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
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
              <Sparkles size={16} className="text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">AI-Powered Job Automation Platform</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
              Find Your Next{' '}
              <span className="text-blue-600">
                Dream Job
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Automate job discovery, personalized outreach, and response analytics. Save 20+ hours per week while achieving 3x higher reply rates with AI-powered intelligence.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-all shadow-md hover:shadow-lg">
                View Demo
              </button>
              <button className="px-8 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-bold transition flex items-center gap-2">
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
                  className="bg-white border border-gray-200 p-6 rounded-xl hover:border-gray-300 hover:shadow-md transition-all"
                >
                  <p className="text-4xl font-bold text-blue-600 mb-2">{metric.value}</p>
                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <Icon size={16} className="text-gray-400" />
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
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Everything You Need to
              <span className="block text-blue-600">
                Win at Job Hunting
              </span>
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Six powerful features working together to automate your entire job search process</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx}
                  className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredFeature(idx)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-50 p-2.5 mb-4 group-hover:bg-blue-100 transition-all">
                    <Icon className="text-blue-600" size={20} />
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                  <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200 text-xs text-gray-600 font-medium">
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
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Why AI Job Hunter
              <span className="block text-blue-600">
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
                <div key={idx} className="flex gap-4 p-6 rounded-xl bg-gray-50 border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all group">
                  <div className="p-3 rounded-lg bg-blue-50 h-fit group-hover:bg-blue-100 transition-all">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Built With Premium
              <span className="block text-blue-600">
                Open Source Tools
              </span>
            </h3>
            <p className="text-gray-600">No vendor lock-in, fully customizable</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
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
                <div key={idx} className="p-6 rounded-xl bg-white border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all text-center group cursor-pointer">
                  <p className="font-bold text-gray-900 mb-1">{tool.name}</p>
                  <p className="text-xs text-gray-600">{tool.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-24">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-12 md:p-16 text-center">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Ready to Transform Your Job Search?</h3>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto text-lg">
              Join hundreds of job seekers automating their way to better opportunities. No credit card required.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link rel="preconnect" href="/dashboard" >
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-all shadow-md hover:shadow-lg">
                Get Started Free
              </button>
              </Link>
              <button className="px-8 py-3 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-bold transition flex items-center gap-2 mx-auto">
                Learn More
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 text-center text-gray-600">
        <p>Built by Vedeeka parab | January 2026</p>
      </footer>
    </div>
  );
}