import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), 'public', 'data', 'leads.csv');
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json({ success: false, message: 'CSV not found' }, { status: 404 });
    }

    const rawCsv = fs.readFileSync(csvPath, 'utf-8');
    return NextResponse.json({
      success: true,
      csvText: rawCsv
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
