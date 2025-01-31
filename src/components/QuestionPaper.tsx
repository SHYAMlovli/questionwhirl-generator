import { useState } from "react";
import { QuestionForm } from "./QuestionForm";
import { QuestionList } from "./QuestionList";
import { Question } from "@/types/question";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const QuestionPaper = () => {
  const [title, setTitle] = useState("Question Paper");
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const { toast } = useToast();

  const handleAddQuestion = (question: Question) => {
    setQuestions([...questions, question]);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    toast({
      title: "Question deleted",
      description: "The question has been removed from the paper",
    });
  };

  const getTotalMarks = () => {
    return questions.reduce((total, q) => total + q.marks, 0);
  };

  const handleExport = () => {
    const paper = {
      title,
      duration,
      totalMarks: getTotalMarks(),
      questions,
    };

    const blob = new Blob([JSON.stringify(paper, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Question paper exported successfully",
    });
  };

  return (
    <div className="container py-8">
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="title">Paper Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4"
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="1"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add New Question</h2>
          <QuestionForm onSubmit={handleAddQuestion} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              Questions ({questions.length})
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-paper-500">
                Total Marks: {getTotalMarks()}
              </span>
              <Button onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <QuestionList questions={questions} onDelete={handleDeleteQuestion} />
        </div>
      </div>
    </div>
  );
};