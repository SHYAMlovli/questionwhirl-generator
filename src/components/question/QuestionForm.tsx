
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FormFields } from "./FormFields";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface QuestionFormProps {
  initialData?: {
    id: string;
    content: string;
    content_type: string;
    marks: number;
    k_level: string;
    part: string;
    co_level: string;
    has_formula?: boolean;
    subject_code?: string;
    subject_name?: string;
    or_content_type?: string;
    or_has_formula?: boolean;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export const QuestionForm = ({ initialData, onSuccess, onCancel }: QuestionFormProps) => {
  const [content, setContent] = useState(initialData?.content || "");
  const [contentType, setContentType] = useState(initialData?.content_type || "text");
  const [mark, setMark] = useState(initialData?.marks.toString() || "");
  const [kLevel, setKLevel] = useState(initialData?.k_level || "");
  const [part, setPart] = useState(initialData?.part || "");
  const [coLevel, setCoLevel] = useState(initialData?.co_level || "CO1");
  const [hasFormula, setHasFormula] = useState(initialData?.has_formula || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const [hasOr, setHasOr] = useState(false);
  const [orContent, setOrContent] = useState("");
  const [orContentType, setOrContentType] = useState("text");
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
        content,
        content_type: contentType,
        marks: parseInt(mark),
        k_level: kLevel,
        part,
        co_level: coLevel,
        has_formula: hasFormula,
        subject_code: initialData?.subject_code,
        subject_name: initialData?.subject_name,
        has_or: hasOr,
        or_content: hasOr ? orContent : null,
        or_content_type: hasOr ? orContentType : null,
        or_marks: hasOr && orMark ? parseInt(orMark) : null,
        or_k_level: hasOr ? orKLevel : null,
        or_part: hasOr ? orPart : null,
        or_co_level: hasOr ? orCoLevel : null,
        or_has_formula: hasOr ? orHasFormula : null,
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

