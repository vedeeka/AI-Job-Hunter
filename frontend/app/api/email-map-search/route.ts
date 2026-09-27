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

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';

    // Check if external backend URL is configured
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
    if (backendUrl) {
      try {
        const extRes = await fetch(`${backendUrl.replace(/\/+$/, '')}/email-map-search?query=${encodeURIComponent(query)}`, {
          method: 'POST',
        });
        if (extRes.ok) {
          const data = await extRes.json();
          return NextResponse.json(data);
        }
      } catch (e) {
        console.warn('Backend proxy failed, using CSV dataset fallback:', e);
      }
    }

    // Read CSV file from public/data/leads.csv
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

          leads.push({
            Name: row['Name'] || '',
            Website: row['Website'] || '',
            Emails: row['Emails'] || '',
            description: row['Site_Description'] || row['Site_Title'] || '',
            LinkedIn: row['LinkedIn'] || '',
            Facebook: row['Facebook'] || '',
            Twitter: row['Twitter'] || '',
            Instagram: row['Instagram'] || '',
            Status: row['Emails'] ? 'Verified Email' : 'Extracted',
            MapsURL: row['MapsURL'] || ''
          });
        }
      }
    }

    // If query is provided, filter or re-rank
    let results = leads;
    if (query.trim()) {
      const qLower = query.toLowerCase();
      const filtered = leads.filter(item => 
        (item.Name && item.Name.toLowerCase().includes(qLower)) ||
        (item.description && item.description.toLowerCase().includes(qLower)) ||
        (item.Website && item.Website.toLowerCase().includes(qLower))
      );
      if (filtered.length > 0) {
        results = filtered;
      }
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
