'use client';
import { ResumeAnalyzer } from '../components/ResumeAnalyzer'
import  InterviewCoach  from '..//pages/InterviewCoach/page';
import SkillGraph from '../components/SkillGraph'; 
import JobSearch from '../pages/JobSearch/page';

import { Briefcase, TrendingUp, FileText, Mic, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const StatCard = ({ icon: Icon, label, value }: StatCardProps) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-600 text-sm font-medium">{label}</span>
      <Icon className="text-gray-400" size={20} />
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const analysis = { match_score: 72, missing_skills: ["Docker", "Kubernetes"] };

  return (
    <div className="min-h-screen bg-gray-50">
      

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Job Hunter</h1>
              <p className="text-gray-600 text-sm mt-1">Career growth powered by AI</p>
            </div>
            <Briefcase className="text-gray-400" size={40} />
          </div>
          
          {/* Navigation */}
          <div className="flex gap-1">
            {['overview', 'jobs', 'career', 'tools'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === tab 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        
         <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Job Recommendations</h2>
                <button className="flex items-center gap-2 text-gray-900 hover:text-gray-600 font-medium">
                  View All <ArrowRight size={16} />
                </button>
              </div>
              <JobSearch />
            </section>

        {/* Main Grid */}
        <div className="grid grid-row-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Primary Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Job Search Section */}
      

            {/* Career Visualization */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Career Path</h2>
                <span className="text-xs font-medium bg-gray-200 text-gray-700 px-3 py-1 rounded-full">AI/ML</span>
              </div>
              <SkillGraph />
            </section>

          </div>

          {/* Right Column: Tools & Analysis */}
          <div className="space-y-6">
            
            {/* Resume Analyzer */}
            <section>
              <ResumeAnalyzer analysis={analysis} />
            </section>

            {/* Interview Coach */}
            <section>
              <InterviewCoach />
            </section>

            {/* Quick Tips */}
            <section className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Quick Tips</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">Update your profile weekly</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">Practice interviews daily</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">Add missing skills to resume</span>
                </li>
              </ul>
            </section>

          </div>

        </div>
      </main>
    </div>
  );
}

export default App;