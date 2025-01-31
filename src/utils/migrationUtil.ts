import { supabase } from '@/integrations/supabase/client';
import { insertQuestions } from '@/integrations/mongodb/client';

export const migrateDataToMongoDB = async () => {
  try {
    // Fetch all questions from Supabase
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*');

    if (error) throw error;

    if (!questions || questions.length === 0) {
      return { count: 0 };
    }

    // Transform the data if needed
    const transformedQuestions = questions.map(question => ({
      ...question,
      _id: question.id, // Map Supabase ID to MongoDB _id
      has_or: question.has_or || false,
      or_content: question.or_content || '',
      or_marks: question.or_marks || 0,
      or_k_level: question.or_k_level || '',
      or_part: question.or_part || '',
      or_co_level: question.or_co_level || '',
    }));

    // Insert into MongoDB
    const result = await insertQuestions(transformedQuestions);
    return { count: result.insertedCount };
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
};