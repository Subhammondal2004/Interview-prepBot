import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/mockData";
import { Play, Send, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { FeedbackCard } from "@/components/practice/FeedbackCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

const difficulties = ["Easy", "Medium", "Hard"];

export default function Practice() {
  const URL = import.meta.env.VITE_SERVER_URL;

  // Session setup state
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [domain, setDomain] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questions, setQuestions] = useState([]);
  const [session, setSession] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  // Practice state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSession, setSubmittedSession] = useState(null);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer =
    answers.find((a) => a.questionId === currentQuestion._id)?.answer || "";

  const handleStartSession = async () => {
    if (!domain || !difficulty) return;
    setIsStarting(true);
    await axios
      .post(
        `${URL}/sessions/start-session`,
        {
          domain,
          difficulty,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setSession(res.data.data.sessionCreated);
        setQuestions(res.data.data.questions);
        setSessionStarted(true);
        setAnswers([]);
        setCurrentQuestionIndex(0);
        setSessionEnded(false);
        setIsStarting(false);
      });
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => {
      const index = prev.findIndex((a) => a.questionId === questionId);

      if (index !== -1) {
        const updated = [...prev];
        updated[index] = { questionId, answer };
        return updated;
      }
      return [...prev, { questionId, answer }];
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitSession = async () => {
    setIsSubmitting(true);
    const answersArray = questions.map((q) => ({
      questionId: q._id,
      userResponse: answers.find((a) => a.questionId === q._id)?.answer || "",
    }));
    await axios
      .post(
        `${URL}/sessions/submit`,
        { sessionId: session._id, answers: answersArray },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data.data);
        setSubmittedSession(res.data.data);
        setAnswers(res.data.data.questions);
        setSessionEnded(true);
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error("Error submitting session:", error);
        setIsSubmitting(false);
      });
  };

  const handleNewSession = () => {
    setSessionStarted(false);
    setSessionEnded(false);
    setDomain("");
    setDifficulty("");
    setAnswers([]);
    setCurrentQuestionIndex(0);
  };

  const answeredCount = answers.filter((a) => a.answer?.trim()).length;

  // Setup Screen
  if (!sessionStarted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-xl">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Start Practice Session
            </h1>
            <p className="text-muted-foreground">
              Select your domain and difficulty to begin
            </p>
          </div>

          <div className="space-y-6 animate-slide-up">
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Domain
                </label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        <span className="flex items-center gap-2">
                          <span>{cat?.icon}</span>
                          {cat.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Difficulty
                </label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff}>
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleStartSession}
                disabled={!domain || !difficulty}
                variant="gradient"
                size="lg"
                className="w-full mt-4 gap-2"
              >
                { isStarting ? (
                  <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Starting Session...
                </>
                ):(
                  <>
                  <Play className="h-4 w-4" />
                  Start Session
                </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Results Screen
  if (sessionEnded) {
    const totalScore = submittedSession.score;
    const averageScore = Math.round(totalScore / answers.length);

    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Session Complete
            </h1>
            <p className="text-muted-foreground">
              Total Score:{" "}
              <span
                className={cn(
                  "font-bold",
                  averageScore >= 7
                    ? "text-success"
                    : averageScore >= 4
                    ? "text-warning"
                    : "text-destructive"
                )}
              >
                {totalScore}
              </span>
            </p>
            <p className="text-muted-foreground">
              Time Taken(duration):{" "}
              {Math.floor(submittedSession.duration)} min {Math.floor(((submittedSession.duration * 60000) % 60000)/1000)} sec
            </p>
          </div>

          <div className="space-y-8 animate-slide-up">
            {answers.map((answer, index) => (
              <div key={answer._id} className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-4">
                  <span className="text-xs font-medium text-primary">
                    Question {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mt-1">
                    { answer.questionText }
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium">Your Answer:</span>{" "}
                    {answer.userResponse || "No answer provided"}
                  </p>
                </div>
                <FeedbackCard answer={answer} />
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-8">
            <Button
              onClick={handleNewSession}
              variant="gradient"
              size="lg"
              className="gap-2"
            >
              Start New Session
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Practice Screen (answering questions)
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Practice Session
            </h1>
            <p className="text-muted-foreground text-sm">
              {answeredCount} of {questions.length} answered
            </p>
          </div>
          <Button
            onClick={handleSubmitSession}
            disabled={isSubmitting}
            variant="gradient"
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit All
              </>
            )}
          </Button>
        </div>

        {questions.length > 0 && currentQuestion ? (
          <div className="space-y-6 animate-slide-up">
            {/* Question Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded",
                    currentQuestion.difficulty?.toLowerCase() === "easy"
                      ? "bg-success/10 text-success"
                      : currentQuestion.difficulty?.toLowerCase() === "medium"
                      ? "bg-warning/10 text-warning"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {currentQuestion.difficulty}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {currentQuestion.questionText}
              </h2>
            </div>

            {/* Answer Input */}
            <div className="space-y-2">
              <Textarea
                placeholder="Type your answer here..."
                value={currentAnswer}
                onChange={(e) =>
                  handleAnswerChange(currentQuestion._id, e.target.value)
                }
                className="min-h-[180px] resize-none text-base p-4"
                disabled={isSubmitting}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-200",
                      index === currentQuestionIndex
                        ? "w-6 bg-primary"
                        : answers[questions[index]?.id]?.trim()
                        ? "w-2 bg-success"
                        : "w-2 bg-muted hover:bg-muted-foreground/30"
                    )}
                  />
                ))}
              </div>

              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                variant="outline"
                className="gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No questions available for selected criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleNewSession}
            >
              Change Selection
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
