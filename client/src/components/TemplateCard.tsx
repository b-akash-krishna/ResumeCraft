import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface TemplateCardProps {
  name: string;
  description: string;
  selected?: boolean;
  onSelect: () => void;
}

export default function TemplateCard({
  name,
  description,
  selected = false,
  onSelect,
}: TemplateCardProps) {
  return (
    <Card
      className={`relative overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all ${
        selected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onSelect}
      data-testid={`card-template-${name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="aspect-[8.5/11] bg-gradient-to-br from-card to-muted p-4 flex flex-col gap-2">
        <div className="h-4 bg-foreground/10 rounded w-3/4"></div>
        <div className="h-2 bg-foreground/5 rounded w-1/2"></div>
        <div className="mt-4 space-y-2">
          <div className="h-2 bg-foreground/5 rounded"></div>
          <div className="h-2 bg-foreground/5 rounded w-5/6"></div>
          <div className="h-2 bg-foreground/5 rounded w-4/6"></div>
        </div>
        <div className="mt-4 space-y-1">
          <div className="h-3 bg-foreground/10 rounded w-2/3"></div>
          <div className="h-2 bg-foreground/5 rounded"></div>
          <div className="h-2 bg-foreground/5 rounded w-5/6"></div>
        </div>
      </div>
      
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      
      <div className="p-4 border-t">
        <h3 className="font-semibold mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          variant={selected ? "default" : "outline"}
          className="w-full mt-3"
          data-testid={`button-select-${name.toLowerCase().replace(/\s+/g, "-")}`}
        >
          {selected ? "Selected" : "Select Template"}
        </Button>
      </div>
    </Card>
  );
}
