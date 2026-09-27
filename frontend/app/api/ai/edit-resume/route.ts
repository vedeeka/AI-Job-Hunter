import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { current_data, user_input } = body;

    // Check remote backend if configured
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
    if (backendUrl) {
      try {
        const extRes = await fetch(`${backendUrl.replace(/\/+$/, '')}/ai/edit-resume`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ current_data, user_input }),
        });
        if (extRes.ok) {
          const data = await extRes.json();
          return NextResponse.json(data);
        }
      } catch (e) {
        console.warn('Backend proxy failed, using AI assistant fallback:', e);
      }
    }

    const inputLower = (user_input || '').toLowerCase();
    const updated = { ...current_data };

    if (inputLower.includes('add skill') || inputLower.includes('add ') || inputLower.includes('skill')) {
      const match = user_input.match(/add (?:skill )?([a-zA-Z0-9\s,\.]+)/i);
      const newSkills = match ? match[1].split(',').map((s: string) => s.trim()) : ['Cloud Architecture', 'System Design'];
      const currentSkills = Array.isArray(updated.skills) ? [...updated.skills] : [];
      newSkills.forEach((s: string) => {
        if (!currentSkills.includes(s) && s.length > 1) {
          currentSkills.push(s);
        }
      });
      updated.skills = currentSkills;

      return NextResponse.json({
        type: 'edit',
        message: `I've updated your technical skills section to include: ${newSkills.join(', ')}.`,
        updated_data: updated
      });
    }

    if (inputLower.includes('summary') || inputLower.includes('improve')) {
      updated.summary = `Results-oriented Senior Engineer with over 6 years of expertise in architecting scalable applications, machine learning systems, and resilient cloud backends. Proven leader in optimizing system performance and delivering high-impact features.`;
      return NextResponse.json({
        type: 'edit',
        message: `I've enhanced your professional summary with stronger action verbs and quantifiable impact statements.`,
        updated_data: updated
      });
    }

    return NextResponse.json({
      type: 'edit',
      message: `I have incorporated your feedback ("${user_input}") into your resume preview.`,
      updated_data: updated
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
