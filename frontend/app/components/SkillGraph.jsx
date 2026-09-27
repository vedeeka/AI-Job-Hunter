'use client';

import { Zap, Code, Database, Layout, Sparkles } from 'lucide-react';

const SkillList = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400">
        <Sparkles size={24} className="mx-auto mb-2 text-purple-300" />
        <p className="text-xs font-semibold">No skills extracted yet</p>
      </div>
    );
  }

  const getCategoryColor = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('program') || c.includes('code')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (c.includes('front') || c.includes('ui')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (c.includes('back') || c.includes('api')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (c.includes('ai') || c.includes('ml')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Technical Skills Matrix</h3>
          <p className="text-xs text-slate-500">Extracted and structured by AI from your work history</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
          {skills.length} Skills
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {skills.map((skill, index) => (
          <div 
            key={index}
            className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-purple-300 hover:bg-white hover:shadow-sm transition-all flex items-center justify-between group"
          >
            <div>
              <h4 className="font-bold text-slate-900 text-xs group-hover:text-purple-600 transition-colors">
                {skill.name}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {skill.category || 'Engineering'}
              </p>
            </div>

            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${getCategoryColor(skill.category)}`}>
              {skill.proficiency || 'Verified'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillList;