import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, Clock } from "lucide-react";

interface InterviewHistoryCardProps {
  id: string;
  role: string;
  date: string;
  duration: string;
  score: number;
  type: "Technical" | "HR" | "Mixed";
}

export default function InterviewHistoryCard({
  id,
  role,
  date,
  duration,
  score,
  type,
}: InterviewHistoryCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-chart-3/10 text-chart-3";
    if (score >= 60) return "bg-chart-4/10 text-chart-4";
    return "bg-chart-5/10 text-chart-5";
  };

  return (
    <Card className="p-4 hover-elevate active-elevate-2" data-testid={`card-interview-${id}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1" data-testid={`text-interview-role-${id}`}>{role}</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {duration}
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">{type}</Badge>
              <Badge className={getScoreColor(score)} data-testid={`badge-score-${id}`}>
                Score: {score}%
              </Badge>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" data-testid={`button-view-${id}`}>
          View Report
        </Button>
      </div>
    </Card>
  );
}
