import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Question, QuestionType, Option } from "@/types/question";
import { useToast } from "@/components/ui/use-toast";

interface QuestionFormProps {
  onSubmit: (question: Question) => void;
}

export const QuestionForm = ({ onSubmit }: QuestionFormProps) => {
  const { toast } = useToast();
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("MCQ");
  const [marks, setMarks] = useState(1);
  const [options, setOptions] = useState<Option[]>([
    { id: "1", text: "" },
    { id: "2", text: "" },
  ]);
  const [correctOption, setCorrectOption] = useState("");

  const handleAddOption = () => {
    setOptions([...options, { id: String(options.length + 1), text: "" }]);
  };

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter((option) => option.id !== id));
  };

  const handleOptionChange = (id: string, text: string) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, text } : option
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionText.trim()) {
      toast({
        title: "Error",
        description: "Question text is required",
        variant: "destructive",
      });
      return;
    }

    if (questionType === "MCQ" && !correctOption) {
      toast({
        title: "Error",
        description: "Please select a correct option",
        variant: "destructive",
      });
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      text: questionText,
      type: questionType,
      marks,
      options: questionType === "MCQ" ? options : undefined,
      correctOption: questionType === "MCQ" ? correctOption : undefined,
    };

    onSubmit(question);
    
    // Reset form
    setQuestionText("");
    setQuestionType("MCQ");
    setMarks(1);
    setOptions([
      { id: "1", text: "" },
      { id: "2", text: "" },
    ]);
    setCorrectOption("");

    toast({
      title: "Success",
      description: "Question added successfully",
    });
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="questionText">Question Text</Label>
          <Textarea
            id="questionText"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your question here..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Question Type</Label>
          <RadioGroup
            value={questionType}
            onValueChange={(value) => setQuestionType(value as QuestionType)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="MCQ" id="mcq" />
              <Label htmlFor="mcq">Multiple Choice</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SHORT_ANSWER" id="short" />
              <Label htmlFor="short">Short Answer</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="marks">Marks</Label>
          <Input
            id="marks"
            type="number"
            min="1"
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
            className="w-24"
          />
        </div>

        {questionType === "MCQ" && (
          <div className="space-y-4">
            <Label>Options</Label>
            {options.map((option) => (
              <div key={option.id} className="flex space-x-2">
                <Input
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  placeholder={`Option ${option.id}`}
                />
                <RadioGroup
                  value={correctOption}
                  onValueChange={setCorrectOption}
                >
                  <RadioGroupItem value={option.id} />
                </RadioGroup>
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveOption(option.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddOption}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        )}

        <Button type="submit" className="w-full">
          Add Question
        </Button>
      </form>
    </Card>
  );
};