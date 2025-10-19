import InterviewHistoryCard from '../InterviewHistoryCard';

export default function InterviewHistoryCardExample() {
  return (
    <div className="p-4">
      <InterviewHistoryCard
        id="1"
        role="Software Engineer"
        date="Oct 15, 2024"
        duration="25 min"
        score={81}
        type="Technical"
      />
    </div>
  );
}
