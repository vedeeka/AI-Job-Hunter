'use client'
import { useState } from 'react';
import { Play, Download, Loader2, Globe, Mail, ChevronDown, Linkedin, Facebook, Twitter, Instagram } from 'lucide-react';

interface BusinessResult {
  Name: string;
  Website?: string;
  Emails?: string;
  description?: string;
  LinkedIn?: string;
  Facebook?: string;
  Twitter?: string;
  Instagram?: string;
  Status?: string;
}

export default function ScraperPage() {
  const [query, setQuery] = useState('Software Companies in Ponda Goa');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BusinessResult[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const startScraping = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setResults([]);
    setDownloadUrl(null);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8000/email-map-search?query=${encodeURIComponent(query)}`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setResults(data.data);
      setDownloadUrl(data.file_url);
    } catch (err) {
      setError('Failed to run scraper');
    } finally {
      setIsRunning(false);
    }
  };

  const SocialLink = ({ url, icon: Icon, label }: { url?: string; icon: any; label: string }) => {
    if (!url) return <span className="text-slate-400">—</span>;
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
        <Icon size={16} />
        {label}
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-slate-900">Email Scraper</h1>
          <p className="text-slate-600 mt-2">Find and extract business contacts from Google Maps</p>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Box */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <label className="block text-sm font-semibold text-slate-900 mb-3">What are you looking for?</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isRunning}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50"
              placeholder="e.g., Software Companies in Ponda Goa"
            />
            <button
              onClick={startScraping}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              {isRunning ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Start
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Results</h2>
              <p className="text-sm text-slate-600 mt-1">{results.length} found</p>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-600">
              {isRunning ? 'Searching… this may take a minute.' : 'No results yet.'}
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {results.map((row, i) => (
                <div key={i} className="hover:bg-slate-50 transition">
                  <button
                    onClick={() => setExpandedId(expandedId === i ? null : i)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{row.Name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                        {row.Website && (
                          <a href={row.Website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                            <Globe size={14} />
                            Visit Site
                          </a>
                        )}
                        {row.Emails && (
                          <a href={`mailto:${row.Emails}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                            <Mail size={14} />
                            {row.Emails}
                          </a>
                        )}
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-slate-400 transition-transform flex-shrink-0 ml-4 ${expandedId === i ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {expandedId === i && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Business Name</label>
                            <p className="text-slate-900 font-medium mt-1">{row.Name}</p>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                            {row.Emails ? (
                              <a href={`mailto:${row.Emails}`} className="text-blue-600 hover:text-blue-700 mt-1 block break-all">
                                {row.Emails}
                              </a>
                            ) : (
                              <p className="text-slate-400 mt-1">—</p>
                            )}
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Website</label>
                            {row.Website ? (
                              <a href={row.Website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 mt-1 block break-all">
                                {row.Website}
                              </a>
                            ) : (
                              <p className="text-slate-400 mt-1">—</p>
                            )}
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                            <p className="text-slate-900 mt-1">{row.Status || '—'}</p>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
                            <p className="text-slate-700 mt-1">{row.description || '—'}</p>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase mb-3 block">Social Media</label>
                            <div className="space-y-2">
                              <SocialLink url={row.LinkedIn} icon={Linkedin} label="LinkedIn" />
                              <SocialLink url={row.Facebook} icon={Facebook} label="Facebook" />
                              <SocialLink url={row.Twitter} icon={Twitter} label="Twitter" />
                              <SocialLink url={row.Instagram} icon={Instagram} label="Instagram" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {downloadUrl && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">All results ready</h3>
              <p className="text-sm text-slate-600 mt-1">Download your scraped data as CSV</p>
            </div>
            <a
              href={downloadUrl}
              download
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              <Download size={20} />
              CSV File
            </a>
          </div>
        )}
      </div>
    </div>
  );
}