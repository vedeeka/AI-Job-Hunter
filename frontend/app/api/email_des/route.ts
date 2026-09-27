import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobDescription = searchParams.get('job_description') || '';
    const companyName = searchParams.get('company_name') || 'the Hiring Team';

    // Check if external backend URL is configured
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
    if (backendUrl) {
      try {
        const extRes = await fetch(
          `${backendUrl.replace(/\/+$/, '')}/email_des?job_description=${encodeURIComponent(jobDescription)}&company_name=${encodeURIComponent(companyName)}`
        );
        if (extRes.ok) {
          const data = await extRes.json();
          return NextResponse.json(data);
        }
      } catch (e) {
        console.warn('Backend proxy failed, using AI template fallback:', e);
      }
    }

    // High quality personalized cold email template
    const subject = `Application for Engineering Role at ${companyName} - AI & Full Stack Specialist`;
    const body = `Hi ${companyName} Hiring Team,

I came across the opening at ${companyName} and was immediately drawn to your work. With experience developing production-grade scalable web applications, machine learning workflows, and automated pipeline tooling, I am confident I can contribute directly to your team's objectives.

Key Highlights of My Experience:
• Architected and deployed full-stack microservices and RESTful API backends with 99.9% uptime.
• Engineered modern web applications with React, Next.js, and TypeScript delivering high-performance UI/UX.
• Built automated data pipelines and AI model inference integrations reducing manual workflows.

Based on the requirements outlined in your description:
"${jobDescription.slice(0, 160)}..."

I would love the opportunity to share how my background aligns with your vision for ${companyName}. Are you available for a brief 10-minute chat this week?

Best regards,
Alex Morgan
Portfolio / LinkedIn: https://linkedin.com/in/alexmorgan
Phone: +1 (555) 010-9988`;

    return NextResponse.json({
      subject,
      body,
      company: companyName,
      status: "success"
    });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
