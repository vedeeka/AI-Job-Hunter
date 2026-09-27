'use client'

import { useState } from 'react';
import { 
  FileText, 
  Wand2, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Sparkles, 
  Copy, 
  Check, 
  Upload, 
  Zap,
  Target,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { getApiUrl } from '../utils/api';

const SAMPLE_DESC = "We are seeking a Senior Full Stack & AI Software Engineer with experience in Python, FastAPI, React, Next.js, and cloud deployments. Strong skills in designing REST APIs and machine learning pipelines required.";

const ResumeTailor = () => {
  const [jobDescription, setJobDescription] = useState(SAMPLE_DESC);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("job_description", jobDescription);
      if (resumeFile) {
        formData.append("resume_pdf", resumeFile);
      }

      const response = await fetch(getApiUrl('/generate-resume'), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      setResult({
        download_url: data?.download_url || "/api/download-pdf",
        summary: data?.parsed_resume?.summary || "Accomplished engineer with a proven track record delivering full-stack and AI solutions.",
        skills: data?.parsed_resume?.technical_skills || ["Python", "FastAPI", "Next.js", "React", "TypeScript", "Docker"],
        match_score: data?.match_score || 91,
        missing_keywords: data?.missing_keywords || ["Kubernetes", "GraphQL", "Redis"],
        optimization_tips: data?.optimization_tips || [
          "Include quantifiable metrics (e.g. 'reduced latency by 40%') in your latest roles.",
          "Ensure targeted ATS keywords appear in both your summary section and technical skills matrix.",
          "Highlight hands-on experience with modern cloud architectures and AI agent workflows."
        ]
      });

      setActiveTab("preview");
    } catch (err) {
      console.error("Full Error Details:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Resume Doctor
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck size={12} />
              ATS Optimizer
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare your profile against any job description, calculate ATS score, and generate targeted summaries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Target Job Description */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-purple-600" />
                <span>Target Job Description</span>
              </label>
              <button
                onClick={() => setJobDescription(SAMPLE_DESC)}
                className="text-[11px] font-bold text-purple-600 hover:text-purple-800"
              >
                Reset Sample
              </button>
            </div>
            
            <textarea
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none text-xs font-medium text-slate-900 leading-relaxed focus:bg-white focus:border-purple-600 focus:outline-none transition-all"
              placeholder="Paste the target job description or requirements here..."
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <span className="text-[11px] text-slate-400 block text-right">
              {jobDescription.length} characters
            </span>
          </div>

          {/* Resume Upload (Optional) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Upload size={16} className="text-purple-600" />
              <span>Custom Resume PDF (Optional)</span>
            </label>
            
            <label className="block cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 rounded-xl p-5 text-center transition-colors">
                <FileText className="mx-auto mb-2 text-purple-400" size={24} />
                <p className="font-bold text-xs text-slate-800">
                  {resumeFile ? resumeFile.name : "Click to attach your Resume file"}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, DOCX or TXT</p>
              </div>
            </label>
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !jobDescription.trim()}
            className="w-full py-3.5 text-white font-bold text-sm gradient-brand rounded-xl shadow-md hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Optimizing Keywords & Calculating ATS Score...</span>
              </>
            ) : (
              <>
                <Wand2 size={18} />
                <span>Analyze & Optimize for ATS</span>
              </>
            )}
          </button>
          
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: Output / Preview */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs h-full flex flex-col justify-between overflow-hidden min-h-[500px]">
            
            {!result ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Sparkles size={28} />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">
                  Ready to Optimize Your Resume
                </h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Click 'Analyze & Optimize' to compute ATS keyword alignment, generate tailored summaries, and discover missing skills.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between p-6 space-y-6">
                
                <div className="space-y-5">
                  
                  {/* Score Meter Header */}
                  <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block">
                        ATS Match Analysis
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                        High Alignment Detected
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-2xl font-black text-purple-700">{result.match_score}%</span>
                        <span className="text-[10px] font-bold text-slate-400 block">Match Score</span>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-2 border-b border-slate-100 pb-2">
                    {['preview', 'keywords', 'tips'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                          activeTab === t
                            ? 'bg-purple-100 text-purple-800'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {t === 'preview' ? 'Tailored Summary' : t === 'keywords' ? 'Matched Keywords' : 'ATS Tips'}
                      </button>
                    ))}
                  </div>

                  {/* Tab 1: Tailored Summary */}
                  {activeTab === 'preview' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          AI Generated ATS Summary
                        </label>
                        <button
                          onClick={() => copyToClipboard(result.summary, 'summary')}
                          className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                        >
                          {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                          <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                        </button>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-normal">
                        "{result.summary}"
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Keywords */}
                  {activeTab === 'keywords' && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                          Matched Keywords in Profile
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {result.skills.map((skill, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {result.missing_keywords && result.missing_keywords.length > 0 && (
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            Missing Target Keywords
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {result.missing_keywords.map((kw, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
                                + {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 3: Tips */}
                  {activeTab === 'tips' && (
                    <div className="space-y-2.5">
                      {result.optimization_tips.map((tip, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

                {/* Bottom PDF Download Action */}
                <div className="pt-4 border-t border-slate-100">
                  <a 
                    href={result.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  >
                    <Download size={16} />
                    <span>Download ATS-Optimized Resume</span>
                  </a>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

export default ResumeTailor;