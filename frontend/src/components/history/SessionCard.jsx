import { format } from 'date-fns';
import { Calendar, Target, TrendingUp, ChevronRight } from 'lucide-react';
import { categories } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function SessionCard({ session }) {
  const category = categories.find(c => c.id === session.category);
  const scoreColor = session.averageScore >= 80 
    ? 'text-success' 
    : session.averageScore >= 60 
      ? 'text-warning' 
      : 'text-destructive';

  return (
    <Link
      to={`/history/${session.id}`}
      className="group block rounded-xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5 animate-fade-in"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
            {category?.icon || '📝'}
          </div>
          
          <div>
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
              {category?.name || 'Unknown'} Practice
            </h3>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {format(session.date, 'MMM d, yyyy')}
              </span>
              <span className="flex items-center gap-1.5">
                <Target className="h-4 w-4" />
                {session.questionsAnswered} questions
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2">
              <TrendingUp className={cn("h-4 w-4", scoreColor)} />
              <span className={cn("text-xl font-bold", scoreColor)}>
                {session.averageScore}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average Score</p>
          </div>
          
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
}
