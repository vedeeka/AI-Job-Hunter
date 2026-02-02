import ResumeTailor from '../../components/ResumeTailor';

export const metadata = {
  title: 'Resume Doctor | AI Job Hunter',
  description: 'Generate ATS-friendly resumes tailored to specific job descriptions.',
};

export default function ResumePage() {
  return (
    <div 
      className="min-h-[80vh] flex flex-col justify-center"
      style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f3f0ff 50%, #faf8ff 100%)' }}
    >
      <ResumeTailor />
    </div>
  );
}