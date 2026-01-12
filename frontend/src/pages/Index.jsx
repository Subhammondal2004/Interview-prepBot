import { Layout } from "@/components/layout/Layout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import { Button } from "@/components/ui/button";
import { mockSessions, categories, categoryStats } from "@/data/mockData";
import { BookOpen, Target, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  SessionCardSkeleton,
  LoadingSkeleton,
} from "@/components/ui/loading-skeleton";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function Index() {
  const avgImprovement = Math.round(
    categoryStats.reduce((acc, cat) => acc + cat.improvement, 0) /
      categoryStats.length
  );

  const [totalQuestions, setTotalQuestions] = useState(0);
  const [avgScore, setAvgScore] = useState("");
  const [totalSessions, setTotalSession] = useState(0);
  const [domainScore, setDomainScore] = useState([]);
  const [loading, setLoading] = useState(false);

  const URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        await axios
          .get(`${URL}/sessions/monthly-sessions-details`, {
            withCredentials: true,
          })
          .then((res) => {
            setTotalQuestions(res.data.data.totalQuestions);
            setAvgScore(res.data.data.avgScore);
            setTotalSession(res.data.data.totalSessions);
            setDomainScore(res.data.data.domainAvgScore);
          });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [URL]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="rounded-2xl gradient-hero border border-primary/10 p-8 md:p-10">
            <div className="max-w-2xl">
              <motion.h1
                className="text-3xl md:text-4xl font-bold text-foreground mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Master Your Interview Skills
              </motion.h1>
              <motion.p
                className="text-lg text-muted-foreground mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Practice with AI-powered feedback, track your progress, and land
                your dream job.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Link to="/practice">
                  <Button variant="gradient" size="lg" className="gap-2">
                    Start Practicing
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
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
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <StatsCard
                    title="Total Questions"
                    value={totalQuestions}
                    subtitle="Answered so far"
                    icon={<BookOpen className="h-6 w-6" />}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <StatsCard
                    title="Average Score"
                    value={`${avgScore}%`}
                    icon={<Target className="h-6 w-6" />}
                    trend={{ value: avgImprovement, isPositive: true }}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <StatsCard
                    title="Practice Sessions"
                    value={totalSessions}
                    subtitle="This month"
                    icon={<Clock className="h-6 w-6" />}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <StatsCard
                    title="Improvement"
                    value={`+${avgImprovement}%`}
                    subtitle="Since you started"
                    icon={<TrendingUp className="h-6 w-6" />}
                  />
                </motion.div>
              </motion.div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Categories */}
                <div className="lg:col-span-2">
                  <motion.div
                    className="flex items-center justify-between mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h2 className="text-xl font-semibold text-foreground">
                      Practice Categories
                    </h2>
                    <Link
                      to="/practice"
                      className="text-sm text-primary hover:underline"
                    >
                      View all →
                    </Link>
                  </motion.div>
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {categories.map((category, index) => {
                      let avgScore = "";
                      domainScore.map((d) =>
                        d.domain === category.name ? (avgScore = d.avgScore) : 0
                      );
                      return (
                        <motion.div key={category.id} variants={itemVariants}>
                          <CategoryCard
                            id={category.id}
                            name={category.name}
                            icon={category.icon}
                            averageScore={avgScore === "" ? "0" : avgScore}
                          />
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Recent Activity */}
                <motion.div
                  className="lg:col-span-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <RecentActivity />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
