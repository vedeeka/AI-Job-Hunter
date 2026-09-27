import { NextResponse } from 'next/server';

function renderResumeHtml(templateName: string, data: any): string {
  const name = data?.name || 'Alex Morgan';
  const email = data?.email || 'alex@example.com';
  const phone = data?.phone || '+1 (555) 010-9988';
  const linkedin = data?.linkedin || 'linkedin.com/in/alexmorgan';
  const summary = data?.summary || 'Experienced Software Engineer with strong background in AI systems and web applications.';
  const skills = Array.isArray(data?.skills) ? data.skills : ['Python', 'FastAPI', 'React', 'TypeScript', 'Docker', 'AWS'];
  const experience = Array.isArray(data?.experience) ? data.experience : [];
  const projects = Array.isArray(data?.projects) ? data.projects : [];
  const education = Array.isArray(data?.education) ? data.education : [];
  const achievements = Array.isArray(data?.achievements) ? data.achievements : [];

  const accentColor = templateName === 'classic' ? '#0f172a' : templateName === 'minimal' ? '#2563eb' : '#7c3aed';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      padding: 36px 44px;
      line-height: 1.5;
      font-size: 13px;
    }
    .header {
      border-bottom: 2px solid ${accentColor};
      padding-bottom: 14px;
      margin-bottom: 20px;
    }
    .name {
      font-size: 26px;
      font-weight: 800;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .contact-info {
      font-size: 12px;
      color: #64748b;
      margin-top: 6px;
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 18px;
      margin-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 10px;
    }
    .skill-tag {
      background: #f1f5f9;
      color: #334155;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      font-weight: 700;
      font-size: 13px;
      color: #0f172a;
    }
    .item-sub {
      color: #64748b;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .item-desc {
      color: #334155;
      margin-bottom: 12px;
    }
    ul {
      margin-left: 18px;
      color: #334155;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${name}</div>
    <div class="contact-info">
      <span>✉ ${email}</span>
      <span>☎ ${phone}</span>
      <span>🔗 ${linkedin}</span>
    </div>
  </div>

  <div class="section-title">Professional Summary</div>
  <p style="color: #334155; margin-bottom: 12px;">${summary}</p>

  <div class="section-title">Technical Skills</div>
  <div class="skills-container">
    ${skills.map((s: string) => `<span class="skill-tag">${s}</span>`).join('')}
  </div>

  ${experience.length > 0 ? `
    <div class="section-title">Experience</div>
    ${experience.map((exp: any) => `
      <div style="margin-bottom: 12px;">
        <div class="item-header">
          <span>${exp.role || ''}</span>
          <span style="font-weight: normal; color: #64748b;">${exp.date || ''}</span>
        </div>
        <div class="item-sub">${exp.company || ''}</div>
        <div class="item-desc">${exp.description || ''}</div>
      </div>
    `).join('')}
  ` : ''}

  ${projects.length > 0 ? `
    <div class="section-title">Key Projects</div>
    ${projects.map((proj: any) => `
      <div style="margin-bottom: 12px;">
        <div class="item-header">
          <span>${proj.name || ''}</span>
          <span style="font-weight: normal; color: #64748b;">${proj.technologies || ''}</span>
        </div>
        <div class="item-desc">${proj.description || ''}</div>
      </div>
    `).join('')}
  ` : ''}

  ${education.length > 0 ? `
    <div class="section-title">Education</div>
    ${education.map((edu: any) => `
      <div style="margin-bottom: 8px;">
        <div class="item-header">
          <span>${edu.school || ''}</span>
          <span style="font-weight: normal; color: #64748b;">${edu.date || ''}</span>
        </div>
        <div class="item-sub">${edu.degree || ''}</div>
      </div>
    `).join('')}
  ` : ''}

  ${achievements.length > 0 ? `
    <div class="section-title">Achievements</div>
    <ul>
      ${achievements.map((ach: string) => `<li style="margin-bottom: 4px;">${ach}</li>`).join('')}
    </ul>
  ` : ''}
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { template_name = 'modern', resume_data } = body;

    const html = renderResumeHtml(template_name, resume_data);
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
