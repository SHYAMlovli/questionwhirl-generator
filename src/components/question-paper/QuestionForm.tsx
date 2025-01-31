import { Button } from "@/components/ui/button";
import { FormFields } from "@/components/question/FormFields";
import { CheckedState } from "@radix-ui/react-checkbox";
import { TopicQuestion } from "@/types/question";

interface QuestionFormProps {
  question: TopicQuestion;
  updateQuestion: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
  questionNumber: number;
}

export const QuestionForm = ({
  question,
  updateQuestion,
  onDelete,
  questionNumber,
}: QuestionFormProps) => {
  const handleOrChange = (checked: CheckedState) => {
    updateQuestion(question.id, "hasOr", checked ? "true" : "false");
    if (!checked) {
      // Clear OR fields when disabled
      updateQuestion(question.id, "orMarks", "");
      updateQuestion(question.id, "orKLevel", "");
      updateQuestion(question.id, "orPart", "");
      updateQuestion(question.id, "orCoLevel", "");
    }
  };

  console.log("Question hasOr:", question.hasOr); // Add logging

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Question {questionNumber}</h3>
        <Button variant="ghost" onClick={() => onDelete(question.id)}>
          Remove
        </Button>
      </div>

      <div className="space-y-6">
        <FormFields
          mark={question.marks || ""}
          setMark={(value) => updateQuestion(question.id, "marks", value)}
          kLevel={question.kLevel || ""}
          setKLevel={(value) => updateQuestion(question.id, "kLevel", value)}
          part={question.part || ""}
          setPart={(value) => updateQuestion(question.id, "part", value)}
          coLevel={question.coLevel || ""}
          setCoLevel={(value) => updateQuestion(question.id, "coLevel", value)}
          hasOr={question.hasOr === "true"}
          setHasOr={handleOrChange}
          orMark={question.orMarks || ""}
          setOrMark={(value) => updateQuestion(question.id, "orMarks", value)}
          orKLevel={question.orKLevel || ""}
          setOrKLevel={(value) => updateQuestion(question.id, "orKLevel", value)}
          orPart={question.orPart || ""}
          setOrPart={(value) => updateQuestion(question.id, "orPart", value)}
          orCoLevel={question.orCoLevel || ""}
          setOrCoLevel={(value) => updateQuestion(question.id, "orCoLevel", value)}
        />
      </div>
    </div>
  );
};