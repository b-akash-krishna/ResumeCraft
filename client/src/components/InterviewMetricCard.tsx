import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface InterviewMetricCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  color: "blue" | "green" | "amber";
}

export default function InterviewMetricCard({
  title,
  score,
  icon: Icon,
  color,
}: InterviewMetricCardProps) {
  const colorClasses = {
    blue: "text-chart-1",
    green: "text-chart-3",
    amber: "text-chart-4",
  };

  const bgColorClasses = {
    blue: "bg-chart-1",
    green: "bg-chart-3",
    amber: "bg-chart-4",
  };

  return (
    <Card className="p-6" data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-lg ${bgColorClasses[color]}/10 flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colorClasses[color]}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
          <p className={`text-3xl font-bold ${colorClasses[color]}`} data-testid={`text-score-${title.toLowerCase().replace(/\s+/g, "-")}`}>
            {score}%
          </p>
        </div>
      </div>
      <Progress value={score} className="h-2" indicatorClassName={bgColorClasses[color]} />
    </Card>
  );
}
