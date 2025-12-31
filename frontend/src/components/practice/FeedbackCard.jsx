import { CheckCircle2, AlertCircle, Lightbulb, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export function FeedbackCard({ answer }) {
  const scoreColor = answer.score >= 80 
    ? 'text-success' 
    : answer.score >= 60 
      ? 'text-warning' 
      : 'text-destructive';

  const scoreLabel = answer.score >= 80 
    ? 'Excellent' 
    : answer.score >= 60 
      ? 'Good' 
      : 'Needs Improvement';

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Score Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full",
              answer.score >= 80 ? "bg-success/10" : answer.score >= 60 ? "bg-warning/10" : "bg-destructive/10"
            )}>
              {answer.score >= 80 ? (
                <CheckCircle2 className="h-6 w-6 text-success" />
              ) : (
                <AlertCircle className={cn("h-6 w-6", scoreColor)} />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Score</p>
              <p className={cn("text-2xl font-bold", scoreColor)}>{answer.score}%</p>
            </div>
          </div>
          <div className="text-right">
            <span className={cn(
              "inline-block px-3 py-1 rounded-full text-sm font-medium",
              answer.score >= 80 
                ? "bg-success/10 text-success" 
                : answer.score >= 60 
                  ? "bg-warning/10 text-warning" 
                  : "bg-destructive/10 text-destructive"
            )}>
              {scoreLabel}
            </span>
          </div>
        </div>
        <Progress value={answer.score} className="h-2" />
      </div>

      {/* Feedback Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Feedback</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">{answer.feedback}</p>
      </div>

      {/* Improvements Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">How to Improve</h3>
        </div>
        <ul className="space-y-3">
          {answer.improvements.map((improvement, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-medium shrink-0">
                {index + 1}
              </span>
              <span className="text-muted-foreground">{improvement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Ideal Answer Section */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Ideal Answer Approach</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">{answer.idealAnswer}</p>
      </div>
    </div>
  );
}
