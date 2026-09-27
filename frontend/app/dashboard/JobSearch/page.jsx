'use client'

import { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Loader2, 
  Briefcase, 
  X, 
  ExternalLink, 
  Download, 
  Sparkles, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { getApiUrl } from '../../utils/api';

const QUICK_TAGS = [
  { label: 'Machine Learning', query: 'Machine Learning' },
  { label: 'AI Engineer', query: 'AI Engineer' },
  { label: 'Full Stack', query: 'Full Stack' },
  { label: 'Python Developer', query: 'Python Developer' },
  { label: 'Software Intern', query: 'Software Intern' }
];

const JobSearch = () => {
  const [keyword, setKeyword] = useState("Software Intern");
  const [location, setLocation] = useState("Goa");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // Run initial search automatically
  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async (kw = keyword, loc = location) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getApiUrl('/run-search'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: kw, location: loc, max_jobs: 12 }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Search failed");

      setJobs(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tagQuery) => {
    setKeyword(tagQuery);
    handleSearch(tagQuery, location);
  };

  const downloadJobsCsv = () => {
    if (!jobs || jobs.length === 0) return;
    const keys = ['title', 'company', 'location', 'date_posted', 'link', 'description'];
    const csvRows = [
      keys.join(','),
      ...jobs.map(row => 
        keys.map(k => {
          const val = row[k];
          const str = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
          return `"${str.replace(/"/g, '""')}"`;
        }).join(',')
      )
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobs_${keyword.replace(/\s+/g, '_')}_${location}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pb-16 pt-2">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pt-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Job Discovery Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
              Live Scraper
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Search live tech positions, extract requirements, and export matching jobs to CSV.
          </p>
        </div>

        {jobs.length > 0 && (
          <button
            onClick={downloadJobsCsv}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <Download size={14} />
            Export CSV ({jobs.length})
          </button>
        )}
      </div>

      {/* Search Filter Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs mb-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
          
          {/* Keyword Input */}
          <div className="md:col-span-6 relative">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Role or Keyword
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 text-purple-400" size={16} />
              <input 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-purple-600 focus:outline-none transition-all"
                placeholder="e.g. Machine Learning, Python, Full Stack"
              />
            </div>
          </div>

          {/* Location Input */}
          <div className="md:col-span-4 relative">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 text-purple-400" size={16} />
              <input 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-purple-600 focus:outline-none transition-all"
                placeholder="e.g. Goa, Remote, Bangalore"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-2 flex items-end">
            <button 
              onClick={() => handleSearch()}
              disabled={loading}
              className="w-full py-2.5 px-5 text-white font-bold text-sm gradient-brand rounded-xl shadow-md hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
              <span>{loading ? "Searching..." : "Search"}</span>
            </button>
          </div>

        </div>

        {/* Quick Suggestion Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} className="text-purple-600" />
            Trending:
          </span>
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag.label}
              onClick={() => handleTagClick(tag.query)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-slate-200/80 transition-colors"
            >
              {tag.label}
            </button>
          ))}
        </div>

      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold mb-6">
          Notice: {error} (Displaying available tech job matches)
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
              <div className="h-4 bg-slate-100 rounded-md w-3/4" />
              <div className="h-3 bg-slate-100 rounded-md w-1/2" />
              <div className="h-12 bg-slate-100 rounded-md" />
              <div className="h-8 bg-slate-100 rounded-md" />
            </div>
          ))}
        </div>
      )}

      {/* Results Grid */}
      {!loading && jobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Matched Roles ({jobs.length})
            </span>
            <span className="text-xs text-slate-500 font-medium">Click any card to inspect full requirements</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Briefcase size={18} />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active Role
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {job.title || "Software Engineering Role"}
                  </h3>

                  <div className="space-y-1.5 mb-4 text-xs font-medium text-slate-500">
                    <p className="flex items-center gap-1.5 text-slate-700 font-semibold truncate">
                      <Building2 size={13} className="text-purple-500 flex-shrink-0" />
                      <span>{job.company || "Technology Company"}</span>
                    </p>
                    <p className="flex items-center gap-1.5 truncate">
                      <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                      <span>{job.location || location}</span>
                    </p>
                    {job.date_posted && (
                      <p className="flex items-center gap-1.5 text-slate-400">
                        <Calendar size={13} />
                        <span>{job.date_posted}</span>
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-6">
                    {job.description || "Exciting role working with modern software development, APIs, machine learning pipelines, and cloud systems."}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="flex-1 py-2 px-3 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors text-center"
                  >
                    View Details
                  </button>

                  {job.link && (
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 text-xs font-bold rounded-xl gradient-brand text-white shadow-2xs hover:shadow-md transition-all flex items-center gap-1"
                    >
                      <span>Apply</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && jobs.length === 0 && !error && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-8">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Jobs Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Try adjusting your search keyword or location to explore other roles.
          </p>
          <button
            onClick={() => handleSearch('Software Engineer', 'Remote')}
            className="px-5 py-2.5 rounded-xl gradient-brand text-white text-xs font-bold shadow-md"
          >
            Search Remote Software Engineer Roles
          </button>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-slate-200 shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block mb-1">
                  Job Specifications
                </span>
                <h2 className="text-xl font-black text-slate-900">{selectedJob.title}</h2>
                <p className="text-xs font-bold text-slate-600 mt-0.5">{selectedJob.company} • {selectedJob.location}</p>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  Full Description & Scope
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedJob.description || "No description provided."}
                </div>
              </div>

              {selectedJob.entities_in_job && selectedJob.entities_in_job.length > 0 && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                    Extracted NER Entities
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.entities_in_job.map((ent, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
                        {ent.text} <span className="opacity-50 text-[10px]">({ent.label})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/dashboard/resume"
                className="px-4 py-2 text-xs font-bold rounded-xl border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center gap-1.5"
              >
                <FileText size={14} />
                Tailor Resume for this Job
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
                {selectedJob.link && (
                  <a
                    href={selectedJob.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 text-xs font-bold rounded-xl gradient-brand text-white shadow-sm flex items-center gap-1.5"
                  >
                    <span>Open Application</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default JobSearch;