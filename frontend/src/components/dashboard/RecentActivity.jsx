import { formatDistanceToNow } from 'date-fns';
import { Clock, Target, TrendingUp } from 'lucide-react';
import { categories } from '@/data/mockData';
import { useState, useEffect } from 'react';
import axios from 'axios';

export function RecentActivity() {
  const [ sessions, setSessions ] = useState([]);
  const URL = import.meta.env.VITE_SERVER_URL;
  useEffect(()=>{
    async function fetchSessions(){
      await axios.get(`${URL}/sessions/all-user-sessions`,
        { withCredentials: true }
      ).then((res)=>{
        setSessions(res.data.data);
      })
    }
    fetchSessions();
  },[])
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-soft animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Sessions</h3>
      
      <div className="space-y-4">
        {sessions.slice(0, 5).map((session) => {
          const category = categories.find(c => c.id === session.domain);
          
          return (
            <div
              key={session._id}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">
                {category?.icon || '📝'}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {session?.domain || 'Unknown'} Practice
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {session?.questions?.length} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(session?.startTime, { addSuffix: true })}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{session.score}</p>
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
