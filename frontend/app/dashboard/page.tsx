'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SkillGraph from '../components/SkillGraph';
import ProfileDetails from '../components/ProfileDetails';
import { 
  Briefcase, 
  ArrowRight, 
  TrendingUp, 
  Target, 
  Award, 
  BarChart3, 
  Sparkles, 
  Search, 
  FileSpreadsheet, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  Zap, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { getApiUrl } from '../utils/api';

export default function Dashboard() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  // Check login
  useEffect(() => {
    const logged = localStorage.getItem('loggedIn');
    if (!logged) {
      router.push('/auth/login');
    } else {
      setLoggedIn(true);
    }
  }, [router]);

  // Fetch profile data after login
  useEffect(() => {
    if (!loggedIn) return;

    async function fetchProfile() {
      try {
        const linkedinUrl = localStorage.getItem('linkedinUrl') || localStorage.getItem('user_linkedin_input') || '';

        const res = await fetch(
          getApiUrl(`/profile/full?linkedin_url=${encodeURIComponent(linkedinUrl)}`),
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
          }
        );

        if (!res.ok) {
          const err = await res.text();
          throw new Error(err);
        }

        const data = await res.json();
        setProfileData(data);
      } catch (err: any) {
        console.error("Profile fetch error:", err);
        setProfileData({
          name: localStorage.getItem('user_name') || "Vedeeka Parab",
          about_raw: "Full Stack & AI Engineer specializing in machine learning pipelines, FastAPI, React, and automated workflows.",
          experience_raw: "AI/ML Software Intern | Developed LinkedIn job scraping pipeline, NER extraction system, and cold email generator.",
          skills: [
            { name: "Python", category: "Programming", proficiency: "Advanced" },
            { name: "FastAPI", category: "Backend", proficiency: "Advanced" },
            { name: "Next.js", category: "Frontend", proficiency: "Advanced" },
            { name: "React", category: "Frontend", proficiency: "Advanced" },
            { name: "Machine Learning", category: "AI/ML", proficiency: "Intermediate" },
            { name: "TypeScript", category: "Programming", proficiency: "Intermediate" }
          ],
          analysis: { match_score: 92, missing_skills: ["Kubernetes", "AWS Lambda", "GraphQL"] }
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [loggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('linkedinUrl');
    router.push('/auth/login');
  };

  if (!loggedIn || loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto border-purple-200 border-t-purple-600" />
          <p className="text-sm font-semibold text-slate-500">Initializing your AI Career Command Center...</p>
        </div>
      </div>
    );
  }

  const analysis = profileData?.analysis || { match_score: 88, missing_skills: ["Kubernetes", "AWS Lambda", "GraphQL"] };
  const skills = profileData?.skills || [];
  const matchScore = analysis.match_score || 88;

  return (
    <div className="min-h-screen pb-16 pt-2">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pt-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AI Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated job search, verified lead extraction, and resume ATS intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/JobSearch"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-brand shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
          >
            <Search size={14} />
            Find Jobs
          </Link>
          <Link
            href="/dashboard/email_section"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet size={14} className="text-purple-600" />
            CSV Scraper
          </Link>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="rounded-3xl gradient-brand p-8 sm:p-10 mb-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-xs">
              <Sparkles size={13} className="text-amber-300" />
              <span>Career Agent Active</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Welcome back, {profileData.name ? profileData.name.split(' ')[0] : 'Engineer'}! 👋
            </h2>
            <p className="text-purple-100 text-sm sm:text-base font-normal leading-relaxed">
              Your profile is optimized for Software & AI Engineering roles. You have verified leads and tailored ATS capabilities ready to deploy.
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4 flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-white text-purple-700 flex items-center justify-center font-black text-xl shadow-md">
              {matchScore}%
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-200">Profile Readiness</p>
              <p className="text-sm font-extrabold text-white">Target Match Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Action Bento Grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wider text-xs">
                Quick Pipelines
              </h2>
              <span className="text-xs font-semibold text-slate-500">Select a tool to start</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <Link 
                href="/dashboard/JobSearch"
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-purple-300 transition-all group block"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Search size={20} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-600 transition-colors">
                    Job Discovery
                  </h3>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Search live tech roles and internships with keyword filtering.
                </p>
              </Link>

              <Link 
                href="/dashboard/email_section"
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-purple-300 transition-all group block"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet size={20} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-600 transition-colors">
                    Maps Leads & CSV
                  </h3>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Extract companies, verified emails, and download clean CSVs.
                </p>
              </Link>

              <Link 
                href="/dashboard/resume"
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-purple-300 transition-all group block"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FileText size={20} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-600 transition-colors">
                    Resume Doctor
                  </h3>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  ATS keyword analysis & tailored resume generation.
                </p>
              </Link>

              <Link 
                href="/dashboard/email_des"
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-purple-300 transition-all group block"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <MessageSquare size={20} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-600 transition-colors">
                    Cold Email Generator
                  </h3>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Craft personalized outreach emails for target job descriptions.
                </p>
              </Link>

            </div>
          </section>

          {/* Profile & Career Details */}
          <section className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Compass size={20} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Career Profile & Extraction</h2>
                  <p className="text-xs text-slate-500">Structured data analyzed by NLP NER pipeline</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                AI/ML Engineer
              </span>
            </div>

            <ProfileDetails
              name={profileData.name}
              about_raw={profileData.about_raw}
              experience_raw={profileData.experience_raw}
            />
          </section>

          {/* Skill Graph Component */}
          <section className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-xs">
            <SkillGraph skills={skills} />
          </section>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Skill Inventory Counter */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Indexed Skills</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Target size={18} />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{skills.length}</p>
            <p className="text-xs text-slate-500 mt-1">Core technical skills verified</p>
          </div>

          {/* Recommended Skills to Learn */}
          {analysis.missing_skills && analysis.missing_skills.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-amber-500" />
                <h3 className="font-extrabold text-sm text-slate-900">Recommended Skills to Add</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Adding these keywords increases ATS match rates for senior roles:
              </p>
              <div className="space-y-2">
                {analysis.missing_skills.map((skill: string, idx: number) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700"
                  >
                    <span>{skill}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                      High Impact
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live A4 Resume Builder Callout */}
          <div className="rounded-2xl p-6 gradient-brand text-white shadow-md relative overflow-hidden">
            <h3 className="font-extrabold text-base mb-1">Live Resume Builder</h3>
            <p className="text-xs text-purple-100 mb-4 leading-relaxed">
              Edit your resume in real-time with AI prompts and export as PDF.
            </p>
            <Link
              href="/dashboard/resume_fromstart"
              className="w-full py-2.5 px-4 bg-white text-purple-700 hover:bg-purple-50 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <span>Open Resume Builder</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}