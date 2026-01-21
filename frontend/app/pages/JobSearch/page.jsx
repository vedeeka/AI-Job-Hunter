'use client'
import { useState } from 'react';
import { Search, MapPin, Loader2, Download } from 'lucide-react';

const JobSearch = () => {
  // Input State
  const [keyword, setKeyword] = useState("Intern");
  const [location, setLocation] = useState("Goa");
  
  // Data State
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to call your Python API
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
      
      setJobs(result.data); // This is your CSV data as JSON
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🚀 AI Job Pipeline</h1>

      {/* --- Search Controls --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-end mb-8">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Role / Keyword</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Machine Learning Intern"
            />
          </div>
        </div>

        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Mumbai, Remote"
            />
          </div>
        </div>

        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Run Pipeline"}
        </button>
      </div>

      {/* --- Error Message --- */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          ⚠️ Error: {error}
        </div>
      )}

      {/* --- Results Table (The CSV Data) --- */}
      {jobs.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-700">Results ({jobs.length} Found)</h2>
            <button className="text-sm text-indigo-600 flex items-center gap-1 hover:underline">
              <Download size={16} /> Export CSV
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
                <tr>
                  {/* Dynamically get headers from first row */}
                  {Object.keys(jobs[0]).map((key) => (
                    <th key={key} className="px-6 py-3">{key.replace(/_/g, " ")}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobs.map((job, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(job).map((val, i) => (
                      <td key={i} className="px-6 py-4 whitespace-nowrap">
                        {/* Shorten long text */}
                        {String(val).length > 50 ? String(val).substring(0, 50) + "..." : val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearch;