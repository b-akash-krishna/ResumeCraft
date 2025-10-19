import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Edit, Trash2 } from "lucide-react";

interface ResumeCardProps {
  id: string;
  title: string;
  lastEdited: string;
  atsScore: number;
}

export default function ResumeCard({ id, title, lastEdited, atsScore }: ResumeCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-chart-3/10 text-chart-3";
    if (score >= 60) return "bg-chart-4/10 text-chart-4";
    return "bg-chart-5/10 text-chart-5";
  };

  return (
    <Card className="hover-elevate active-elevate-2 overflow-hidden" data-testid={`card-resume-${id}`}>
      <div className="aspect-[8.5/11] bg-gradient-to-br from-card to-muted border-b relative">
        <div className="absolute top-3 right-3">
          <Badge className={getScoreColor(atsScore)} data-testid={`badge-ats-${id}`}>
            {atsScore}% ATS
          </Badge>
        </div>
        <div className="p-6 space-y-2">
          <div className="h-4 bg-foreground/10 rounded w-3/4"></div>
          <div className="h-2 bg-foreground/5 rounded w-1/2"></div>
          <div className="mt-4 space-y-2">
            <div className="h-2 bg-foreground/5 rounded"></div>
            <div className="h-2 bg-foreground/5 rounded w-5/6"></div>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold flex items-center gap-2" data-testid={`text-resume-title-${id}`}>
            <FileText className="w-4 h-4 text-primary" />
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1" data-testid={`text-resume-date-${id}`}>
            Last edited {lastEdited}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 gap-2" data-testid={`button-edit-${id}`}>
            <Edit className="w-3 h-3" />
            Edit
          </Button>
          <Button size="sm" variant="outline" className="gap-2" data-testid={`button-download-${id}`}>
            <Download className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" className="gap-2" data-testid={`button-delete-${id}`}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
