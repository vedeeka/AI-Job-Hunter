import { NextResponse } from 'next/server';

export async function GET() {
  const templates = [
    { id: 'modern', name: 'Modern Clean' },
    { id: 'classic', name: 'Executive Classic' },
    { id: 'minimal', name: 'Tech Minimal' }
  ];
  return NextResponse.json(templates);
}
