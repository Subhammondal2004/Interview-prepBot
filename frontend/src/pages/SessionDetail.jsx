import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { FeedbackCard } from '@/components/practice/FeedbackCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Target, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useEffect, useState  } from 'react';
import axios from 'axios';

export default function SessionDetail() {
  const { sessionId } = useParams();
  const [ session, setSessions ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  // const session = mockSessions.find(s => s.id === sessionId);
  // const category = categories.find(c => c.id === session?.category);

  const URL = import.meta.env.VITE_SERVER_URL;

   useEffect(() => {
    async function fetchSessionByID() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${URL}/sessions/id/${sessionId}`,
          { withCredentials: true }
        );
        setSessions(res.data.data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSessionByID();
  }, [sessionId]);
  console.log(session)

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading session...</p>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Session not found</h1>
          <Link to="/history">
            <Button variant="outline">Back to History</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const scoreColor = session?.score >= 7 
    ? 'text-success' 
    : session?.score >= 4
      ? 'text-warning' 
      : 'text-destructive';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link to="/history" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </Link>

        {/* Session Header */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-3xl">
                {session?.icon || '📝'}
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {session?.domain || 'Unknown'} Practice
                </h1>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(session?.startTime), 'MMMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Target className="h-4 w-4" />
                    {session?.questions?.length} questions
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <TrendingUp className={cn("h-5 w-5", scoreColor)} />
              <div>
                <p className={cn("text-2xl font-bold", scoreColor)}>{session?.score}</p>
                <p className="text-xs text-muted-foreground">Average Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Answers */}
        {session?.questions?.length > 0 ? (
          <div className="space-y-8">
            <h2 className="text-lg font-semibold text-foreground">Detailed Feedback</h2>
            {session?.questions?.map((answer, index) => (
              <div key={answer._id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                    {index + 1}
                  </span>
                  <h3 className="font-medium text-foreground">{answer.questionText}</h3>
                </div>
                
                <div className="pl-11">
                  <div className="rounded-lg bg-muted/50 p-4 mb-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Your Answer:</p>
                    <p className="text-foreground">{answer.userResponse}</p>
                  </div>
                  
                  <FeedbackCard answer={answer} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground animate-fade-in">
            <p>Detailed feedback not available for this session.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
