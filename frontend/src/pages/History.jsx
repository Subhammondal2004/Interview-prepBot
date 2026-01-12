import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SessionCard } from '@/components/history/SessionCard';
import { categories } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { SafeIcon } from '@/components/common/SafeIcon';
import { Filter, Calendar, ChevronDown } from 'lucide-react';
import { AnimatedContainer, AnimatedCard } from '@/components/common/AnimatedCard';
import { SessionCardSkeleton, LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function History() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);
      try {
        const res = await axios.get(`${URL}/sessions/all-user-sessions`, {
          withCredentials: true,
        });
        setSessions(res.data.data);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, [URL]);

  const filteredSessions = selectedCategory === 'all'
    ? sessions
    : sessions.filter(s => s.domain === selectedCategory);

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Practice History</h1>
            <p className="text-muted-foreground mt-1">
              Review your past sessions and track improvement
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2" disabled={loading}>
                <SafeIcon icon={Filter} iconClassName="h-4 w-4" />
                {selectedCategoryData?.name || 'All Categories'}
                <SafeIcon icon={ChevronDown} iconClassName="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setSelectedCategory('all')}>
                All Categories
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <SafeIcon
                    icon={category.icon}
                    iconClassName="mr-2 h-4 w-4 text-primary"
                    emojiClassName="mr-2 text-base"
                  />
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {/* Loading State with Animated Skeletons */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Header skeleton */}
              <div className="flex items-center justify-between mb-6">
                <LoadingSkeleton className="h-6 w-32" />
                <LoadingSkeleton className="h-4 w-24" />
              </div>
              {/* Session card skeletons with stagger */}
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <SessionCardSkeleton />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Sessions List */}
              {sessions.length > 0 ? (
                <AnimatedContainer className="space-y-4" staggerDelay={0.08}>
                  {filteredSessions.length > 0 ? (
                    filteredSessions
                      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                      .map((session, index) => (
                        <AnimatedCard key={session.id} index={index}>
                          <SessionCard session={session} />
                        </AnimatedCard>
                      ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No sessions found in this category
                      </h3>
                      <Link to="/practice">
                        <Button variant="outline">Start Practice</Button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatedContainer>
              ) : (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex justify-center mb-4">
                    <motion.div 
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-muted"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
                    >
                      <SafeIcon icon={Calendar} iconClassName="h-8 w-8 text-muted-foreground" />
                    </motion.div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No sessions found</h3>
                  <p className="text-muted-foreground mb-6">
                    {selectedCategory === 'all' 
                      ? "Start practicing to build your history!"
                      : "No sessions in this category yet."}
                  </p>
                  <Link to="/practice">
                    <Button variant="outline">Start Practice</Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
