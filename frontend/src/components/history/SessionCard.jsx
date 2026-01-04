import { format } from 'date-fns';
import { Calendar, Target, TrendingUp, ChevronRight } from 'lucide-react';
import { categories } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function SessionCard({ session }) {
  const category = categories.find(c => c.name === session.domain);
  const scoreColor = session.averageScore >= 7
    ? 'text-success' 
    : session.averageScore >= 4
      ? 'text-warning' 
      : 'text-destructive';

  return (
    <Link
      to={`/history/${session._id}`}
      className="group block rounded-xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5 animate-fade-in"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
            {category?.icon || '📝'}
          </div>
          
          <div>
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
              {session?.domain || 'Unknown'} Practice
            </h3>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {format(session.startTime, 'MMM d, yyyy')}
              </span>
              <span className="flex items-center gap-1.5">
                <Target className="h-4 w-4" />
                {session.questions.length} questions
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2">
              <TrendingUp className={cn("h-4 w-4", scoreColor)} />
              <span className={cn("text-xl font-bold", scoreColor)}>
                {session.score}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1" style={{fontSize:"15px"}}>Score</p>
          </div>
          
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
}
