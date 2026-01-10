import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2, Search, Filter } from "lucide-react";
import { categories } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { SafeIcon } from "@/components/common/SafeIcon";
import { cn } from "@/lib/utils";
import axios from "axios";

const difficultyColors = {
  easy: "bg-success/20 text-success border-success/30",
  medium: "bg-warning/20 text-warning border-warning/30",
  hard: "bg-destructive/20 text-destructive border-destructive/30",
};

export default function QuestionBank() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [Questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    text: "",
    category: "",
    difficulty: "",
    expectedAnswerType: "",
  });

  const URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    async function getQuestion() {
      setLoading(true);
      await axios
        .get(`${URL}/questions/user-question`, { withCredentials: true })
        .then((res) => {
          setQuestions(res.data.data);
          setLoading(false);
        });
    }
    getQuestion();
  }, []);

  const resetForm = () => {
    setFormData({
      text: "",
      category: "",
      difficulty: "",
      expectedAnswerType: "",
    });
    setEditingQuestion(null);
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(
        `${URL}/questions/create-question`,
        {
          domain: formData.category,
          difficulty: formData.difficulty,
          question: formData.text,
          answerKey: formData.expectedAnswerType,
        },
        { withCredentials: true }
      )
      .then((res) => {
        const newQuestion = res.data.data;
        setQuestions((prev) => [...prev, newQuestion]);
        resetForm();
        setIsDialogOpen(false);
      });
  };
  const startEdit = (question) => {
    setIsEditMode(true);
    setEditingQuestion(question);
    setFormData({
      text: question.questionText,
      category: question.domain,
      difficulty: question.difficulty,
      expectedAnswerType: question.answerKey || "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${URL}/questions/edit-question/${editingQuestion._id}`,
        {
          questionText: formData.text,
          answerKey: formData.expectedAnswerType,
        },
        { withCredentials: true }
      );

      toast({
        title: "Question updated",
        description: "Changes saved successfully",
      });
      setQuestions((prev) =>
        prev.map((q) =>
          q._id === editingQuestion._id
            ? {
                ...q,
                questionText: formData.text,
                answerKey: formData.expectedAnswerType,
              }
            : q
        )
      );
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    await axios
      .delete(`${URL}/questions/delete-question/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setQuestions((prev) => prev.filter((q) => q._id !== id));
        toast({
          title: "Question deleted",
          description: "The question has been removed from your bank.",
        });
      });
  };

  const filteredQuestions = Questions.filter((q) => {
    const matchesSearch = q.questionText
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || q.domain === filterCategory;
    const matchesDifficulty =
      filterDifficulty === "all" || q.difficulty === filterDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Question Bank
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your custom interview questions
            </p>
          </div>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Edit Question" : "Add New Question"}
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={isEditMode ? handleEdit : handleSubmit}
                className="space-y-4 mt-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="question">Question *</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter your interview question..."
                    value={formData.text}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, text: e.target.value }))
                    }
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={formData.category}
                      disabled={isEditMode}
                      onValueChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          category: value,
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty *</Label>
                    <Select
                      value={formData.difficulty}
                      disabled={isEditMode}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          difficulty: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="answerType">Expected Answer Type</Label>
                  <Input
                    id="answerType"
                    placeholder="e.g., STAR Method, Technical Explanation..."
                    value={formData.expectedAnswerType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        expectedAnswerType: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {isEditMode ? "Update Question" : "Add Question"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-slide-up">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    <span className="flex items-center gap-2">
                      <span>
                        <SafeIcon
                          icon={cat?.icon}
                          iconClassName="h-4 w-4 text-primary"
                        />
                      </span>
                      {cat.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterDifficulty}
              onValueChange={setFilterDifficulty}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <Card className="animate-fade-in">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {Questions.length === 0
                  ? "No custom questions yet"
                  : "No matching questions"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {Questions.length === 0
                  ? "Start building your personal question bank by adding your first question."
                  : "Try adjusting your search or filters."}
              </p>
              {Questions.length === 0 && (
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Question
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredQuestions?.map((question, index) => (
              <Card
                key={question.id}
                className="animate-fade-in hover:shadow-md transition-shadow"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-medium mb-3">
                        {question.questionText}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {question.domain}
                        </Badge>
                        <Badge
                          className={cn(
                            "text-xs border",
                            difficultyColors[question.difficulty]
                          )}
                        >
                          {question.difficulty}
                        </Badge>
                        {question.answerKey && (
                          <span className="text-xs text-muted-foreground">
                            • {question.answerKey}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(question)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(question._id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {Questions.length > 0 && (
          <div className="mt-8 p-4 rounded-lg bg-muted/50 animate-fade-in">
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Total Questions:</span>
                <span className="ml-2 font-semibold text-foreground">
                  {Questions.length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Easy:</span>
                <span className="ml-2 font-semibold text-success">
                  {Questions.filter((q) => q.difficulty === "Easy").length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Medium:</span>
                <span className="ml-2 font-semibold text-warning">
                  {Questions.filter((q) => q.difficulty === "Medium").length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Hard:</span>
                <span className="ml-2 font-semibold text-destructive">
                  {Questions.filter((q) => q.difficulty === "Hard").length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
