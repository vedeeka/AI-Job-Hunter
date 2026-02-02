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
    if (!url) return <span style={{ color: '#9ca3af' }}>—</span>;
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition" style={{ color: '#7c3aed' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
        <Icon size={16} />
        {label}
      </a>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f3f0ff 50%, #faf8ff 100%)' }}>
      {/* Header */}
      <div className="border-b-2" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold" style={{ color: '#1e1b4b' }}>Email Scraper</h1>
          <p className="mt-2" style={{ color: '#6b7280' }}>Find and extract business contacts from Google Maps</p>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Box */}
        <div className="rounded-lg shadow-sm border-2 p-6 mb-8" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
          <label className="block text-sm font-semibold mb-3" style={{ color: '#1e1b4b' }}>What are you looking for?</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isRunning}
              className="flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none disabled:opacity-50 transition"
              style={{
                borderColor: '#e9d5ff',
                background: '#fff',
                color: '#1e1b4b'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = '#e9d5ff'}
              placeholder="e.g., Software Companies in Ponda Goa"
            />
            <button
              onClick={startScraping}
              disabled={isRunning}
              className="text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
              style={{
                background: isRunning ? 'rgba(124, 58, 237, 0.6)' : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                cursor: isRunning ? 'not-allowed' : 'pointer'
              }}
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
          <div className="border-2 text-white px-4 py-3 rounded-lg mb-6" style={{ background: '#fee2e2', borderColor: '#fecaca', color: '#991b1b' }}>
            {error}
          </div>
        )}

        {/* Results */}
        <div className="rounded-lg shadow-sm border-2 overflow-hidden" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
          <div className="px-6 py-4 border-b-2 flex items-center justify-between" style={{ borderColor: '#e9d5ff' }}>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: '#1e1b4b' }}>Results</h2>
              <p className="text-sm mt-1" style={{ color: '#6b7280' }}>{results.length} found</p>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="px-6 py-12 text-center" style={{ color: '#6b7280' }}>
              {isRunning ? 'Searching… this may take a minute.' : 'No results yet.'}
            </div>
          ) : (
            <div style={{ borderTop: '1px solid #e9d5ff' }}>
              {results.map((row, i) => (
                <div key={i} style={{ borderBottom: '1px solid #e9d5ff' }}>
                  <button
                    onClick={() => setExpandedId(expandedId === i ? null : i)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between transition"
                    style={{ color: '#1e1b4b' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#faf5ff'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{row.Name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm" style={{ color: '#6b7280' }}>
                        {row.Website && (
                          <a href={row.Website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 transition" style={{ color: '#7c3aed' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                            <Globe size={14} />
                            Visit Site
                          </a>
                        )}
                        {row.Emails && (
                          <a href={`mailto:${row.Emails}`} className="flex items-center gap-1 transition" style={{ color: '#7c3aed' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                            <Mail size={14} />
                            {row.Emails}
                          </a>
                        )}
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      style={{ color: '#a78bfa', transition: 'transform 0.2s' }}
                      className={expandedId === i ? 'rotate-180' : ''}
                    />
                  </button>

                  {expandedId === i && (
                    <div className="px-6 py-4 border-t-2" style={{ background: '#faf5ff', borderColor: '#e9d5ff' }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-semibold uppercase" style={{ color: '#a78bfa' }}>Business Name</label>
                            <p className="font-medium mt-1" style={{ color: '#1e1b4b' }}>{row.Name}</p>
                          </div>

                          <div>
                            <label className="text-xs font-semibold uppercase" style={{ color: '#a78bfa' }}>Email</label>
                            {row.Emails ? (
                              <a href={`mailto:${row.Emails}`} className="mt-1 block break-all transition" style={{ color: '#7c3aed' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                                {row.Emails}
                              </a>
                            ) : (
                              <p className="mt-1" style={{ color: '#9ca3af' }}>—</p>
                            )}
                          </div>

                          <div>
                            <label className="text-xs font-semibold uppercase" style={{ color: '#a78bfa' }}>Website</label>
                            {row.Website ? (
                              <a href={row.Website} target="_blank" rel="noopener noreferrer" className="mt-1 block break-all transition" style={{ color: '#7c3aed' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                                {row.Website}
                              </a>
                            ) : (
                              <p className="mt-1" style={{ color: '#9ca3af' }}>—</p>
                            )}
                          </div>

                          <div>
                            <label className="text-xs font-semibold uppercase" style={{ color: '#a78bfa' }}>Status</label>
                            <p className="mt-1" style={{ color: '#1e1b4b' }}>{row.Status || '—'}</p>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-semibold uppercase" style={{ color: '#a78bfa' }}>Description</label>
                            <p className="mt-1" style={{ color: '#374151' }}>{row.description || '—'}</p>
                          </div>

                          <div>
                            <label className="text-xs font-semibold uppercase mb-3 block" style={{ color: '#a78bfa' }}>Social Media</label>
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
          <div className="mt-6 rounded-lg shadow-sm border-2 p-6 flex items-center justify-between" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
            <div>
              <h3 className="font-semibold" style={{ color: '#1e1b4b' }}>All results ready</h3>
              <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Download your scraped data as CSV</p>
            </div>
            <a
              href={downloadUrl}
              download
              className="text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
              style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}
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