'use client';

interface ProfileDetailsProps {
  name: string;
  about_raw?: string;
  experience_raw?: string;
}

const ProfileDetails = ({ name, about_raw, experience_raw }: ProfileDetailsProps) => {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-6">
      {/* Name */}
      <h2 className="text-xl font-bold text-gray-900">{name}</h2>

      {/* About Section */}
      {about_raw && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
          <p className="text-gray-700 text-sm leading-relaxed">{about_raw}</p>
        </div>
      )}

      {/* Experience Section */}
      {experience_raw && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Experience</h3>
          <p className="text-gray-700 text-sm leading-relaxed">{experience_raw}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
