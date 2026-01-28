'use client';

const SkillList = ({ skills }) => {
  console.log('Skills data:', skills);

  if (!skills || skills.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
        <p className="text-gray-500 text-sm">No skills to display</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {skills.map((skill, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition"
          >
            {/* Skill Name */}
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-900">
                {skill.name}
              </h4>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {skill.proficiency}
              </span>
            </div>

            {/* Category */}
            <p className="text-sm text-gray-600">
              Category: <span className="font-medium">{skill.category}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillList;
