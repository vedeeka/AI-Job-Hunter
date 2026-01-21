import JobCard from './components/JobCard';
import { ResumeAnalyzer } from '../app/components/ResumeAnalyzer';
import  InterviewCoach  from '../app/pages/InterviewCoach/page';
import SkillGraph from './components/SkillGraph'; 
import JobSearch from './pages/JobSearch/page';

function App() {
  // Mock Data for Demo
  const job = { title: "AI Engineer", company: "OpenAI", location: "Remote", type: "Full-time", trust_score: 95, predicted_salary: 180000 };
  const analysis = { match_score: 72, missing_skills: ["Docker", "Kubernetes"] };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">AI Job Hunter <span className="text-indigo-600">Pro</span></h1>
        <p className="text-gray-500">Automated Application Platform & Career Copilot</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Job Feed */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-4">Recommended Jobs</h2>
            <div className="space-y-4">
              <JobSearch /> 
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Career Visualization</h2>
            <SkillGraph />
          </section>
        </div>

        {/* Right Column: Tools */}
        <div className="space-y-6">
          <ResumeAnalyzer analysis={analysis} />
          <InterviewCoach />
        </div>

      </div>
    </div>
  );
}

export default App;