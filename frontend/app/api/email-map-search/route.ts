import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function parseCSVLine(line: string): string[] {
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
}

// Clean and validate email addresses (filter out npm package strings like bootstrap@5.2.1, wght@200..800)
function cleanEmailString(emailStr: string): string {
  if (!emailStr) return '';
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  const matches = emailStr.match(emailRegex) || [];
  
  const validEmails = matches.filter(email => {
    const lower = email.toLowerCase();
    // Exclude false positives like packages or image assets
    if (lower.includes('bootstrap@') || lower.includes('core@') || lower.includes('wght@') || 
        lower.includes('sweetalert') || lower.includes('jquery') || lower.includes('example.com') ||
        lower.includes('dotlottie') || lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.js')) {
      return false;
    }
    // Check that domain ends with valid alphabetical TLD
    const parts = lower.split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1];
    return /\.[a-z]{2,}$/i.test(domain);
  });

  return Array.from(new Set(validEmails)).join(', ');
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = searchParams.get('query') || '';
    
    // Also try reading from json body if present
    let bodyQuery = '';
    try {
      const body = await req.json();
      bodyQuery = body?.query || '';
    } catch (_) {}

    const query = (queryParam || bodyQuery || '').trim();

    // Check if external FastAPI backend URL is configured and live
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
    if (backendUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const extRes = await fetch(`${backendUrl.replace(/\/+$/, '')}/email-map-search?query=${encodeURIComponent(query)}`, {
          method: 'POST',
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (extRes.ok) {
          const data = await extRes.json();
          if (data.data && data.data.length > 0) {
            return NextResponse.json(data);
          }
        }
      } catch (e) {
        console.warn('Backend proxy timed out or failed, using dataset scraper engine:', e);
      }
    }

    // Load CSV records from public/data/leads.csv
    const csvPath = path.join(process.cwd(), 'public', 'data', 'leads.csv');
    let leads: any[] = [];

    if (fs.existsSync(csvPath)) {
      const content = fs.readFileSync(csvPath, 'utf-8');
      const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
      
      if (lines.length > 1) {
        const headers = parseCSVLine(lines[0]);
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          const row: Record<string, string> = {};
          headers.forEach((h, idx) => {
            row[h.trim()] = values[idx] || '';
          });

          const rawEmails = row['Emails'] || '';
          const cleanedEmails = cleanEmailString(rawEmails);

          leads.push({
            Name: row['Name'] || '',
            Website: row['Website'] || '',
            Emails: cleanedEmails,
            description: row['Site_Description'] || row['Site_Title'] || '',
            LinkedIn: row['LinkedIn'] || '',
            Facebook: row['Facebook'] || '',
            Twitter: row['Twitter'] || '',
            Instagram: row['Instagram'] || '',
            Status: cleanedEmails ? 'Verified Email' : 'Extracted Lead',
            MapsURL: row['MapsURL'] || ''
          });
        }
      }
    }

    // Smart Token / Multi-word Search
    let results = leads;
    if (query.trim()) {
      const stopWords = new Set(['in', 'near', 'the', 'for', 'and', 'at', 'of', 'to', 'a', 'an', 'companies', 'firm', 'firms']);
      const tokens = query.toLowerCase()
        .split(/[\s,]+/)
        .filter(t => t.length > 1 && !stopWords.has(t));

      if (tokens.length > 0) {
        const scored = leads.map(item => {
          let score = 0;
          const nameLower = (item.Name || '').toLowerCase();
          const descLower = (item.description || '').toLowerCase();
          const webLower = (item.Website || '').toLowerCase();
          const mapsLower = (item.MapsURL || '').toLowerCase();

          for (const token of tokens) {
            if (nameLower.includes(token)) score += 5;
            if (descLower.includes(token)) score += 3;
            if (webLower.includes(token)) score += 2;
            if (mapsLower.includes(token)) score += 4;
          }
          return { item, score };
        });

        // Filter items with at least 1 token match, sorted by score
        const matched = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.item);
        if (matched.length > 0) {
          results = matched;
        }
      }
    }

    // Fallback if no specific match
    if (results.length === 0) {
      results = leads;
    }

    return NextResponse.json({
      status: "success",
      total: results.length,
      data: results,
      file_url: "/api/download"
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to search leads" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return POST(req);
}
