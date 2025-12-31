import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';

export function AnswerInput({ onSubmit, isLoading, disabled }) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer);
      setAnswer('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="relative">
        <Textarea
          placeholder="Type your answer here... Be detailed and specific."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          className="min-h-[200px] resize-none text-base p-4 pr-24"
        />
        <div className="absolute bottom-3 right-3">
          <Button
            onClick={handleSubmit}
            disabled={!answer.trim() || disabled || isLoading}
            variant="gradient"
            size="sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit
              </>
            )}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Press ⌘ + Enter to submit • Be detailed for better feedback
      </p>
    </div>
  );
}
