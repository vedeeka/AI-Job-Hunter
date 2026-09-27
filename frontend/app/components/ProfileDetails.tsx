'use client';

import { User, Briefcase, FileText, CheckCircle2 } from 'lucide-react';

interface ProfileDetailsProps {
  name: string;
  about_raw?: string;
  experience_raw?: string;
}

const ProfileDetails = ({ name, about_raw, experience_raw }: ProfileDetailsProps) => {
  return (
    <div className="space-y-6">
      
      {/* Header Profile Identity */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md">
          {name ? name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {name || "Candidate Profile"}
          </h2>
          <span className="text-xs font-semibold text-purple-600 flex items-center gap-1 mt-0.5">
            <CheckCircle2 size={13} className="text-emerald-500" />
            Verified & NER Parsed Profile
          </span>
        </div>
      </div>

      {/* About Section */}
      {about_raw && (
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <User size={13} className="text-purple-600" />
            Professional Summary
          </h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-normal">
            {about_raw}
          </div>
        </div>
      )}

      {/* Experience Section */}
      {experience_raw && (
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Briefcase size={13} className="text-purple-600" />
            Extracted Experience
          </h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-normal">
            {experience_raw}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileDetails;