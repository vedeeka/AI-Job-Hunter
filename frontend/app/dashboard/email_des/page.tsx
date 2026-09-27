'use client';

import { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  Loader2, 
  Building2, 
  FileText, 
  Zap,
  RefreshCw,
  Mail,
  ChevronRight
} from 'lucide-react';
import { getApiUrl } from '../../utils/api';

const TONES = [
  { id: 'direct', label: 'Professional & Direct' },
  { id: 'technical', label: 'Technical & High-Impact' },
  { id: 'startup', label: 'Startup & Enthusiastic' },
  { id: 'short', label: 'Short & Punchy' }
];

const PRESETS = [
  { company: 'Google Cloud', desc: 'Seeking Full Stack Engineers to build cloud-native services and AI developer tooling using Python, React, and TypeScript.' },
  { company: 'Scale AI', desc: 'Looking for a Machine Learning Intern with strong foundations in NLP, PyTorch, FastAPIs, and data pipeline pipelines.' },
  { company: 'Stripe', desc: 'Backend Software Engineer to scale global financial infrastructure, high-throughput microservices, and reliable APIs.' }
];

export default function EmailGeneratorPage() {
  const [jobDesc, setJobDesc] = useState('');
  const [company, setCompany] = useState('');
  const [selectedTone, setSelectedTone] = useState('technical');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  const generateEmail = async () => {
    if (!jobDesc.trim() || !company.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        getApiUrl(`/email_des?job_description=${encodeURIComponent(jobDesc)}&company_name=${encodeURIComponent(company)}`)
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to generate cold email');

      setSubject(data.subject || `Application for Engineering Role at ${company}`);
      setEmailBody(data.body || JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating outreach email');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (preset: { company: string; desc: string }) => {
    setCompany(preset.company);
    setJobDesc(preset.desc);
  };

  const copyText = (text: string, type: 'subject' | 'body') => {
    navigator.clipboard.writeText(text);
    if (type === 'subject') {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } else {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pb-16 pt-2">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pt-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              AI Cold Email Generator
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
              Gemini AI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Craft tailored cold outreach emails that reference specific requirements and boost reply rates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-5">
            
            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Sample Roles
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.company}
                    onClick={() => loadPreset(preset)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors"
                  >
                    {preset.company}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Company */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Company Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3 text-purple-400" size={16} />
                <input
                  type="text"
                  placeholder="e.g. Stripe, Razorpay, Google, TechCorp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-purple-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Job Description or Core Requirements
              </label>
              <textarea
                placeholder="Paste the job description or required skills here..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={7}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-600 focus:outline-none resize-none transition-all leading-relaxed"
              />
              <span className="text-[11px] text-slate-400 mt-1 block text-right">
                {jobDesc.length} characters
              </span>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Outreach Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TONES.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold text-left transition-all border ${
                      selectedTone === tone.id
                        ? 'gradient-brand text-white border-transparent shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateEmail}
              disabled={loading || !jobDesc.trim() || !company.trim()}
              className="w-full py-3.5 text-white font-bold text-sm gradient-brand rounded-xl shadow-md hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Synthesizing Tailored Email...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate High-Impact Outreach</span>
                </>
              )}
            </button>

          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              Error: {error}
            </div>
          )}

        </div>

        {/* Right Column: Output / Preview */}
        <div className="lg:col-span-6">
          
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs h-full flex flex-col justify-between overflow-hidden min-h-[500px]">
            
            {!emailBody ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Mail size={28} />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">
                  Your Tailored Email Will Appear Here
                </h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Enter a target company and job description on the left, then click Generate.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between p-6 space-y-6">
                
                <div className="space-y-4">
                  
                  {/* Subject Line Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Subject Line
                      </label>
                      <button
                        onClick={() => copyText(subject, 'subject')}
                        className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                      >
                        {copiedSubject ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        <span>{copiedSubject ? 'Copied!' : 'Copy Subject'}</span>
                      </button>
                    </div>
                    <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs font-bold text-slate-900">
                      {subject}
                    </div>
                  </div>

                  {/* Body Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Email Message
                      </label>
                      <button
                        onClick={() => copyText(emailBody, 'body')}
                        className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                      >
                        {copiedBody ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        <span>{copiedBody ? 'Copied!' : 'Copy Body'}</span>
                      </button>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 font-normal leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto">
                      {emailBody}
                    </div>
                  </div>

                </div>

                {/* Direct Mail App Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => copyText(`${subject}\n\n${emailBody}`, 'body')}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Copy size={14} />
                    Copy Entire Outreach
                  </button>

                  <a
                    href={`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`}
                    className="py-2.5 px-5 rounded-xl gradient-brand text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all"
                  >
                    <Send size={14} />
                    Open in Mail
                  </a>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}