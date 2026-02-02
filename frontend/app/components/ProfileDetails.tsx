'use client';

interface ProfileDetailsProps {
  name: string;
  about_raw?: string;
  experience_raw?: string;
}

const ProfileDetails = ({ name, about_raw, experience_raw }: ProfileDetailsProps) => {
  return (
    <div 
      className="p-6 rounded-xl border-2 shadow-md space-y-6"
      style={{
        background: '#fff',
        borderColor: '#e9d5ff'
      }}
    >
      {/* Name */}
      <h2 className="text-2xl font-bold" style={{ color: '#1e1b4b' }}>
        {name}
      </h2>

      {/* About Section */}
      {about_raw && (
        <div>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#7c3aed' }}>
            About
          </h3>
          <div 
            className="p-4 rounded-lg text-sm leading-relaxed"
            style={{
              background: '#faf5ff',
              borderLeft: '4px solid #7c3aed',
              color: '#374151'
            }}
          >
            {about_raw}
          </div>
        </div>
      )}

      {/* Experience Section */}
      {experience_raw && (
        <div>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#7c3aed' }}>
            Experience
          </h3>
          <div 
            className="p-4 rounded-lg text-sm leading-relaxed"
            style={{
              background: '#faf5ff',
              borderLeft: '4px solid #7c3aed',
              color: '#374151'
            }}
          >
            {experience_raw}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;