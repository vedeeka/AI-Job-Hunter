import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { template_name = 'modern', resume_data } = body;

    // Check remote backend if configured
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
    if (backendUrl) {
      try {
        const extRes = await fetch(`${backendUrl.replace(/\/+$/, '')}/download-pdf`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ template_name, resume_data }),
        });
        if (extRes.ok) {
          const blob = await extRes.blob();
          return new NextResponse(blob, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'attachment; filename="resume.pdf"',
            },
          });
        }
      } catch (e) {
        console.warn('Backend PDF download proxy failed, generating downloadable HTML/PDF:', e);
      }
    }

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Resume - ${resume_data?.name || 'Candidate'}</title>
  <style>
    @media print { body { -webkit-print-color-adjust: exact; } }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
    h1 { color: #7c3aed; margin-bottom: 4px; }
    .contact { color: #64748b; margin-bottom: 20px; font-size: 14px; }
    .section-head { color: #7c3aed; text-transform: uppercase; font-size: 14px; border-bottom: 2px solid #7c3aed; margin: 20px 0 10px 0; padding-bottom: 4px; font-weight: bold; }
    .tag { display: inline-block; background: #f3f0ff; color: #7c3aed; padding: 4px 8px; border-radius: 4px; margin: 3px; font-weight: 600; font-size: 12px; }
  </style>
</head>
<body onload="window.print()">
  <h1>${resume_data?.name || 'Alex Morgan'}</h1>
  <div class="contact">${resume_data?.email || ''} | ${resume_data?.phone || ''} | ${resume_data?.linkedin || ''}</div>
  <div class="section-head">Professional Summary</div>
  <p>${resume_data?.summary || ''}</p>
  <div class="section-head">Skills</div>
  <div>${(resume_data?.skills || []).map((s: string) => `<span class="tag">${s}</span>`).join('')}</div>
  <div class="section-head">Experience</div>
  ${(resume_data?.experience || []).map((e: any) => `
    <div style="margin-bottom: 12px;">
      <strong>${e.role}</strong> - <em>${e.company}</em> (${e.date})
      <p style="margin-top: 4px; color: #475569;">${e.description}</p>
    </div>
  `).join('')}
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': 'inline; filename="resume.html"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return POST(new Request('http://localhost/api/download-pdf', { method: 'POST', body: JSON.stringify({}) }));
}
