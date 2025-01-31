export interface TopicQuestion {
  id: string;
  content?: string;
  marks?: string;
  kLevel?: string;
  part?: string;
  coLevel?: string;
  hasOr: string;
  orContent?: string;
  orMarks?: string;
  orKLevel?: string;
  orPart?: string;
  orCoLevel?: string;
}

export interface QuestionFromDB {
  id: string;
  user_id: string;
  content: string;
  marks: number;
  k_level: string;
  part: string;
  co_level: string;
  created_at: string;
  subject_code: string;
  subject_name: string;
  has_or?: boolean;
  or_content?: string;
  or_marks?: number;
  or_k_level?: string;
  or_part?: string;
  or_co_level?: string;
}

export interface FormData {
  unitNumber: string;
  subjectCode: string;
}

export interface MappedQuestion {
  id: string;
  content: string;
  marks: string;
  kLevel: string;
  part: string;
  coLevel: string;
  hasOr: string;
  orContent?: string;
  orMarks?: string;
  orKLevel?: string;
  orPart?: string;
  orCoLevel?: string;
}

export const mapDBQuestionToTopicQuestion = (question: QuestionFromDB): MappedQuestion => {
  const hasOr = question.has_or === true && question.or_content;
  
  return {
    id: question.id,
    content: question.content,
    marks: question.marks.toString(),
    kLevel: question.k_level,
    part: question.part,
    coLevel: question.co_level,
    hasOr: hasOr ? "true" : "false",
    orContent: hasOr ? question.or_content : undefined,
    orMarks: hasOr ? question.or_marks?.toString() : undefined,
    orKLevel: hasOr ? question.or_k_level : undefined,
    orPart: hasOr ? question.or_part : undefined,
    orCoLevel: hasOr ? question.or_co_level : undefined,
  };
};