import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface ATSScoreMeterProps {
  score: number;
  className?: string;
}

export default function ATSScoreMeter({ score, className = "" }: ATSScoreMeterProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-chart-3";
    if (score >= 60) return "text-chart-4";
    return "text-chart-5";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent - Ready to submit";
    if (score >= 60) return "Good - Minor improvements needed";
    if (score >= 40) return "Fair - Needs optimization";
    return "Poor - Requires major improvements";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-chart-3";
    if (score >= 60) return "bg-chart-4";
    return "bg-chart-5";
  };

  return (
    <Card className={`p-6 ${className}`} data-testid="card-ats-score">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground">ATS Score</h3>
          <span className={`text-3xl font-bold ${getScoreColor(score)}`} data-testid="text-ats-score">
            {score}%
          </span>
        </div>
        <Progress value={score} className="h-3" indicatorClassName={getProgressColor(score)} />
        <p className="text-sm text-muted-foreground" data-testid="text-ats-label">
          {getScoreLabel(score)}
        </p>
      </div>
    </Card>
  );
}
