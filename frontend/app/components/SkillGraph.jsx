'use client';

const SkillList = ({ skills }) => {
  console.log('Skills data:', skills);

  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
      <h3 className="text-sm font-bold text-white mb-2">Skills</h3>

      <ul className="text-gray-200 text-sm space-y-3">
        {skills.map((skill, index) => (
          <li key={index} className="border-b border-gray-800 pb-2">
            <p className="font-semibold text-white">{skill.name}</p>
            <p className="text-gray-400">{skill.about_raw}</p>
            <p className="text-gray-500">{skill.experience_raw}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillList;
