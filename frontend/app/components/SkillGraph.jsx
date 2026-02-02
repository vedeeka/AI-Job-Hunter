'use client';

const SkillList = ({ skills }) => {
  console.log('Skills data:', skills);

  if (!skills || skills.length === 0) {
    return (
      <div className="p-6 rounded-xl border-2" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#1e1b4b' }}>Skills</h3>
        <p className="text-sm" style={{ color: '#9ca3af' }}>No skills to display</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl border-2 shadow-sm" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: '#1e1b4b' }}>Skills & Expertise</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {skills.map((skill, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg border-2 transition-all"
            style={{ 
              borderColor: '#e9d5ff',
              background: '#faf5ff'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#c4b5fd';
              e.currentTarget.style.background = '#f3f0ff';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(124, 58, 237, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e9d5ff';
              e.currentTarget.style.background = '#faf5ff';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Skill Name */}
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold" style={{ color: '#1e1b4b' }}>
                {skill.name}
              </h4>
              <span 
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  background: '#faf5ff',
                  color: '#7c3aed',
                  border: '1px solid #e9d5ff'
                }}
              >
                {skill.proficiency}
              </span>
            </div>

            {/* Category */}
            <p className="text-sm" style={{ color: '#6b7280' }}>
              Category: <span className="font-medium" style={{ color: '#7c3aed' }}>{skill.category}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillList;