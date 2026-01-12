import { Layout } from "@/components/layout/Layout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Leaderboard } from "@/components/analytics/Leaderboard";
import { PerformanceChart } from "@/components/analytics/PerformanceChart";
import { CategoryBreakdown } from "@/components/analytics/CategoryBreakdown";
import {
  leaderboardData,
  categoryStats,
  performanceData,
} from "@/data/mockData";
import { TrendingUp, Target, Award, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AnimatedContainer,
  AnimatedCard,
} from "@/components/common/AnimatedCard";
import {
  SessionCardSkeleton,
  LoadingSkeleton,
} from "@/components/ui/loading-skeleton";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Analytics() {
  const avgImprovement = Math.round(
    categoryStats.reduce((acc, cat) => acc + cat.improvement, 0) /
      categoryStats.length
  );
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [overallAverage, setOverallAverage] = useState("");
  const [domainScore, setDomainScore] = useState([]);
  const [bestDomain, setBestDomain] = useState(null);
  const [loading, setLoading] = useState(false);
  const URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    async function fetchAllSessions() {
      setLoading(true);
      try {
        await axios
          .get(`${URL}/sessions/all-sessions-details`, {
            withCredentials: true,
          })
          .then((res) => {
            console.log(res.data);
            setTotalQuestions(res.data.data.totalQuestions);
            setOverallAverage(res.data.data.overallScore);
            setDomainScore(res.data.data.domainAvgScore);
            setBestDomain(res.data.data.bestDomain);
          });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllSessions();
  }, [URL]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-2xl font-bold text-foreground">
            Performance Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and identify areas for improvement
          </p>
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
              {/* Stats Grid */}
              <AnimatedContainer
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                staggerDelay={0.08}
              >
                <AnimatedCard index={0}>
                  <StatsCard
                    title="Overall Score"
                    value={`${overallAverage}%`}
                    icon={<Target className="h-6 w-6" />}
                    trend={{ value: avgImprovement, isPositive: true }}
                  />
                </AnimatedCard>
                <AnimatedCard index={1}>
                  <StatsCard
                    title="Questions Answered"
                    value={totalQuestions}
                    subtitle="All time"
                    icon={<Zap className="h-6 w-6" />}
                  />
                </AnimatedCard>
                <AnimatedCard index={2}>
                  <StatsCard
                    title="Best Category"
                    value={bestDomain?.domain}
                    subtitle={`${bestDomain?.score}% average`}
                    icon={<Award className="h-6 w-6" />}
                  />
                </AnimatedCard>
                <AnimatedCard index={3}>
                  <StatsCard
                    title="Improvement Rate"
                    value={`+${avgImprovement}%`}
                    subtitle="Since starting"
                    icon={<TrendingUp className="h-6 w-6" />}
                  />
                </AnimatedCard>
              </AnimatedContainer>

              {/* Charts Grid */}
              <AnimatedContainer
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
                staggerDelay={0.1}
              >
                <AnimatedCard index={0}>
                  <Leaderboard data={leaderboardData} />
                </AnimatedCard>
                <AnimatedCard index={1}>
                  <PerformanceChart data={performanceData} />
                  <CategoryBreakdown data={domainScore} />
                </AnimatedCard>
              </AnimatedContainer>

              {/* Detailed Stats Table */}
              <motion.div
                className="rounded-xl border border-border bg-card p-6 shadow-soft"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Category Details
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Category
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                          Questions
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                          Time Taken
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                          Avg Score
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Progress
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {domainScore.map((stat, index) => {
                        const scoreColor =
                          stat.score >= 33
                            ? "text-success"
                            : stat.score >= 15
                            ? "text-warning"
                            : "text-destructive";

                        return (
                          <motion.tr
                            key={stat.category}
                            className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.6 + index * 0.08,
                            }}
                          >
                            <td className="py-4 px-4">
                              <span className="font-medium text-foreground">
                                {stat.domain}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center text-muted-foreground">
                              {stat.totalQuestions}
                            </td>
                            <td className="py-4 px-4 text-center text-muted-foreground">
                              {Math.floor(stat.duration)} min{" "}
                              {Math.floor(
                                ((stat.duration * 60000) % 60000) / 1000
                              )}{" "}
                              sec
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={cn("font-semibold", scoreColor)}>
                                {stat.score}%
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full gradient-primary"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${stat.score}%` }}
                                  transition={{
                                    duration: 0.8,
                                    delay: 0.8 + index * 0.1,
                                  }}
                                />
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
