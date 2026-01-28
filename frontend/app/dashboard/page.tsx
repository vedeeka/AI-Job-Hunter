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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">Error Loading Profile</h3>
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 text-sm font-medium text-red-600 hover:text-red-700"
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Job Hunter</h1>
                <p className="text-gray-600 text-sm">Your AI-powered career assistant</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium text-sm transition-colors"
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back! 👋</h2>
              <p className="text-blue-100 text-lg">Let's continue building your career path</p>
            </div>
            <div className="hidden md:block">
              
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{skills.length}</p>
            <p className="text-sm text-gray-600">Total Skills</p>
          </div>

      

        

      
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Career Path Section */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">Career Path</h2>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    AI/ML
                  </span>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View Details
                  <ArrowRight size={16} />
                </button>
              </div>
          
              <ProfileDetails
  name={profileData.name}
  about_raw={profileData.about_raw}
  experience_raw={profileData.experience_raw}
/>

              <SkillGraph skills={skills} />
            </section>

            {/* Quick Actions */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all text-left group">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Job Search</h3>
                <p className="text-sm text-gray-600">Find matching opportunities</p>
              </button>

              <button className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-md transition-all text-left group">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                  <svg className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Resume Analyzer</h3>
                <p className="text-sm text-gray-600">Optimize your resume</p>
              </button>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Missing Skills */}
            {analysis.missing_skills && analysis.missing_skills.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-orange-600" />
                  Skills to Learn
                </h3>
                <div className="space-y-3">
                  {analysis.missing_skills.slice(0, 5).map((skill: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-700">{skill}</span>
                      <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                        Learn
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6">
              <h3 className="font-semibold text-green-900 mb-2">Keep Going! 🎯</h3>
              <p className="text-sm text-green-700 mb-4">You're on track to reach your career goals</p>
              <div className="bg-white rounded-lg p-3">
                <div className="flex justify-between text-xs font-medium text-gray-600 mb-2">
                  <span>Profile Completion</span>
                  <span>{matchScore}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                    style={{ width: `${matchScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Interview Prep */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Interview Prep</h3>
              <p className="text-sm text-gray-600 mb-4">Practice with AI-powered mock interviews</p>
              <button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg py-3 font-medium text-sm transition-colors">
                Start Practice
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}