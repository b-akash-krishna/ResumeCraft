import ResumeCard from '../ResumeCard';

export default function ResumeCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <ResumeCard
        id="1"
        title="Software Engineer Resume"
        lastEdited="2 days ago"
        atsScore={85}
      />
    </div>
  );
}
