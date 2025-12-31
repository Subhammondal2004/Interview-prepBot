import { formatDistanceToNow } from 'date-fns';
import { Clock, Target, TrendingUp } from 'lucide-react';
import { categories } from '@/data/mockData';

export function RecentActivity({ sessions }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-soft animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Sessions</h3>
      
      <div className="space-y-4">
        {sessions.slice(0, 5).map((session) => {
          const category = categories.find(c => c.id === session.category);
          
          return (
            <div
              key={session.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">
                {category?.icon || '📝'}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {category?.name || 'Unknown'} Practice
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {session.questionsAnswered} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(session.date, { addSuffix: true })}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{session.averageScore}%</p>
                  <p className="text-xs text-muted-foreground">Score</p>
                </div>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
