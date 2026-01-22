'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JobSearch from '../pages/JobSearch/page';
import { ResumeAnalyzer } from '../components/ResumeAnalyzer';
import InterviewCoach from '../pages/InterviewCoach/page';
import SkillGraph from '../components/SkillGraph';
import { Briefcase, ArrowRight } from 'lucide-react';

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
      `http://localhost:8000/profile/skills?linkedin_url=${encodeURIComponent(linkedinUrl)}`,
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
    console.log("Fetched profile data:", data);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}


    fetchProfile();
  }, [loggedIn]);

  // Loading / error states
  if (!loggedIn) return <div className="p-8">Checking login...</div>;
  if (loading) return <div className="p-8">Loading profile...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  // Profile data
  const analysis = profileData?.analysis || { match_score: 0, missing_skills: [] };
  const skills = profileData?.skills || [];

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Job Hunter</h1>
            <p className="text-gray-600 text-sm mt-1">Career growth powered by AI</p>
          </div>
          <div className="flex items-center gap-4">
            <Briefcase className="text-gray-400" size={40} />
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Job Recommendations */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Job Recommendations</h2>
            <button className="flex items-center gap-2 text-gray-900 hover:text-gray-600 font-medium">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <JobSearch profile={profileData} /> {/* Pass profile to JobSearch */}
        </section>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Career Path */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Career Path</h2>
                <span className="text-xs font-medium bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                  AI/ML
                </span>
              </div>
              <SkillGraph skills={skills} />
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Resume Analyzer */}
            <ResumeAnalyzer analysis={analysis} />

            {/* Interview Coach */}
            <InterviewCoach />
          </div>
        </div>
      </main>
    </div>
  );
}
