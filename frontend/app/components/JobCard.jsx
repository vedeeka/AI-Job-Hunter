'use client'
import { BadgeCheck, AlertTriangle, DollarSign, Briefcase } from 'lucide-react';

const JobCard = ({ job }) => {
  // Color logic for Scam Score
  const trustColor = job.trust_score > 80 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  const TrustIcon = job.trust_score > 80 ? BadgeCheck : AlertTriangle;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
          <p className="text-gray-500">{job.company} • {job.location}</p>
        </div>
        
        {/* ML Feature: Scam Detector Badge */}
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${trustColor}`}>
          <TrustIcon size={14} />
          {job.trust_score}% Trust
        </div>
      </div>

      <div className="mt-4 flex gap-4">
        {/* ML Feature: Salary Prediction */}
        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
          <DollarSign size={16} className="text-green-600" />
          <span>
            AI Est: <span className="font-bold">${job.predicted_salary.toLocaleString()}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
          <Briefcase size={16} className="text-blue-600" />
          <span>{job.type}</span>
        </div>
      </div>

      <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
        Auto-Apply via AI
      </button>
    </div>
  );
};

export default JobCard;