import { Card } from "@/components/ui/card";
import { Question } from "@/types/question";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionListProps {
  questions: Question[];
  onDelete: (id: string) => void;
}

export const QuestionList = ({ questions, onDelete }: QuestionListProps) => {
  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <Card key={question.id} className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-paper-500">
                  Question {index + 1}
                </span>
                <span className="text-sm text-paper-400">
                  ({question.marks} marks)
                </span>
              </div>
              <p className="text-lg mb-4">{question.text}</p>
              {question.type === "MCQ" && question.options && (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div
                      key={option.id}
                      className={`p-2 rounded ${
                        option.id === question.correctOption
                          ? "bg-green-100 border border-green-200"
                          : "bg-gray-50 border border-gray-100"
                      }`}
                    >
                      {option.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(question.id)}
              className="text-paper-400 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};