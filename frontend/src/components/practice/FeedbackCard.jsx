import {
  CheckCircle2,
  AlertCircle,
  Target,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { SafeIcon } from '@/components/common/SafeIcon';

export function FeedbackCard({ answer }) {
  const scoreColor =
    answer.score >= 7
      ? "text-success"
      : answer.score >= 4
      ? "text-warning"
      : "text-destructive";

  const scoreLabel =
    answer.score >= 7
      ? "Excellent"
      : answer.score >= 4
      ? "Good"
      : "Needs Improvement";

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Score Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                answer.score >= 7
                  ? "bg-success/10"
                  : answer.score >= 4
                  ? "bg-warning/10"
                  : "bg-destructive/10"
              )}
            >
              <SafeIcon 
                icon={answer.score >= 7 ? CheckCircle2 : AlertCircle } 
                iconClassName={cn("h-6 w-6", answer.score >= 7 ? "text-success" : scoreColor)} 
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Score</p>
              <p className={cn("text-2xl font-bold", scoreColor)}>
                {answer.score}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span
              className={cn(
                "inline-block px-3 py-1 rounded-full text-sm font-medium",
                answer.score >= 7
                  ? "bg-success/10 text-success"
                  : answer.score >= 4
                  ? "bg-warning/10 text-warning"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {scoreLabel}
            </span>
          </div>
        </div>
        <Progress value={answer.score} className="h-2" />
      </div>

      {/* Feedback Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <SafeIcon icon={Target} iconClassName="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Feedback</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {answer.feedback}
        </p>
      </div>
      {/* Improvements Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
           <SafeIcon icon={TrendingUp} iconClassName="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">
            How to Improve
          </h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {answer.aiResponse}
        </p>
      </div>
    </div>
  );
}
