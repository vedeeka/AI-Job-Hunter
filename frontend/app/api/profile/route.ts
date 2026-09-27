import { NextResponse } from 'next/server';

const DEFAULT_PROFILE = {
  name: "Vedeeka Parab",
  linkedin: "https://www.linkedin.com/in/vedeeka-parab-7a5174270",
  email: "vedeekaparab9999@gmail.com",
  phone: "+91 9876543210",
  about_raw: "Enthusiastic Computer Science and Machine Learning Engineer specializing in AI application development, full stack engineering with Next.js, FastAPI, Python, and intelligent agent workflows. Passionate about automating repetitive tasks and designing intuitive AI tools.",
  experience_raw: "AI/ML Software Intern | Developed LinkedIn job scraping pipeline, Named Entity Recognition extraction system, ATS resume matching engines and cold email generators. Built responsive dashboards using Next.js, React, and TailwindCSS.",
  skills: [
    { name: "Python", category: "Programming", proficiency: "Advanced" },
    { name: "FastAPI", category: "Backend", proficiency: "Advanced" },
    { name: "Next.js", category: "Frontend", proficiency: "Advanced" },
    { name: "React", category: "Frontend", proficiency: "Advanced" },
    { name: "Machine Learning", category: "AI/ML", proficiency: "Intermediate" },
    { name: "TypeScript", category: "Programming", proficiency: "Intermediate" },
    { name: "Natural Language Processing (NER)", category: "AI/ML", proficiency: "Intermediate" },
    { name: "Docker", category: "DevOps", proficiency: "Intermediate" },
    { name: "REST APIs", category: "Backend", proficiency: "Advanced" },
    { name: "Playwright / Web Scraping", category: "Data Engineering", proficiency: "Advanced" },
    { name: "TailwindCSS", category: "Frontend", proficiency: "Advanced" }
  ],
  analysis: {
    match_score: 92,
    missing_skills: ["Kubernetes", "AWS Lambda", "GraphQL", "Apache Kafka"]
  }
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const linkedinUrl = searchParams.get('linkedin_url') || '';

    // Check if remote backend is available
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
    if (backendUrl) {
      try {
        const extRes = await fetch(`${backendUrl.replace(/\/+$/, '')}/profile?linkedin_url=${encodeURIComponent(linkedinUrl)}`);
        if (extRes.ok) {
          const data = await extRes.json();
          return NextResponse.json(data);
        }
      } catch (e) {
        console.warn('Backend proxy failed, using default profile data:', e);
      }
    }

    return NextResponse.json({
      ...DEFAULT_PROFILE,
      linkedin: linkedinUrl || DEFAULT_PROFILE.linkedin
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
