'use client';

const SkillList = ({ skills }) => {
  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
      <h3 className="text-sm font-bold text-white mb-2">Skills</h3>
      <ul className="text-gray-200 text-sm space-y-1">
        {skills.map((s) => (
          <li key={s.skill} className="p-1 bg-gray-800 rounded">
            {s.skill} <span className="text-gray-400 text-xs">({s.category})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillList;
