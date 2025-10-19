import InterviewMetricCard from '../InterviewMetricCard';
import { Smile } from 'lucide-react';

export default function InterviewMetricCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <InterviewMetricCard
        title="Confidence Score"
        score={81}
        icon={Smile}
        color="blue"
      />
    </div>
  );
}
