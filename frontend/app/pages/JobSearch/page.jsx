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
    <div className="min-h-screen bg-white">
      <div className="p-8 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase size={32} color='black' />
            <h1 className="text-4xl font-bold text-gray-900">Job Pipeline</h1>
          </div>
          <p className="text-gray-600">Find internships & jobs instantly</p>
        </div>

        {/* Search Box */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
          <div className="grid md:grid-cols-2 gap-4 mb-4">

            {/* Keyword */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Role / Keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900"
                  placeholder="Machine Learning Intern"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900"
                  placeholder="Goa"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18}/> : <Search size={18}/>}
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            Error: {error}
          </div>
        )}

        {/* Results Table */}
        {jobs.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">

            <div className="p-4 border-b bg-gray-50 font-semibold text-gray-900">
              Results Found: {jobs.length}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">

                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    {Object.keys(jobs[0]).map((key) => (
                      <th key={key} className="px-4 py-3 font-semibold text-gray-700 uppercase text-xs">
                        {key.replace(/_/g, " ")}
                      </th>
                    ))}
                    <th className="px-4 py-3 font-semibold text-gray-700 uppercase text-xs">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {jobs.map((job, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      {Object.entries(job).map(([key, val], i) => (
                        <td key={i} className="px-4 py-3 text-gray-700">

                          {isLink(val) ? (
                            <a href={val} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
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
                          className="px-3 py-1.5 bg-gray-900 text-white text-xs rounded hover:bg-gray-800 transition"
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
          <div className="text-center text-gray-500 mt-16 py-12">
            <Briefcase size={40} className="mx-auto mb-3 text-gray-400" />
            <p>Enter keyword and location to search for jobs</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
              <button 
                onClick={() => setSelectedJob(null)}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {Object.entries(selectedJob).map(([key, val], index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 mb-2 uppercase text-sm">
                    {key.replace(/_/g, " ")}
                  </h3>
                  <div className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {isLink(val) ? (
                      <a href={val} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all flex items-center gap-2">
                        {val} <ExternalLink size={14} />
                      </a>
                    ) : Array.isArray(val) ? (
                      <div className="space-y-1">
                        {val.length === 0 ? (
                          <p>None</p>
                        ) : (
                          val.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="text-blue-600">•</span>
                              <span>{item.text || JSON.stringify(item)}</span>
                              {item.label && <span className="text-xs bg-gray-200 px-2 py-1 rounded">{item.label}</span>}
                            </div>
                          ))
                        )}
                      </div>
                    ) : val === null || val === undefined ? (
                      <p className="text-gray-500">-</p>
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