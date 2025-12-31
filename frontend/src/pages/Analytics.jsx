import { Layout } from '@/components/layout/Layout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PerformanceChart } from '@/components/analytics/PerformanceChart';
import { CategoryBreakdown } from '@/components/analytics/CategoryBreakdown';
import { performanceData, categoryStats } from '@/data/mockData';
import { TrendingUp, Target, Award, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Analytics() {
  const totalQuestions = categoryStats.reduce((acc, cat) => acc + cat.totalQuestions, 0);
  const overallAverage = Math.round(
    categoryStats.reduce((acc, cat) => acc + cat.averageScore, 0) / categoryStats.length
  );
  const bestCategory = [...categoryStats].sort((a, b) => b.averageScore - a.averageScore)[0];
  const avgImprovement = Math.round(
    categoryStats.reduce((acc, cat) => acc + cat.improvement, 0) / categoryStats.length
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Performance Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and identify areas for improvement
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Overall Score"
            value={`${overallAverage}%`}
            icon={<Target className="h-6 w-6" />}
            trend={{ value: avgImprovement, isPositive: true }}
          />
          <StatsCard
            title="Questions Answered"
            value={totalQuestions}
            subtitle="All time"
            icon={<Zap className="h-6 w-6" />}
          />
          <StatsCard
            title="Best Category"
            value={bestCategory.category}
            subtitle={`${bestCategory.averageScore}% average`}
            icon={<Award className="h-6 w-6" />}
          />
          <StatsCard
            title="Improvement Rate"
            value={`+${avgImprovement}%`}
            subtitle="Since starting"
            icon={<TrendingUp className="h-6 w-6" />}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PerformanceChart data={performanceData} />
          <CategoryBreakdown data={categoryStats} />
        </div>

        {/* Detailed Stats Table */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft animate-slide-up">
          <h3 className="text-lg font-semibold text-foreground mb-6">Category Details</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Questions</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Avg Score</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Improvement</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Progress</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.map((stat, index) => {
                  const scoreColor = stat.averageScore >= 80 
                    ? 'text-success' 
                    : stat.averageScore >= 60 
                      ? 'text-warning' 
                      : 'text-destructive';
                  
                  return (
                    <tr 
                      key={stat.category} 
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-4 px-4">
                        <span className="font-medium text-foreground">{stat.category}</span>
                      </td>
                      <td className="py-4 px-4 text-center text-muted-foreground">
                        {stat.totalQuestions}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={cn("font-semibold", scoreColor)}>
                          {stat.averageScore}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-success font-medium">
                          <TrendingUp className="h-3 w-3" />
                          +{stat.improvement}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full rounded-full gradient-primary transition-all duration-500"
                            style={{ width: `${stat.averageScore}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
