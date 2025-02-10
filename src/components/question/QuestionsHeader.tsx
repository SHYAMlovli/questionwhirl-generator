
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SubjectCard } from "./SubjectCard";
import { toast } from "sonner";
import { QuestionFromDB } from "@/types/question";

interface QuestionsHeaderProps {
  onAddSubject: () => void;
  onSelectSubject: (subject: { code: string; name: string }) => void;
}

interface Subject {
  code: string;
  name: string;
  count: number;
}

export const QuestionsHeader = ({ onAddSubject, onSelectSubject }: QuestionsHeaderProps) => {
  const { data: questions } = useQuery<QuestionFromDB[]>({
    queryKey: ['questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Group questions by subject with proper typing
  const subjects = questions?.reduce<Record<string, Subject>>((acc, question) => {
    if (question.subject_code && question.subject_name) {
      const key = `${question.subject_code}-${question.subject_name}`;
      if (!acc[key]) {
        acc[key] = {
          code: question.subject_code,
          name: question.subject_name,
          count: 0,
        };
      }
      acc[key].count++;
    }
    return acc;
  }, {});

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Question Banks</h1>
        <div className="flex gap-4">
          <Button onClick={onAddSubject}>
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects && Object.values(subjects).map((subject) => (
          <SubjectCard
            key={subject.code}
            subjectCode={subject.code}
            subjectName={subject.name}
            questionCount={subject.count}
            onClick={() => onSelectSubject({ code: subject.code, name: subject.name })}
          />
        ))}
      </div>
    </>
  );
};
