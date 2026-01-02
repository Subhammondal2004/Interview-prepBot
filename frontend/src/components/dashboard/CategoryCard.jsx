import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import axios from 'axios';

export function CategoryCard({ id, name, icon, averageScore, className }) {
  const [totalquestions, setTotalQuestions ] = useState(0);
  const URL = import.meta.env.VITE_SERVER_URL;
  console.log(averageScore)
  useEffect(()=>{
    async function fetch(){
      await axios.get(`${URL}/questions/question/${name}`)
      .then((res)=>{
        setTotalQuestions(res.data.data.totalquestion);
      })
    }
    fetch();
  },[])
  return (
    <Link
      to={`/practice?category=${id}`}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
          {icon}
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
      </div>
      
      <div className="mt-4 space-y-1">
        <h3 className="text-base font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{totalquestions} questions</p>
      </div>
      
      {averageScore !== 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Your avg. score</span>
            <span className="font-semibold text-primary">{averageScore}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full rounded-full gradient-primary transition-all duration-500"
              style={{ width: `${averageScore}%` }}
            />
          </div>
        </div>
      )}
    </Link>
  );
}
