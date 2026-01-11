import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SafeIcon } from '@/components/common/SafeIcon';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useEffect, useState } from 'react';

export function CategoryCard({ id, name, icon,averageScore, className }) {
  const [totalquestions, setTotalQuestions] = useState(0);
  const URL = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    async function fetch() {
      await axios.get(`${URL}/questions/question/${name}`).then((res) => {
        setTotalQuestions(res.data.data.totalquestion);
      });
    }
    fetch();
  }, []);
  return (
    <Link
      to={`/practice?category=${id}`}
      className={cn(
        "group block relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-soft",
        className
      )}
    >
      <motion.div
        className="h-full"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex items-start justify-between">
          <motion.div 
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <SafeIcon
              icon={icon}
              iconClassName="h-6 w-6 text-primary"
              emojiClassName="text-2xl"
              fallback="📚"
            />
          </motion.div>
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </motion.div>
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
              <motion.div 
                className="h-full rounded-full gradient-primary"
                initial={{ width: 0 }}
                animate={{ width: `${averageScore}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </Link>
  );
}