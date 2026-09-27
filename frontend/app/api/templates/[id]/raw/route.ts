import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sampleData = {
    name: "Alex Morgan",
    email: "alex@example.com",
    phone: "+1 (555) 010-9988",
    linkedin: "linkedin.com/in/alexmorgan",
    summary: "Senior Full Stack Engineer with 6+ years experience building cloud applications, automated pipelines, and intelligent AI tooling.",
    skills: ["Python", "FastAPI", "React", "TypeScript", "Docker", "AWS"],
    experience: [
      { role: "Senior Engineer", company: "Tech Corp", date: "2021 - Present", description: "Built high-performance microservices and AI agent workflows." }
    ],
    projects: [
      { name: "AI Job Hunter Platform", technologies: "Next.js, Python, TailwindCSS", description: "Engineered full stack automation suite." }
    ],
    education: [
      { school: "State University", degree: "B.S. Computer Science", date: "2018" }
    ]
  };

  const accentColor = id === 'classic' ? '#0f172a' : id === 'minimal' ? '#2563eb' : '#7c3aed';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      background: #ffffff;
      padding: 30px;
      font-size: 13px;
      line-height: 1.4;
    }
    .header { border-bottom: 2px solid ${accentColor}; padding-bottom: 12px; margin-bottom: 16px; }
    .name { font-size: 24px; font-weight: 800; color: ${accentColor}; }
    .title { font-size: 13px; font-weight: 700; color: ${accentColor}; text-transform: uppercase; margin: 12px 0 6px 0; }
    .tag { display: inline-block; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin: 2px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${sampleData.name}</div>
    <div style="font-size: 11px; color: #64748b; margin-top: 4px;">${sampleData.email} • ${sampleData.phone}</div>
  </div>
  <div class="title">Summary</div>
  <p style="font-size: 11px; color: #475569;">${sampleData.summary}</p>
  <div class="title">Skills</div>
  <div>
    ${sampleData.skills.map(s => `<span class="tag">${s}</span>`).join('')}
  </div>
  <div class="title">Experience</div>
  <div style="font-size: 11px; color: #334155;">
    <strong>${sampleData.experience[0].role}</strong> - ${sampleData.experience[0].company}
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
