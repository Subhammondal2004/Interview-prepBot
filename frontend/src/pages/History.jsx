import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SessionCard } from '@/components/history/SessionCard';
import { mockSessions, categories } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Filter, Calendar, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function History() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredSessions = selectedCategory === 'all'
    ? mockSessions
    : mockSessions.filter(s => s.category === selectedCategory);

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Practice History</h1>
            <p className="text-muted-foreground mt-1">
              Review your past sessions and track improvement
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {selectedCategoryData?.name || 'All Categories'}
                <ChevronDown className="h-4 w-4" />
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
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Sessions List */}
        {filteredSessions.length > 0 ? (
          <div className="space-y-4">
            {filteredSessions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((session, index) => (
                <div 
                  key={session.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <SessionCard session={session} />
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No sessions found</h3>
            <p className="text-muted-foreground mb-6">
              {selectedCategory === 'all' 
                ? "Start practicing to build your history!"
                : "No sessions in this category yet."}
            </p>
            <Button 
              variant="outline"
              onClick={() => setSelectedCategory('all')}
            >
              View All Sessions
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
