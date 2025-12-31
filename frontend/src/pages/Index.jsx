import { Layout } from '@/components/layout/Layout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { CategoryCard } from '@/components/dashboard/CategoryCard';
import { Button } from '@/components/ui/button';
import { mockSessions, categories, categoryStats } from '@/data/mockData';
import { BookOpen, Target, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const totalQuestions = categoryStats.reduce((acc, cat) => acc + cat.totalQuestions, 0);
  const overallAverage = Math.round(
    categoryStats.reduce((acc, cat) => acc + cat.averageScore, 0) / categoryStats.length
  );
  const totalSessions = mockSessions.length;
  const avgImprovement = Math.round(
    categoryStats.reduce((acc, cat) => acc + cat.improvement, 0) / categoryStats.length
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-10 animate-fade-in">
          <div className="rounded-2xl gradient-hero border border-primary/10 p-8 md:p-10">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Master Your Interview Skills
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Practice with AI-powered feedback, track your progress, and land your dream job.
              </p>
              <Link to="/practice">
                <Button variant="gradient" size="lg" className="gap-2">
                  Start Practicing
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatsCard
            title="Total Questions"
            value={totalQuestions}
            subtitle="Answered so far"
            icon={<BookOpen className="h-6 w-6" />}
          />
          <StatsCard
            title="Average Score"
            value={`${overallAverage}%`}
            icon={<Target className="h-6 w-6" />}
            trend={{ value: avgImprovement, isPositive: true }}
          />
          <StatsCard
            title="Practice Sessions"
            value={totalSessions}
            subtitle="This month"
            icon={<Clock className="h-6 w-6" />}
          />
          <StatsCard
            title="Improvement"
            value={`+${avgImprovement}%`}
            subtitle="Since you started"
            icon={<TrendingUp className="h-6 w-6" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Practice Categories</h2>
              <Link to="/practice" className="text-sm text-primary hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((category) => {
                const stats = categoryStats.find(
                  s => s.category.toLowerCase() === category.name.toLowerCase()
                );
                return (
                  <CategoryCard
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    icon={category.icon}
                    questionsCount={stats?.totalQuestions || 0}
                    averageScore={stats?.averageScore}
                  />
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity sessions={mockSessions} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
