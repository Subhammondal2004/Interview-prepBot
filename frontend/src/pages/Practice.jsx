import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { QuestionCard } from '@/components/practice/QuestionCard';
import { AnswerInput } from '@/components/practice/AnswerInput';
import { FeedbackCard } from '@/components/practice/FeedbackCard';
import { Button } from '@/components/ui/button';
import { questions, categories, mockAnswers } from '@/data/mockData';
import { RefreshCw, Filter, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Practice() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredQuestions = useMemo(() => {
    if (selectedCategory === 'all') return questions;
    return questions.filter(q => q.category === selectedCategory);
  }, [selectedCategory]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleCategoryChange = (categoryId) => {
    setSearchParams({ category: categoryId });
    setCurrentQuestionIndex(0);
    setFeedback(null);
  };

  const handleSubmitAnswer = async (answer) => {
    setIsLoading(true);
    
    // Simulate AI evaluation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock feedback
    const score = Math.floor(Math.random() * 30) + 60;
    const mockFeedback = {
      id: `answer-${Date.now()}`,
      questionId: currentQuestion?.id || '',
      question: currentQuestion,
      userAnswer: answer,
      score,
      feedback: score >= 80 
        ? 'Excellent response! You demonstrated strong understanding and provided specific examples.'
        : score >= 60 
          ? 'Good attempt! Your answer covers the basics but could benefit from more specific details.'
          : 'Your answer needs improvement. Try to structure your response better and include concrete examples.',
      improvements: [
        'Add more specific examples from your experience',
        'Structure your answer using the STAR method',
        'Include measurable outcomes when possible',
        'Be more concise while maintaining key details',
      ],
      idealAnswer: `A strong answer would include: specific situation context with relevant background, clear description of your role and responsibilities, detailed actions you took with reasoning, and quantifiable results that demonstrate impact.`,
      timestamp: new Date(),
    };
    
    setFeedback(mockFeedback);
    setIsLoading(false);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % filteredQuestions.length);
    setFeedback(null);
  };

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Practice Interview</h1>
            <p className="text-muted-foreground mt-1">
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {selectedCategoryData?.name || 'All Categories'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleCategoryChange('all')}>
                  All Categories
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Question */}
        {currentQuestion ? (
          <div className="space-y-6">
            <QuestionCard question={currentQuestion} />
            
            {!feedback ? (
              <AnswerInput onSubmit={handleSubmitAnswer} isLoading={isLoading} />
            ) : (
              <>
                <FeedbackCard answer={feedback} />
                
                <div className="flex justify-center pt-4">
                  <Button onClick={handleNextQuestion} variant="gradient" size="lg" className="gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Next Question
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No questions available for this category.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => handleCategoryChange('all')}
            >
              View All Questions
            </Button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex items-center gap-2 justify-center">
            {filteredQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setFeedback(null);
                }}
                className={cn(
                  "h-2 rounded-full transition-all duration-200",
                  index === currentQuestionIndex 
                    ? "w-8 bg-primary" 
                    : "w-2 bg-muted hover:bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
