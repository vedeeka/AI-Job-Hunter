'use client'
import { useState } from 'react';
import { Search, MapPin, Loader2, Briefcase, X, ExternalLink } from 'lucide-react';

const JobSearch = () => {
  const [keyword, setKeyword] = useState("Intern");
  const [location, setLocation] = useState("Goa");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setJobs([]);

    try {
      const response = await fetch('http://localhost:8000/run-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, location, max_jobs: 10 }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Search failed");

      setJobs(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderValue = (val) => {
    if (val === null || val === undefined) return "-";

    if (Array.isArray(val)) {
      if (val.length === 0) return "None";
      return val.map(ent => `${ent.text} (${ent.label})`).join(", ");
    }

    if (typeof val === "object") {
      return JSON.stringify(val);
    }

    const str = String(val);
    return str.length > 60 ? str.substring(0, 60) + "..." : str;
  };

  const isLink = (val) => typeof val === "string" && val.startsWith("http");

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f3f0ff 50%, #faf8ff 100%)' }}>
      <div className="p-8 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' }}>
              <Briefcase size={32} color='white' />
            </div>
            <h1 className="text-4xl font-bold" style={{ color: '#1e1b4b' }}>Job search</h1>
          </div>
          <p style={{ color: '#6b7280' }}>Find internships & jobs instantly</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Card */}
          <div className="p-4 rounded-lg border-2" style={{ borderColor: '#e9d5ff', background: '#faf5ff' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded" style={{ background: '#7c3aed' }}>
                <Briefcase size={18} color='white' />
              </div>
              <span className="text-xs font-semibold" style={{ color: '#7c3aed' }}>TOTAL</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#1e1b4b' }}>{jobs.length || 0}</p>
          </div>

          {/* Filtered Card */}
          <div className="p-4 rounded-lg border-2" style={{ borderColor: '#dbeafe', background: '#eff6ff' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded" style={{ background: '#3b82f6' }}>
                <Search size={18} color='white' />
              </div>
              <span className="text-xs font-semibold" style={{ color: '#3b82f6' }}>FILTERED</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#1e40af' }}>{jobs.length || 0}</p>
          </div>

          {/* Saved Card */}
          <div className="p-4 rounded-lg border-2" style={{ borderColor: '#dcfce7', background: '#f0fdf4' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded" style={{ background: '#16a34a' }}>
                <Search size={18} color='white' />
              </div>
              <span className="text-xs font-semibold" style={{ color: '#16a34a' }}>SAVED</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#15803d' }}>0</p>
          </div>

          {/* Applied Card */}
          <div className="p-4 rounded-lg border-2" style={{ borderColor: '#ffe4e6', background: '#fff7f8' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded" style={{ background: '#ef4444' }}>
                <Search size={18} color='white' />
              </div>
              <span className="text-xs font-semibold" style={{ color: '#ef4444' }}>APPLIED</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#7f1d1d' }}>0</p>
          </div>
        </div>

        {/* Search Box */}
        <div className="rounded-lg p-6 mb-8 border-2" style={{ borderColor: '#e9d5ff', background: '#faf5ff' }}>
          <div className="grid md:grid-cols-2 gap-4 mb-4">

            {/* Keyword */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1e1b4b' }}>Role / Keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-3" size={18} style={{ color: '#a78bfa' }} />
                <input 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none transition"
                  style={{
                    borderColor: '#e9d5ff',
                    background: '#fff',
                    color: '#1e1b4b'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
                  onBlur={(e) => e.target.style.borderColor = '#e9d5ff'}
                  placeholder="Machine Learning Intern"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1e1b4b' }}>Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3" size={18} style={{ color: '#a78bfa' }} />
                <input 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none transition"
                  style={{
                    borderColor: '#e9d5ff',
                    background: '#fff',
                    color: '#1e1b4b'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
                  onBlur={(e) => e.target.style.borderColor = '#e9d5ff'}
                  placeholder="Goa"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2.5 text-white rounded-lg flex items-center gap-2 transition font-semibold"
            style={{
              background: loading ? 'rgba(124, 58, 237, 0.6)' : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={18}/> : <Search size={18}/>}
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="border-2 text-white p-4 rounded-lg mb-6" style={{ borderColor: '#fecaca', background: '#fee2e2' }}>
            <p style={{ color: '#7f1d1d' }}>Error: {error}</p>
          </div>
        )}

        {/* Results Table */}
        {jobs.length > 0 && (
          <div className="border-2 rounded-lg overflow-hidden" style={{ borderColor: '#e9d5ff' }}>

            <div className="p-4 border-b-2 font-semibold" style={{ borderColor: '#e9d5ff', background: '#faf5ff', color: '#1e1b4b' }}>
              Results Found: {jobs.length}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">

                <thead style={{ background: '#f3f0ff', borderBottom: '2px solid #e9d5ff' }}>
                  <tr>
                    {Object.keys(jobs[0]).map((key) => (
                      <th key={key} className="px-4 py-3 font-semibold uppercase text-xs" style={{ color: '#7c3aed' }}>
                        {key.replace(/_/g, " ")}
                      </th>
                    ))}
                    <th className="px-4 py-3 font-semibold uppercase text-xs" style={{ color: '#7c3aed' }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.map((job, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e9d5ff' }} onMouseEnter={(e) => e.currentTarget.style.background = '#faf5ff'} onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}>
                      {Object.entries(job).map(([key, val], i) => (
                        <td key={i} className="px-4 py-3" style={{ color: '#374151' }}>

                          {isLink(val) ? (
                            <a href={val} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline transition" style={{ color: '#7c3aed' }}>
                              Open Link <ExternalLink size={14} />
                            </a>
                          ) : (
                            renderValue(val)
                          )}

                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => setSelectedJob(job)}
                          className="px-3 py-1.5 text-white text-xs rounded font-semibold transition"
                          style={{
                            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                          onMouseLeave={(e) => e.target.style.opacity = '1'}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && !error && (
          <div className="text-center mt-16 py-12">
            <div className="p-3 rounded-full w-fit mx-auto mb-3" style={{ background: '#f3f0ff' }}>
              <Briefcase size={40} style={{ color: '#c4b5fd' }} />
            </div>
            <p style={{ color: '#9ca3af' }}>Enter keyword and location to search for jobs</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto border-2" style={{ borderColor: '#e9d5ff' }}>
            
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b-2" style={{ borderColor: '#e9d5ff', background: '#faf5ff' }}>
              <h2 className="text-xl font-bold" style={{ color: '#1e1b4b' }}>Job Details</h2>
              <button 
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded transition"
                onMouseEnter={(e) => e.target.style.background = '#f3f0ff'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                style={{ color: '#7c3aed' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {Object.entries(selectedJob).map(([key, val], index) => (
                <div key={index}>
                  <h3 className="font-semibold mb-2 uppercase text-sm" style={{ color: '#1e1b4b' }}>
                    {key.replace(/_/g, " ")}
                  </h3>
                  <div className="p-3 rounded-lg" style={{ background: '#faf5ff', borderLeft: '4px solid #7c3aed', color: '#374151' }}>
                    {isLink(val) ? (
                      <a href={val} target="_blank" rel="noopener noreferrer" className="hover:underline break-all flex items-center gap-2 transition" style={{ color: '#7c3aed' }}>
                        {val} <ExternalLink size={14} />
                      </a>
                    ) : Array.isArray(val) ? (
                      <div className="space-y-1">
                        {val.length === 0 ? (
                          <p>None</p>
                        ) : (
                          val.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span style={{ color: '#7c3aed' }}>•</span>
                              <span>{item.text || JSON.stringify(item)}</span>
                              {item.label && <span className="text-xs px-2 py-1 rounded" style={{ background: '#e9d5ff', color: '#7c3aed' }}>{item.label}</span>}
                            </div>
                          ))
                        )}
                      </div>
                    ) : val === null || val === undefined ? (
                      <p style={{ color: '#9ca3af' }}>-</p>
                    ) : (
                      <p className="whitespace-pre-wrap break-words">{String(val)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearch;