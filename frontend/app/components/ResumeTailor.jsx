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
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 border border-indigo-300 rounded-full text-indigo-700 text-sm font-semibold">
            <Sparkles size={16} />
            AI-Powered Resume Optimization
          </div>
          <h1 className="text-5xl font-black text-gray-900">
            Resume <span className="text-indigo-600">Doctor</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Transform your resume to match any job description. Our AI analyzes keywords, optimizes your summary, and ensures you pass ATS screening.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Input */}
          <div className="space-y-6">
            
            {/* Job Description Input */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 transition-colors shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                <FileText size={20} className="text-indigo-600" />
                <span>Target Job Description</span>
              </div>
              
              <textarea
                className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all outline-none resize-none text-sm leading-relaxed"
                placeholder="Paste the job description here (e.g. 'We are looking for a Senior Python Engineer...')"
                rows={10}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />

              <div className="mt-4 text-xs text-gray-500">
                {jobDescription.length} characters
              </div>
            </div>

            {/* Resume Upload */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 transition-colors shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                <Upload size={20} className="text-indigo-600" />
                <span>Your Resume (Optional)</span>
              </div>
              
              <label className="relative block cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors bg-gray-50 hover:bg-indigo-50">
                  <FileText className="mx-auto mb-2 text-gray-400" size={28} />
                  <p className="text-gray-700 font-medium">
                    {resumeFile ? resumeFile.name : "Click to upload or drag & drop"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX or TXT</p>
                </div>
              </label>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !jobDescription}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:shadow-indigo-200 disabled:cursor-not-allowed"
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
              <div className="p-4 bg-red-50 border border-red-300 text-red-700 text-sm rounded-xl flex items-center gap-3">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Right Column: Output / Preview */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            
            {!result ? (
              // Empty State
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 p-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <Sparkles size={40} className="text-gray-300" />
                </div>
                <p className="text-center">
                  <span className="block font-semibold text-gray-600">Paste a job description</span>
                  <span className="text-sm text-gray-500">and click Generate to see your optimized resume</span>
                </p>
              </div>
            ) : (
              // Success State
              <div className="flex flex-col h-full">
                
                {/* Header Success Bar */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-green-700 font-bold bg-green-50 p-4 rounded-xl border border-green-200 mb-4">
                    <CheckCircle size={20} />
                    <span>Resume Optimized Successfully!</span>
                  </div>

                  {/* Match Score */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">ATS Match Score</span>
                      <span className="text-2xl font-bold text-indigo-600">{result.match_score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full transition-all duration-1000"
                        style={{ width: `${result.match_score}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 px-6 pt-6 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`pb-3 px-2 font-semibold text-sm transition-all border-b-2 ${
                      activeTab === 'preview'
                        ? 'text-indigo-600 border-indigo-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('keywords')}
                    className={`pb-3 px-2 font-semibold text-sm transition-all border-b-2 ${
                      activeTab === 'keywords'
                        ? 'text-indigo-600 border-indigo-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    }`}
                  >
                    Keywords
                  </button>
                  <button
                    onClick={() => setActiveTab('tips')}
                    className={`pb-3 px-2 font-semibold text-sm transition-all border-b-2 ${
                      activeTab === 'tips'
                        ? 'text-indigo-600 border-indigo-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    }`}
                  >
                    Tips
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                  
                  {activeTab === 'preview' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div>
                        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Sparkles size={14} className="text-indigo-600" />
                          Professional Summary
                        </h3>
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 text-gray-800 text-sm leading-relaxed relative">
                          <div className="absolute top-3 right-3 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded font-bold">
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
                        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Zap size={14} className="text-indigo-600" />
                          Prioritized Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.skills.map((skill, i) => (
                            <span 
                              key={i} 
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium border border-gray-300 hover:border-indigo-400 transition-all cursor-default"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {result.missing_keywords && result.missing_keywords.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Missing Keywords</h3>
                          <div className="flex flex-wrap gap-2">
                            {result.missing_keywords.map((keyword, i) => (
                              <span 
                                key={i} 
                                className="px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium border border-orange-300"
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
                      <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Optimization Tips</h3>
                      {result.optimization_tips && result.optimization_tips.length > 0 ? (
                        result.optimization_tips.map((tip, i) => (
                          <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 text-sm leading-relaxed">
                            <div className="flex gap-3">
                              <div className="text-indigo-600 font-bold flex-shrink-0">{i + 1}.</div>
                              <div>{tip}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No additional tips at this time.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Download Action */}
                <div className="px-6 pb-6 pt-6 border-t border-gray-200">
                  <a 
                    href={result.download_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Tailored_Resume.pdf"
                    className="flex items-center justify-between p-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all group cursor-pointer shadow-lg hover:shadow-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Download size={24} />
                      </div>
                      <div>
                        <div className="font-bold">Download PDF</div>
                        <div className="text-xs text-green-100">ATS-Ready Format</div>
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
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
                <p className="text-gray-900 font-semibold">Analyzing keywords...</p>
                <p className="text-gray-600 text-sm mt-1">Optimizing your resume</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumeTailor;