import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), 'public', 'data', 'leads.csv');
    if (!fs.existsSync(csvPath)) {
      return new NextResponse("Name,Website,Emails,Site_Description\n", {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="leads.csv"',
        },
      });
    }

    const fileBuffer = fs.readFileSync(csvPath);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="leads.csv"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "File download failed" }, { status: 500 });
  }
}
