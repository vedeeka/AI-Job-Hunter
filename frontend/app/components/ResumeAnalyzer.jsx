'use client'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ResumeAnalyzer = ({ analysis }) => {
  const data = [
    { name: 'Match', value: analysis.match_score },
    { name: 'Gap', value: 100 - analysis.match_score },
  ];

  return (
    <div 
      className="p-6 rounded-xl shadow-md border-2"
      style={{
        background: '#fff',
        borderColor: '#e9d5ff'
      }}
    >
      <h2 className="text-xl font-bold mb-6" style={{ color: '#1e1b4b' }}>
        Resume Fit Analysis
      </h2>
      
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Visualization: Match Score Gauge */}
        <div className="w-40 h-40 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={40} outerRadius={60} dataKey="value">
                <Cell fill="#7c3aed" /> {/* Vibrant Purple */}
                <Cell fill="#e9d5ff" /> {/* Light Purple */}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div 
            className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
            style={{ color: '#7c3aed' }}
          >
            {analysis.match_score}%
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="flex-1 space-y-4">
          <h4 
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: '#dc2626' }}
          >
            Missing Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.missing_skills.map((skill) => (
              <span 
                key={skill} 
                className="px-3 py-1.5 border-2 rounded-lg text-sm font-medium transition hover:shadow-md"
                style={{
                  background: '#fef2f2',
                  borderColor: '#fecaca',
                  color: '#dc2626'
                }}
              >
                + Add {skill}
              </span>
            ))}
          </div>
          
          <p 
            className="text-xs mt-4 leading-relaxed"
            style={{ color: '#6b7280' }}
          >
            💡 <span style={{ color: '#7c3aed', fontWeight: '600' }}>Tip:</span> Our Generative AI can rewrite your summary to include these keywords.
          </p>
        </div>
      </div>
    </div>
  );
};

export { ResumeAnalyzer };