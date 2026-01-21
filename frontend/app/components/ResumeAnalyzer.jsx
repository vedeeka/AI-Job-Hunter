'use client'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ResumeAnalyzer = ({ analysis }) => {
  const data = [
    { name: 'Match', value: analysis.match_score },
    { name: 'Gap', value: 100 - analysis.match_score },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Resume Fit Analysis</h2>
      
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Visualization: Match Score Gauge */}
        <div className="w-40 h-40 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={40} outerRadius={60} dataKey="value">
                <Cell fill="#4F46E5" /> {/* Indigo */}
                <Cell fill="#E5E7EB" /> {/* Gray */}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
            {analysis.match_score}%
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-red-500 uppercase tracking-wide">Missing Skills</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {analysis.missing_skills.map((skill) => (
              <span key={skill} className="px-2 py-1 bg-red-50 text-red-600 border border-red-100 rounded text-sm">
                + Add {skill}
              </span>
            ))}
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            Tip: Our Generative AI can rewrite your summary to include these keywords.
          </p>
        </div>
      </div>
    </div>
  );
};

export { ResumeAnalyzer };