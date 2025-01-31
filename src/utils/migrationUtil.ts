import { supabase } from "@/integrations/supabase/client";
import { insertQuestion } from "@/integrations/mongodb/client";

export const migrateDataToMongoDB = async () => {
  try {
    // Fetch all questions from Supabase
    const { data: supabaseQuestions, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Insert each question into MongoDB
    for (const question of supabaseQuestions || []) {
      const questionData = {
        content: question.content,
        marks: question.marks,
        k_level: question.k_level,
        part: question.part,
        co_level: question.co_level,
        subject_code: question.subject_code,
        subject_name: question.subject_name,
        has_or: question.has_or,
        or_content: question.or_content,
        or_marks: question.or_marks,
        or_k_level: question.or_k_level,
        or_part: question.or_part,
        or_co_level: question.or_co_level
      };

      await insertQuestion(questionData);
    }

    return { success: true, count: supabaseQuestions?.length || 0 };
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
};