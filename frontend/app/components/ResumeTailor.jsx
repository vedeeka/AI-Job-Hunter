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
  Zap
} from 'lucide-react';

const ResumeTailor = () => {
  const [jobDescription, setJobDescription] = useState("");
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
    if (!jobDescription.trim() || !resumeFile) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("job_description", jobDescription);
      formData.append("resume_pdf", resumeFile);

      const response = await fetch("http://localhost:8000/generate-resume", {
        method: "POST",
        body: formData,
      });

      // 1. Check response status BEFORE parsing JSON
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // 2. Try parsing JSON, but log if it fails
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        throw new Error("Server returned 200 but response was not valid JSON");
      }

      console.log("Backend Response:", data); // Check your console for this!

      // 3. Defensive coding: Use optional chaining (?.) and fallback values
      // This prevents the app from crashing if 'parsed_resume' is missing
      setResult({
        download_url: data?.download_url || "#",
        summary: data?.parsed_resume?.summary || "Summary not available.",
        skills: data?.parsed_resume?.technical_skills || [],
        match_score: data?.match_score || 85, // Example fallback
        missing_keywords: data?.missing_keywords || [],
        optimization_tips: data?.optimization_tips || []
      });

      setActiveTab("preview");

    } catch (err) {
      // 4. Log the ACTUAL error to the console
      console.error("Full Error Details:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f3f0ff 50%, #faf8ff 100%)' }}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2" style={{ background: '#faf5ff', color: '#7c3aed', borderColor: '#e9d5ff' }}>
            <Sparkles size={16} />
            AI-Powered Resume Optimization
          </div>
          <h1 className="text-5xl font-black" style={{ color: '#1e1b4b' }}>
            Resume <span style={{ color: '#7c3aed' }}>Doctor</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed" style={{ color: '#6b7280' }}>
            Transform your resume to match any job description. Our AI analyzes keywords, optimizes your summary, and ensures you pass ATS screening.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Input */}
          <div className="space-y-6">
            
            {/* Job Description Input */}
            <div className="p-6 rounded-2xl border-2 shadow-sm" style={{ background: '#fff', borderColor: '#e9d5ff' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#c4b5fd'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e9d5ff'}>
              <div className="flex items-center gap-2 mb-4 font-semibold" style={{ color: '#1e1b4b' }}>
                <FileText size={20} style={{ color: '#7c3aed' }} />
                <span>Target Job Description</span>
              </div>
              
              <textarea
                className="w-full p-4 border-2 rounded-xl resize-none text-sm leading-relaxed focus:outline-none transition-all"
                style={{
                  borderColor: '#e9d5ff',
                  background: '#faf5ff',
                  color: '#1e1b4b'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#7c3aed';
                  e.currentTarget.style.background = '#fff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e9d5ff';
                  e.currentTarget.style.background = '#faf5ff';
                }}
                placeholder="Paste the job description here (e.g. 'We are looking for a Senior Python Engineer...')"
                rows={10}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />

              <div className="mt-4 text-xs" style={{ color: '#9ca3af' }}>
                {jobDescription.length} characters
              </div>
            </div>

            {/* Resume Upload */}
            <div className="p-6 rounded-2xl border-2 shadow-sm" style={{ background: '#fff', borderColor: '#e9d5ff' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#c4b5fd'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e9d5ff'}>
              <div className="flex items-center gap-2 mb-4 font-semibold" style={{ color: '#1e1b4b' }}>
                <Upload size={20} style={{ color: '#7c3aed' }} />
                <span>Your Resume (Optional)</span>
              </div>
              
              <label className="relative block cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div 
                  className="border-2 border-dashed rounded-xl p-6 text-center transition-all"
                  style={{
                    borderColor: '#e9d5ff',
                    background: '#faf5ff'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#7c3aed';
                    e.currentTarget.style.background = '#f3f0ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e9d5ff';
                    e.currentTarget.style.background = '#faf5ff';
                  }}
                >
                  <FileText className="mx-auto mb-2" size={28} style={{ color: '#a78bfa' }} />
                  <p className="font-medium" style={{ color: '#1e1b4b' }}>
                    {resumeFile ? resumeFile.name : "Click to upload or drag & drop"}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>PDF, DOC, DOCX or TXT</p>
                </div>
              </label>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !jobDescription}
              className="w-full text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              style={{
                background: loading || !jobDescription ? 'rgba(124, 58, 237, 0.5)' : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                cursor: loading || !jobDescription ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Optimizing Resume...</span>
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  <span>Generate Tailored Resume</span>
                </>
              )}
            </button>
            
            {error && (
              <div className="p-4 border-2 text-sm rounded-xl flex items-center gap-3" style={{ background: '#fee2e2', borderColor: '#fecaca', color: '#991b1b' }}>
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Right Column: Output / Preview */}
          <div className="rounded-2xl border-2 shadow-sm overflow-hidden flex flex-col min-h-[600px]" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
            
            {!result ? (
              // Empty State
              <div className="h-full flex flex-col items-center justify-center space-y-4 p-8" style={{ color: '#d1d5db' }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: '#faf5ff' }}>
                  <Sparkles size={40} style={{ color: '#c4b5fd' }} />
                </div>
                <p className="text-center">
                  <span className="block font-semibold" style={{ color: '#6b7280' }}>Paste a job description</span>
                  <span className="text-sm" style={{ color: '#9ca3af' }}>and click Generate to see your optimized resume</span>
                </p>
              </div>
            ) : (
              // Success State
              <div className="flex flex-col h-full">
                
                {/* Header Success Bar */}
                <div className="px-6 pt-6 pb-4 border-b-2" style={{ borderColor: '#e9d5ff' }}>
                  <div className="flex items-center gap-2 font-bold p-4 rounded-xl border-2 mb-4" style={{ background: '#f0fdf4', color: '#166534', borderColor: '#dcfce7' }}>
                    <CheckCircle size={20} />
                    <span>Resume Optimized Successfully!</span>
                  </div>

                  {/* Match Score */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold" style={{ color: '#6b7280' }}>ATS Match Score</span>
                      <span className="text-2xl font-bold" style={{ color: '#7c3aed' }}>{result.match_score}%</span>
                    </div>
                    <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: '#e9d5ff' }}>
                      <div 
                        className="h-full transition-all duration-1000"
                        style={{ background: 'linear-gradient(90deg, #7c3aed 0%, #6d28d9 100%)', width: `${result.match_score}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 px-6 pt-6 border-b-2" style={{ borderColor: '#e9d5ff' }}>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className="pb-3 px-2 font-semibold text-sm transition-all border-b-2"
                    style={{
                      color: activeTab === 'preview' ? '#7c3aed' : '#9ca3af',
                      borderColor: activeTab === 'preview' ? '#7c3aed' : 'transparent'
                    }}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('keywords')}
                    className="pb-3 px-2 font-semibold text-sm transition-all border-b-2"
                    style={{
                      color: activeTab === 'keywords' ? '#7c3aed' : '#9ca3af',
                      borderColor: activeTab === 'keywords' ? '#7c3aed' : 'transparent'
                    }}
                  >
                    Keywords
                  </button>
                  <button
                    onClick={() => setActiveTab('tips')}
                    className="pb-3 px-2 font-semibold text-sm transition-all border-b-2"
                    style={{
                      color: activeTab === 'tips' ? '#7c3aed' : '#9ca3af',
                      borderColor: activeTab === 'tips' ? '#7c3aed' : 'transparent'
                    }}
                  >
                    Tips
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                  
                  {activeTab === 'preview' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: '#6b7280' }}>
                          <Sparkles size={14} style={{ color: '#7c3aed' }} />
                          Professional Summary
                        </h3>
                        <div className="p-4 rounded-xl border-2 text-sm leading-relaxed relative" style={{ background: '#faf5ff', borderColor: '#e9d5ff', color: '#374151' }}>
                          <div className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded font-bold text-white" style={{ background: '#7c3aed' }}>
                            AI GENERATED
                          </div>
                          <p>"{result.summary}"</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'keywords' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: '#6b7280' }}>
                          <Zap size={14} style={{ color: '#7c3aed' }} />
                          Prioritized Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.skills.map((skill, i) => (
                            <span 
                              key={i} 
                              className="px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all"
                              style={{
                                background: '#faf5ff',
                                color: '#1e1b4b',
                                borderColor: '#e9d5ff'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f3f0ff';
                                e.currentTarget.style.borderColor = '#7c3aed';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#faf5ff';
                                e.currentTarget.style.borderColor = '#e9d5ff';
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {result.missing_keywords && result.missing_keywords.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#6b7280' }}>Missing Keywords</h3>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {result.missing_keywords.map((keyword, i) => (
                              <span 
                                key={i} 
                                className="px-3 py-1 rounded-lg text-xs font-medium border-2"
                                style={{
                                  background: '#fef2f2',
                                  color: '#991b1b',
                                  borderColor: '#fecaca'
                                }}
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'tips' && (
                    <div className="space-y-3 animate-in fade-in duration-300">
                      <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#6b7280' }}>Optimization Tips</h3>
                      {result.optimization_tips && result.optimization_tips.length > 0 ? (
                        result.optimization_tips.map((tip, i) => (
                          <div key={i} className="p-4 rounded-lg border-2 text-sm leading-relaxed" style={{ background: '#faf5ff', borderColor: '#e9d5ff', color: '#374151' }}>
                            <div className="flex gap-3">
                              <div className="font-bold flex-shrink-0" style={{ color: '#7c3aed' }}>{i + 1}.</div>
                              <div>{tip}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm" style={{ color: '#9ca3af' }}>No additional tips at this time.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Download Action */}
                <div className="px-6 pb-6 pt-6 border-t-2" style={{ borderColor: '#e9d5ff' }}>
                  <a 
                    href={result.download_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Tailored_Resume.pdf"
                    className="flex items-center justify-between p-4 text-white rounded-xl transition-all group cursor-pointer shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                        <Download size={24} />
                      </div>
                      <div>
                        <div className="font-bold">Download PDF</div>
                        <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>ATS-Ready Format</div>
                      </div>
                    </div>
                    <div className="group-hover:translate-y-1 transition-transform">
                      →
                    </div>
                  </a>
                </div>
              </div>
            )}
            
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.8)' }}>
                <Loader2 className="animate-spin mb-4" size={48} style={{ color: '#7c3aed' }} />
                <p className="font-semibold" style={{ color: '#1e1b4b' }}>Analyzing keywords...</p>
                <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Optimizing your resume</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumeTailor;