'use client'
import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Play, 
  Download, 
  Loader2, 
  Globe, 
  Mail, 
  ChevronDown, 
  Linkedin, 
  Facebook, 
  Twitter, 
  Instagram,
  Table,
  LayoutGrid,
  FileSpreadsheet,
  Search,
  Filter,
  Upload,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Eye,
  X
} from 'lucide-react';
import { getApiUrl } from '../../utils/api';

export interface BusinessResult {
  Name: string;
  Website?: string;
  Emails?: string;
  description?: string;
  LinkedIn?: string;
  Facebook?: string;
  Twitter?: string;
  Instagram?: string;
  Status?: string;
  MapsURL?: string;
}

function parseCSV(text: string): BusinessResult[] {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const headers = parseLine(lines[0]).map(h => h.trim());
  const rows: BusinessResult[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] || '';
    });

    rows.push({
      Name: obj['Name'] || '',
      Website: obj['Website'] || '',
      Emails: obj['Emails'] || '',
      description: obj['Site_Description'] || obj['Site_Title'] || '',
      LinkedIn: obj['LinkedIn'] || '',
      Facebook: obj['Facebook'] || '',
      Twitter: obj['Twitter'] || '',
      Instagram: obj['Instagram'] || '',
      Status: obj['Emails'] ? 'Verified Email' : 'Extracted',
      MapsURL: obj['MapsURL'] || ''
    });
  }

  return rows;
}

export default function ScraperPage() {
  const [query, setQuery] = useState('Software Companies in Pune Goa');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BusinessResult[]>([]);
  const [rawCsvText, setRawCsvText] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'raw'>('table');
  const [tableSearch, setTableSearch] = useState('');
  const [emailFilterOnly, setEmailFilterOnly] = useState(false);
  const [selectedLead, setSelectedLead] = useState<BusinessResult | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copiedCsv, setCopiedCsv] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-load sample CSV leads on mount
  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = async () => {
    setIsLoadingSample(true);
    setError(null);
    try {
      // First try fetching raw CSV from public directory
      const res = await fetch('/data/leads.csv');
      if (res.ok) {
        const text = await res.text();
        setRawCsvText(text);
        const parsed = parseCSV(text);
        if (parsed.length > 0) {
          setResults(parsed);
          setDownloadUrl('/data/leads.csv');
          setIsLoadingSample(false);
          return;
        }
      }

      // Fallback: fetch via API endpoint
      const apiRes = await fetch(getApiUrl('/email-map-search?query=Software'));
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data.data && data.data.length > 0) {
          setResults(data.data);
          setDownloadUrl('/api/download');
        }
      }
    } catch (err: any) {
      console.warn('Could not auto-load sample leads:', err);
    } finally {
      setIsLoadingSample(false);
    }
  };

  const startScraping = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setResults([]);
    setDownloadUrl(null);
    setError(null);

    try {
      const res = await fetch(getApiUrl(`/email-map-search?query=${encodeURIComponent(query)}`), {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setResults(data.data || []);
      setDownloadUrl(data.file_url || '/api/download');
      
      // Update raw CSV representation
      if (data.data && data.data.length > 0) {
        const headers = ['Name', 'Website', 'Emails', 'description', 'LinkedIn', 'Facebook', 'Twitter', 'Instagram', 'Status'];
        const csvRows = [
          headers.join(','),
          ...data.data.map((r: BusinessResult) => 
            headers.map(h => `"${String((r as any)[h] || '').replace(/"/g, '""')}"`).join(',')
          )
        ];
        setRawCsvText(csvRows.join('\n'));
      }
    } catch (err) {
      setError('Failed to run scraper. Showing available lead records.');
      loadSampleData();
    } finally {
      setIsRunning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        setRawCsvText(text);
        const parsed = parseCSV(text);
        if (parsed.length > 0) {
          setResults(parsed);
          setError(null);
        } else {
          setError('Could not parse any records from the uploaded CSV.');
        }
      }
    };
    reader.readAsText(file);
  };

  const exportClientCsv = () => {
    if (!results || results.length === 0) return;
    const headers = ['Name', 'Website', 'Emails', 'description', 'LinkedIn', 'Facebook', 'Twitter', 'Instagram', 'Status'];
    const csvRows = [
      headers.join(','),
      ...filteredResults.map(r => 
        headers.map(h => `"${String((r as any)[h] || '').replace(/"/g, '""')}"`).join(',')
      )
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_data_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, type: 'email' | 'csv') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(text);
      setTimeout(() => setCopiedEmail(null), 2000);
    } else {
      setCopiedCsv(true);
      setTimeout(() => setCopiedCsv(false), 2000);
    }
  };

  // Filtered dataset based on table search & email toggle
  const filteredResults = useMemo(() => {
    return results.filter(item => {
      if (emailFilterOnly && (!item.Emails || item.Emails.trim() === '')) {
        return false;
      }
      if (!tableSearch.trim()) return true;
      const search = tableSearch.toLowerCase();
      return (
        item.Name.toLowerCase().includes(search) ||
        (item.Website && item.Website.toLowerCase().includes(search)) ||
        (item.Emails && item.Emails.toLowerCase().includes(search)) ||
        (item.description && item.description.toLowerCase().includes(search))
      );
    });
  }, [results, tableSearch, emailFilterOnly]);

  const stats = useMemo(() => {
    const total = results.length;
    const withEmail = results.filter(r => r.Emails && r.Emails.trim().length > 0).length;
    const withWebsite = results.filter(r => r.Website && r.Website.trim().length > 0).length;
    const withSocial = results.filter(r => r.LinkedIn || r.Facebook || r.Twitter || r.Instagram).length;
    return { total, withEmail, withWebsite, withSocial };
  }, [results]);

  const SocialLink = ({ url, icon: Icon, label }: { url?: string; icon: any; label: string }) => {
    if (!url) return <span style={{ color: '#d1d5db' }}>—</span>;
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition" 
        style={{ color: '#7c3aed', background: '#f3f0ff' }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#e9d5ff'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#f3f0ff'}
      >
        <Icon size={13} />
        {label}
      </a>
    );
  };

  return (
    <div className="min-h-screen pb-16" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f3f0ff 50%, #faf8ff 100%)' }}>
      
      {/* Header */}
      <div className="border-b-2" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 text-xs font-bold rounded-full border-2" style={{ background: '#faf5ff', color: '#7c3aed', borderColor: '#e9d5ff' }}>
                  <FileSpreadsheet size={13} className="inline mr-1" />
                  CSV Data Explorer & Scraper
                </span>
              </div>
              <h1 className="text-3xl font-extrabold" style={{ color: '#1e1b4b' }}>
                Google Maps Lead Scraper & CSV Viewer
              </h1>
              <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>
                Extract, visualize, search, and export business leads & verified emails from Google Maps.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".csv" 
                className="hidden" 
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-lg border-2 text-sm font-semibold flex items-center gap-2 transition"
                style={{ borderColor: '#e9d5ff', background: '#fff', color: '#1e1b4b' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#7c3aed'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e9d5ff'}
              >
                <Upload size={16} style={{ color: '#7c3aed' }} />
                Upload CSV
              </button>

              <button
                onClick={loadSampleData}
                disabled={isLoadingSample}
                className="px-4 py-2.5 rounded-lg border-2 text-sm font-semibold flex items-center gap-2 transition"
                style={{ borderColor: '#e9d5ff', background: '#faf5ff', color: '#7c3aed' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f0ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#faf5ff'}
              >
                <RefreshCw size={16} className={isLoadingSample ? 'animate-spin' : ''} />
                Load Sample CSV
              </button>

              <button
                onClick={exportClientCsv}
                disabled={results.length === 0}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center gap-2 shadow-md transition disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}
              >
                <Download size={16} />
                Export CSV ({filteredResults.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border-2 shadow-sm" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#7c3aed' }}>TOTAL LEADS</span>
            <p className="text-3xl font-extrabold mt-1" style={{ color: '#1e1b4b' }}>{stats.total}</p>
            <span className="text-xs" style={{ color: '#6b7280' }}>CSV records loaded</span>
          </div>

          <div className="p-4 rounded-xl border-2 shadow-sm" style={{ background: '#fff', borderColor: '#dcfce7' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#16a34a' }}>VERIFIED EMAILS</span>
            <p className="text-3xl font-extrabold mt-1" style={{ color: '#15803d' }}>{stats.withEmail}</p>
            <span className="text-xs" style={{ color: '#6b7280' }}>Direct contact available</span>
          </div>

          <div className="p-4 rounded-xl border-2 shadow-sm" style={{ background: '#fff', borderColor: '#dbeafe' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#3b82f6' }}>WEBSITES FOUND</span>
            <p className="text-3xl font-extrabold mt-1" style={{ color: '#1e40af' }}>{stats.withWebsite}</p>
            <span className="text-xs" style={{ color: '#6b7280' }}>Domain sites indexed</span>
          </div>

          <div className="p-4 rounded-xl border-2 shadow-sm" style={{ background: '#fff', borderColor: '#fef08a' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#ca8a04' }}>SOCIAL PROFILES</span>
            <p className="text-3xl font-extrabold mt-1" style={{ color: '#854d0e' }}>{stats.withSocial}</p>
            <span className="text-xs" style={{ color: '#6b7280' }}>LinkedIn, FB, IG, Twitter</span>
          </div>
        </div>

        {/* Search / Scrape Input Box */}
        <div className="rounded-xl shadow-sm border-2 p-6 mb-8" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
          <label className="block text-sm font-bold mb-2" style={{ color: '#1e1b4b' }}>
            Search Keyword / Location for Live Google Maps Scraping
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5" size={18} style={{ color: '#a78bfa' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startScraping()}
                disabled={isRunning}
                className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none disabled:opacity-50 transition text-sm font-medium"
                style={{
                  borderColor: '#e9d5ff',
                  background: '#faf5ff',
                  color: '#1e1b4b'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c3aed';
                  e.target.style.background = '#fff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9d5ff';
                  e.target.style.background = '#faf5ff';
                }}
                placeholder="e.g., Software Companies in Pune, IT Firms in Goa"
              />
            </div>

            <button
              onClick={startScraping}
              disabled={isRunning || !query.trim()}
              className="text-white px-7 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-md whitespace-nowrap"
              style={{
                background: isRunning || !query.trim() ? 'rgba(124, 58, 237, 0.5)' : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                cursor: isRunning || !query.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              {isRunning ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Extracting Leads...
                </>
              ) : (
                <>
                  <Play size={18} />
                  Run Scraper
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="border-2 px-4 py-3 rounded-xl mb-6 flex items-center justify-between" style={{ background: '#fee2e2', borderColor: '#fecaca', color: '#991b1b' }}>
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="p-1 hover:opacity-75">
              <X size={16} />
            </button>
          </div>
        )}

        {/* View Switcher & Table Filter Controls */}
        <div className="rounded-xl shadow-sm border-2 overflow-hidden mb-8" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
          
          {/* Top Bar with View Mode Toggle and Search */}
          <div className="p-4 border-b-2 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: '#e9d5ff', background: '#faf5ff' }}>
            
            {/* View Mode Buttons */}
            <div className="flex items-center gap-1 p-1 rounded-lg border-2" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
              <button
                onClick={() => setViewMode('table')}
                className="px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition"
                style={{
                  background: viewMode === 'table' ? '#7c3aed' : 'transparent',
                  color: viewMode === 'table' ? '#fff' : '#6b7280',
                }}
              >
                <Table size={14} />
                CSV Table View
              </button>

              <button
                onClick={() => setViewMode('cards')}
                className="px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition"
                style={{
                  background: viewMode === 'cards' ? '#7c3aed' : 'transparent',
                  color: viewMode === 'cards' ? '#fff' : '#6b7280',
                }}
              >
                <LayoutGrid size={14} />
                Card View
              </button>

              <button
                onClick={() => setViewMode('raw')}
                className="px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition"
                style={{
                  background: viewMode === 'raw' ? '#7c3aed' : 'transparent',
                  color: viewMode === 'raw' ? '#fff' : '#6b7280',
                }}
              >
                <FileSpreadsheet size={14} />
                Raw CSV Code
              </button>
            </div>

            {/* In-Table Search & Email Filter */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5" size={14} style={{ color: '#a78bfa' }} />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter table rows..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border-2 rounded-lg focus:outline-none transition"
                  style={{ borderColor: '#e9d5ff', background: '#fff', color: '#1e1b4b' }}
                />
              </div>

              <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer select-none whitespace-nowrap" style={{ color: '#1e1b4b' }}>
                <input
                  type="checkbox"
                  checked={emailFilterOnly}
                  onChange={(e) => setEmailFilterOnly(e.target.checked)}
                  className="rounded"
                  style={{ accentColor: '#7c3aed' }}
                />
                With Email Only
              </label>
            </div>
          </div>

          {/* 1. CSV TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto">
              {filteredResults.length === 0 ? (
                <div className="py-16 text-center" style={{ color: '#6b7280' }}>
                  <FileSpreadsheet className="mx-auto mb-3" size={36} style={{ color: '#c4b5fd' }} />
                  <p className="font-semibold">No CSV records matching your filter.</p>
                  <p className="text-xs mt-1">Try changing your search keywords or click "Load Sample CSV".</p>
                </div>
              ) : (
                <table className="w-full text-xs text-left border-collapse">
                  <thead style={{ background: '#f3f0ff', borderBottom: '2px solid #e9d5ff' }}>
                    <tr>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider" style={{ color: '#7c3aed' }}>#</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider" style={{ color: '#7c3aed' }}>Company / Business Name</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider" style={{ color: '#7c3aed' }}>Verified Emails</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider" style={{ color: '#7c3aed' }}>Website</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider" style={{ color: '#7c3aed' }}>Description</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider" style={{ color: '#7c3aed' }}>Socials</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-center" style={{ color: '#7c3aed' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((row, idx) => (
                      <tr 
                        key={idx}
                        className="transition-colors border-b"
                        style={{ borderColor: '#f3f0ff' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#faf5ff'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                      >
                        <td className="px-4 py-3 font-bold" style={{ color: '#9ca3af' }}>{idx + 1}</td>
                        
                        <td className="px-4 py-3 font-semibold" style={{ color: '#1e1b4b' }}>
                          <div className="flex items-center gap-1.5">
                            <span>{row.Name}</span>
                            {row.MapsURL && (
                              <a href={row.MapsURL} target="_blank" rel="noopener noreferrer" title="View on Google Maps" style={{ color: '#7c3aed' }}>
                                <MapPin size={12} />
                              </a>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          {row.Emails ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium px-2 py-0.5 rounded border" style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }}>
                                {row.Emails.split(',')[0]}
                              </span>
                              <button
                                onClick={() => copyToClipboard(row.Emails || '', 'email')}
                                title="Copy Email"
                                className="p-1 rounded transition"
                                style={{ color: '#7c3aed' }}
                              >
                                {copiedEmail === row.Emails ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                              </button>
                            </div>
                          ) : (
                            <span style={{ color: '#9ca3af' }}>—</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {row.Website ? (
                            <a 
                              href={row.Website} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1 hover:underline font-medium"
                              style={{ color: '#7c3aed' }}
                            >
                              <Globe size={12} />
                              {row.Website.replace(/^https?:\/\/(www\.)?/, '').slice(0, 24)}
                            </a>
                          ) : (
                            <span style={{ color: '#9ca3af' }}>—</span>
                          )}
                        </td>

                        <td className="px-4 py-3 max-w-xs truncate" style={{ color: '#6b7280' }} title={row.description}>
                          {row.description ? (row.description.length > 50 ? `${row.description.slice(0, 50)}...` : row.description) : '—'}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {row.LinkedIn && (
                              <a href={row.LinkedIn} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:opacity-80" style={{ color: '#0077b5' }} title="LinkedIn">
                                <Linkedin size={14} />
                              </a>
                            )}
                            {row.Facebook && (
                              <a href={row.Facebook} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:opacity-80" style={{ color: '#1877f2' }} title="Facebook">
                                <Facebook size={14} />
                              </a>
                            )}
                            {row.Twitter && (
                              <a href={row.Twitter} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:opacity-80" style={{ color: '#1da1f2' }} title="Twitter">
                                <Twitter size={14} />
                              </a>
                            )}
                            {row.Instagram && (
                              <a href={row.Instagram} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:opacity-80" style={{ color: '#e4405f' }} title="Instagram">
                                <Instagram size={14} />
                              </a>
                            )}
                            {!row.LinkedIn && !row.Facebook && !row.Twitter && !row.Instagram && (
                              <span style={{ color: '#9ca3af' }}>—</span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setSelectedLead(row)}
                            className="px-2.5 py-1 text-white text-[11px] font-bold rounded transition shadow-sm"
                            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* 2. CARD VIEW */}
          {viewMode === 'cards' && (
            <div className="p-6">
              {filteredResults.length === 0 ? (
                <div className="py-12 text-center" style={{ color: '#6b7280' }}>
                  <p>No results found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredResults.map((row, i) => (
                    <div 
                      key={i} 
                      className="rounded-xl border-2 transition-all overflow-hidden" 
                      style={{ borderColor: '#e9d5ff', background: '#fff' }}
                    >
                      <button
                        onClick={() => setExpandedId(expandedId === i ? null : i)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between transition"
                        onMouseEnter={(e) => e.currentTarget.style.background = '#faf5ff'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#f3f0ff', color: '#7c3aed' }}>
                              {i + 1}
                            </span>
                            <h3 className="font-bold text-base" style={{ color: '#1e1b4b' }}>{row.Name}</h3>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs" style={{ color: '#6b7280' }}>
                            {row.Website && (
                              <span className="flex items-center gap-1 font-medium" style={{ color: '#7c3aed' }}>
                                <Globe size={13} />
                                {row.Website}
                              </span>
                            )}
                            {row.Emails && (
                              <span className="flex items-center gap-1 font-semibold px-2 py-0.5 rounded" style={{ background: '#f0fdf4', color: '#166534' }}>
                                <Mail size={13} />
                                {row.Emails}
                              </span>
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-3">
                              <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#a78bfa' }}>Website</label>
                                <p className="mt-1 font-medium break-all">
                                  {row.Website ? (
                                    <a href={row.Website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline" style={{ color: '#7c3aed' }}>
                                      {row.Website} <ExternalLink size={13} />
                                    </a>
                                  ) : '—'}
                                </p>
                              </div>

                              <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#a78bfa' }}>Contact Email</label>
                                <p className="mt-1 font-medium break-all" style={{ color: '#1e1b4b' }}>{row.Emails || '—'}</p>
                              </div>

                              <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#a78bfa' }}>Description / Services</label>
                                <p className="mt-1" style={{ color: '#475569' }}>{row.description || '—'}</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider block mb-2" style={{ color: '#a78bfa' }}>Social Media Profiles</label>
                                <div className="flex flex-wrap gap-2">
                                  <SocialLink url={row.LinkedIn} icon={Linkedin} label="LinkedIn" />
                                  <SocialLink url={row.Facebook} icon={Facebook} label="Facebook" />
                                  <SocialLink url={row.Twitter} icon={Twitter} label="Twitter" />
                                  <SocialLink url={row.Instagram} icon={Instagram} label="Instagram" />
                                </div>
                              </div>

                              {row.MapsURL && (
                                <div className="pt-2">
                                  <a
                                    href={row.MapsURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition"
                                    style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}
                                  >
                                    <MapPin size={14} />
                                    Open in Google Maps
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. RAW CSV CODE VIEW */}
          {viewMode === 'raw' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#7c3aed' }}>
                  Raw CSV Format (RFC 4180)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(rawCsvText || '', 'csv')}
                    className="px-3 py-1 text-xs font-bold rounded-lg border-2 flex items-center gap-1.5 transition"
                    style={{ borderColor: '#e9d5ff', background: '#fff', color: '#7c3aed' }}
                  >
                    {copiedCsv ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                    {copiedCsv ? 'Copied!' : 'Copy Raw CSV'}
                  </button>
                  <button
                    onClick={exportClientCsv}
                    className="px-3 py-1 text-xs font-bold text-white rounded-lg flex items-center gap-1.5 shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}
                  >
                    <Download size={13} />
                    Download File
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                value={rawCsvText || (filteredResults.length > 0 ? 
                  ['Name,Website,Emails,Site_Description,LinkedIn,Facebook,Twitter,Instagram', 
                   ...filteredResults.map(r => `"${r.Name}","${r.Website || ''}","${r.Emails || ''}","${(r.description || '').replace(/"/g, '""')}","${r.LinkedIn || ''}","${r.Facebook || ''}","${r.Twitter || ''}","${r.Instagram || ''}"`)].join('\n') : '')}
                rows={14}
                className="w-full p-4 font-mono text-xs rounded-xl border-2 resize-none focus:outline-none"
                style={{ background: '#faf5ff', borderColor: '#e9d5ff', color: '#1e1b4b' }}
              />
            </div>
          )}

        </div>

      </div>

      {/* Inspect Lead Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden border-2 shadow-2xl animate-in fade-in duration-200" style={{ borderColor: '#e9d5ff' }}>
            
            <div className="flex items-center justify-between p-6 border-b-2" style={{ background: '#faf5ff', borderColor: '#e9d5ff' }}>
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={20} style={{ color: '#7c3aed' }} />
                <h3 className="font-extrabold text-lg" style={{ color: '#1e1b4b' }}>Lead Inspector</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1 rounded-lg hover:bg-gray-100 transition"
                style={{ color: '#7c3aed' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold uppercase" style={{ color: '#a78bfa' }}>Company Name</label>
                <p className="text-base font-bold mt-0.5" style={{ color: '#1e1b4b' }}>{selectedLead.Name}</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase" style={{ color: '#a78bfa' }}>Email Address</label>
                {selectedLead.Emails ? (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-semibold text-sm px-3 py-1 rounded-lg border" style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }}>
                      {selectedLead.Emails}
                    </p>
                    <button
                      onClick={() => copyToClipboard(selectedLead.Emails || '', 'email')}
                      className="p-1.5 rounded-lg border hover:bg-gray-50 transition"
                      style={{ borderColor: '#e9d5ff', color: '#7c3aed' }}
                    >
                      {copiedEmail === selectedLead.Emails ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>No email found</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold uppercase" style={{ color: '#a78bfa' }}>Website</label>
                <p className="text-sm mt-1">
                  {selectedLead.Website ? (
                    <a href={selectedLead.Website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-semibold hover:underline" style={{ color: '#7c3aed' }}>
                      {selectedLead.Website} <ExternalLink size={13} />
                    </a>
                  ) : '—'}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase" style={{ color: '#a78bfa' }}>Description / Meta</label>
                <div className="p-3 rounded-lg border text-xs leading-relaxed mt-1" style={{ background: '#faf5ff', borderColor: '#e9d5ff', color: '#374151' }}>
                  {selectedLead.description || 'No description extracted.'}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase block mb-2" style={{ color: '#a78bfa' }}>Social Links</label>
                <div className="flex flex-wrap gap-2">
                  <SocialLink url={selectedLead.LinkedIn} icon={Linkedin} label="LinkedIn" />
                  <SocialLink url={selectedLead.Facebook} icon={Facebook} label="Facebook" />
                  <SocialLink url={selectedLead.Twitter} icon={Twitter} label="Twitter" />
                  <SocialLink url={selectedLead.Instagram} icon={Instagram} label="Instagram" />
                </div>
              </div>
            </div>

            <div className="p-4 border-t-2 flex justify-end gap-2" style={{ borderColor: '#e9d5ff', background: '#faf5ff' }}>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 text-xs font-bold rounded-lg border-2 transition"
                style={{ borderColor: '#e9d5ff', background: '#fff', color: '#1e1b4b' }}
              >
                Close
              </button>
              {selectedLead.Emails && (
                <a
                  href={`mailto:${selectedLead.Emails}`}
                  className="px-4 py-2 text-xs font-bold text-white rounded-lg transition shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}
                >
                  Send Cold Email
                </a>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}