import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

const difficultyColors = {
  easy: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  hard: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function QuestionCard({ question, showAnswerType = true }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-soft animate-scale-in">
      <div className="flex items-start justify-between gap-4 mb-4">
        <Badge 
          variant="outline" 
          className={cn("capitalize", difficultyColors[question.difficulty])}
        >
          {question.difficulty}
        </Badge>
        <Badge variant="secondary" className="capitalize">
          {question.category}
        </Badge>
      </div>
      
      <h2 className="text-xl font-semibold text-foreground leading-relaxed">
        {question.text}
      </h2>
      
      {showAnswerType && (
        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Expected Answer Type</p>
              <p className="text-sm text-muted-foreground mt-1">{question.expectedAnswerType}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
