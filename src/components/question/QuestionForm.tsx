
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FormFields } from "./FormFields";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface QuestionFormProps {
  initialData?: {
    id: string;
    content: {
      text: string;
      type: string;
      formula?: string;
    };
    marks: number;
    k_level: string;
    part: string;
    co_level: string;
    has_formula?: boolean;
    subject_code?: string;
    subject_name?: string;
    or_content?: {
      text: string;
      type: string;
      formula?: string;
    };
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export const QuestionForm = ({ initialData, onSuccess, onCancel }: QuestionFormProps) => {
  const [content, setContent] = useState(initialData?.content?.text || "");
  const [contentType, setContentType] = useState(initialData?.content?.type || "text");
  const [mark, setMark] = useState(initialData?.marks.toString() || "");
  const [kLevel, setKLevel] = useState(initialData?.k_level || "");
  const [part, setPart] = useState(initialData?.part || "");
  const [coLevel, setCoLevel] = useState(initialData?.co_level || "CO1");
  const [hasFormula, setHasFormula] = useState(initialData?.has_formula || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const [hasOr, setHasOr] = useState(!!initialData?.or_content);
  const [orContent, setOrContent] = useState(initialData?.or_content?.text || "");
  const [orContentType, setOrContentType] = useState(initialData?.or_content?.type || "text");
  const [orMark, setOrMark] = useState("");
  const [orKLevel, setOrKLevel] = useState("");
  const [orPart, setOrPart] = useState("");
  const [orCoLevel, setOrCoLevel] = useState("");
  const [orHasFormula, setOrHasFormula] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!content || !mark || !kLevel || !part || !coLevel || !contentType) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No authenticated user found");
      }

      const questionData = {
        content: {
          text: content,
          type: contentType,
          formula: contentType === 'math' ? content : null
        },
        marks: parseInt(mark),
        k_level: kLevel,
        part,
        co_level: coLevel,
        has_formula: hasFormula,
        subject_code: initialData?.subject_code,
        subject_name: initialData?.subject_name,
        has_or: hasOr,
        or_content: hasOr ? {
          text: orContent,
          type: orContentType,
          formula: orContentType === 'math' ? orContent : null
        } : null,
        user_id: user.id,
      };

      if (initialData?.id) {
        // Update existing question
        const { error } = await supabase
          .from('questions')
          .update(questionData)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success("Question updated successfully");
      } else {
        // Create new question
        const { error } = await supabase
          .from('questions')
          .insert(questionData);

        if (error) throw error;
        toast.success("Question added successfully");
      }

      // Invalidate queries to refresh the data
      await queryClient.invalidateQueries({ queryKey: ['questions'] });
      if (initialData?.subject_code) {
        await queryClient.invalidateQueries({ 
          queryKey: ['questions', initialData.subject_code] 
        });
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error saving question:', error);
      toast.error(error.message || "Failed to save question");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormFields
        content={content}
        setContent={setContent}
        contentType={contentType}
        setContentType={setContentType}
        mark={mark}
        setMark={setMark}
        kLevel={kLevel}
        setKLevel={setKLevel}
        part={part}
        setPart={setPart}
        coLevel={coLevel}
        setCoLevel={setCoLevel}
        hasFormula={hasFormula}
        setHasFormula={setHasFormula}
        hasOr={hasOr}
        setHasOr={setHasOr}
        orContent={orContent}
        setOrContent={setOrContent}
        orContentType={orContentType}
        setOrContentType={setOrContentType}
        orMark={orMark}
        setOrMark={setOrMark}
        orKLevel={orKLevel}
        setOrKLevel={setOrKLevel}
        orPart={orPart}
        setOrPart={setOrPart}
        orCoLevel={orCoLevel}
        setOrCoLevel={setOrCoLevel}
        orHasFormula={orHasFormula}
        setOrHasFormula={setOrHasFormula}
      />

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData?.id ? "Update" : "Add"} Question
        </Button>
      </div>
    </form>
  );
};
