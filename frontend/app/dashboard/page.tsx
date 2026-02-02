'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JobSearch from './JobSearch/page';
import { ResumeAnalyzer } from '../components/ResumeAnalyzer';
import InterviewCoach from '../pages/InterviewCoach/page';
import SkillGraph from '../components/SkillGraph';
import ProfileDetails from '../components/ProfileDetails';
import { Briefcase, ArrowRight, TrendingUp, Target, Award, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  // Check login
  useEffect(() => {
    const logged = localStorage.getItem('loggedIn');
    const linkedinUrl = localStorage.getItem('linkedinUrl');
    if (!logged) {
      router.push('auth/login');
    } else {
      setLoggedIn(true);
    }
  }, [router]);

  // Fetch profile data after login
 useEffect(() => {
  if (!loggedIn) return;

  async function fetchProfile() {
    try {
      const linkedinUrl = localStorage.getItem('linkedinUrl') || '';

      const res = await fetch(
        `http://localhost:8000/profile/full?linkedin_url=${encodeURIComponent(linkedinUrl)}`,
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
      setProfileData(data); // data now has name, about_raw, experience_raw, skills, analysis
      console.log("Fetched full profile:", data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  fetchProfile();
}, [loggedIn]);


  // Logout
  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('linkedinUrl');
    router.push('/login');
  };

  // Loading / error states
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f3f0ff 50%, #faf8ff 100%)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'rgba(124, 58, 237, 0.2)', borderTopColor: '#7c3aed' }}></div>
          <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f3f0ff 50%, #faf8ff 100%)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'rgba(124, 58, 237, 0.2)', borderTopColor: '#7c3aed' }}></div>
          <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f3f0ff 50%, #faf8ff 100%)' }}>
        <div className="max-w-md w-full mx-4">
          <div className="backdrop-blur border-2 rounded-xl p-6" style={{ background: '#fee2e2', borderColor: '#fecaca' }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(220, 38, 38, 0.2)' }}>
                <svg className="w-5 h-5" style={{ color: '#dc2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1" style={{ color: '#991b1b' }}>Error Loading Profile</h3>
                <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: '#dc2626' }}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Profile data
  const analysis = profileData?.analysis || { match_score: 0, missing_skills: [] };
  const skills = profileData?.skills || [];
  const matchScore = analysis.match_score || 0;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f3f0ff 50%, #faf8ff 100%)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-sm border-b-2" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' }}>
                <Briefcase className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1e1b4b' }}>AI Job Hunter</h1>
                <p className="text-sm font-medium" style={{ color: '#7c3aed' }}>Your AI-powered career assistant</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg font-medium text-sm transition-all" style={{ color: '#7c3aed' }} onMouseEnter={(e) => e.currentTarget.style.background = '#faf5ff'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="rounded-2xl p-8 mb-8 text-white shadow-lg hover:shadow-xl transition-shadow" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back! 👋</h2>
              <p className="text-purple-100 text-lg">Let's continue building your career path</p>
            </div>
            <div className="hidden md:block">
              
            </div>
          </div>
        </div>

        {/* Stats Grid */}


        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Career Path Section */}
            <section className="rounded-xl border-2 shadow-sm hover:shadow-md transition-shadow p-6" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold" style={{ color: '#1e1b4b' }}>Career Path</h2>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full border-2" style={{ background: '#faf5ff', color: '#7c3aed', borderColor: '#e9d5ff' }}>
                    AI/ML
                  </span>
                </div>
                <button className="text-sm font-semibold flex items-center gap-1 transition-colors" style={{ color: '#7c3aed' }}>
                  View Details
                  <ArrowRight size={16} />
                </button>
              </div>
          
              <ProfileDetails
  name={profileData.name}
  about_raw={profileData.about_raw}
  experience_raw={profileData.experience_raw}
/>

          
            </section>
    <SkillGraph skills={skills} />
            {/* Quick Actions */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="border-2 rounded-xl p-6 transition-all text-left group" style={{ background: '#fff', borderColor: '#e9d5ff' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c4b5fd'; e.currentTarget.style.background = '#faf5ff'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e9d5ff'; e.currentTarget.style.background = '#fff'; }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all shadow-sm" style={{ background: '#faf5ff' }}>
                  <svg className="w-6 h-6" style={{ color: '#7c3aed' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: '#1e1b4b' }}>Job Search</h3>
                <p className="text-sm" style={{ color: '#6b7280' }}>Find matching opportunities</p>
              </button>

              <button className="border-2 rounded-xl p-6 transition-all text-left group" style={{ background: '#fff', borderColor: '#e9d5ff' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c4b5fd'; e.currentTarget.style.background = '#faf5ff'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e9d5ff'; e.currentTarget.style.background = '#fff'; }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all shadow-sm" style={{ background: '#faf5ff' }}>
                  <svg className="w-6 h-6" style={{ color: '#7c3aed' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: '#1e1b4b' }}>Resume Analyzer</h3>
                <p className="text-sm" style={{ color: '#6b7280' }}>Optimize your resume</p>
              </button>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Missing Skills */}
            {analysis.missing_skills && analysis.missing_skills.length > 0 && (
              <div className="rounded-xl border-2 shadow-sm hover:shadow-md transition-shadow p-6" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#1e1b4b' }}>
                  <TrendingUp size={20} style={{ color: '#f97316' }} />
                  Skills to Learn
                </h3>
                <div className="space-y-3">
                  {analysis.missing_skills.slice(0, 5).map((skill: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg transition-all group" style={{ background: '#faf5ff', borderLeft: '3px solid #7c3aed' }}>
                      <span className="text-sm font-medium" style={{ color: '#374151' }}>{skill}</span>
                      <button className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#7c3aed' }}>
                        Learn
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

              <div className="rounded-xl p-6 border-2 shadow-sm hover:shadow-md transition-all" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: '#faf5ff' }}>
                <Target style={{ color: '#7c3aed' }} size={24} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#1e1b4b' }}>{skills.length}</p>
            <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Total Skills</p>
          </div>
            <div className="rounded-xl border-2 p-6 shadow-sm hover:shadow-md transition-shadow" style={{ background: '#faf5ff', borderColor: '#e9d5ff' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#1e1b4b' }}>Keep Going! 🎯</h3>
              <p className="text-sm mb-4" style={{ color: '#6b7280' }}>You're on track to reach your career goals</p>
              <div className="rounded-lg p-3 backdrop-blur-sm border-2" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
                <div className="flex justify-between text-xs font-semibold mb-2" style={{ color: '#6b7280' }}>
                  <span>Profile Completion</span>
                  <span className="px-2 py-0.5 rounded" style={{ color: '#7c3aed', background: '#faf5ff' }}>{matchScore}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#e9d5ff' }}>
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', width: `${matchScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Interview Prep */}
            <div className="rounded-xl border-2 shadow-sm hover:shadow-md transition-shadow p-6" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1e1b4b' }}>Interview Prep</h3>
              <p className="text-sm mb-4" style={{ color: '#6b7280' }}>Practice with AI-powered mock interviews</p>
              <button className="w-full text-white rounded-lg py-3 font-semibold text-sm transition-all shadow-sm hover:shadow-md" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}>
                Start Practice
              </button>
            </div>
     
     

      

        

      

          </div>
        </div>
      </main>
    </div>
  );
}