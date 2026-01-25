'use client'

import { useState } from 'react';
import { 
  FileText, 
  Wand2, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowRight 
} from 'lucide-react';

const ResumeTailor = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Call your FastAPI Backend
      const response = await fetch('http://localhost:8000/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_description: jobDescription }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error("Failed to generate resume");

      // Simulating data if backend only returns URL (For demo purposes)
      // In production, your backend should return these fields
      setResult({
        download_url: data.download_url,
        summary: data.generated_summary || "AI has rewritten your summary to match the job requirements perfectly.",
        skills: data.highlighted_skills || ["Python", "FastAPI", "React", "Machine Learning"]
      });

    } catch (err) {
      setError("Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Resume <span className="text-indigo-600">Doctor</span>
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Paste a Job Description below. Our AI will rewrite your resume summary 
          and re-order your skills to pass the ATS bots.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Input */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
            <FileText size={20} className="text-indigo-600" />
            <span>Target Job Description</span>
          </div>
          
          <textarea
            className="flex-1 w-full p-4 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none resize-none text-sm leading-relaxed"
            placeholder="Paste the JD here (e.g. 'We are looking for a Python Engineer...')"
            rows={12}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            disabled={loading || !jobDescription}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Tailoring Resume...</span>
              </>
            ) : (
              <>
                <Wand2 size={20} />
                <span>Generate Tailored PDF</span>
              </>
            )}
          </button>
          
          {error && (
            <div className="mt-3 p-3 bg-red-50 text-red-600 text-sm rounded flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </div>

        {/* Right Column: Output / Preview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full relative overflow-hidden">
          {!result ? (
            // Empty State
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 opacity-60">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText size={32} />
              </div>
              <p className="text-sm">Result will appear here</p>
            </div>
          ) : (
            // Success State
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 p-3 rounded-lg">
                <CheckCircle size={20} />
                <span>Resume Optimized Successfully!</span>
              </div>

              {/* AI Insight: Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  New Professional Summary
                </h3>
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-gray-800 text-sm leading-relaxed relative">
                  "{result.summary}"
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold shadow-sm">
                    AI Generated
                  </div>
                </div>
              </div>

              {/* AI Insight: Skills */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Prioritized Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Download Action */}
              <div className="pt-6 border-t mt-auto">
                <a 
                  href={result.download_url} 
                  target="_blank"
                  download="Tailored_Resume.pdf"
                  className="flex items-center justify-between p-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-700 p-2 rounded-lg">
                      <FileText size={24} />
                    </div>
                    <div>
                      <div className="font-bold">Download PDF</div>
                      <div className="text-xs text-gray-400">ATS-Ready Format</div>
                    </div>
                  </div>
                  <Download className="group-hover:translate-y-1 transition-transform" size={24} />
                </a>
              </div>

            </div>
          )}
          
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
              <p className="text-gray-600 font-medium animate-pulse">Analyzing Keywords...</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ResumeTailor;