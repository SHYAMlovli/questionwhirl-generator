
export interface TopicQuestion {
  id: string;
  content?: string;
  contentType?: string;
  marks?: string;
  kLevel?: string;
  part?: string;
  coLevel?: string;
  hasOr: string;
  hasFormula?: boolean;
  orContent?: string;
  orContentType?: string;
  orMarks?: string;
  orKLevel?: string;
  orPart?: string;
  orCoLevel?: string;
  orHasFormula?: boolean;
}

export interface QuestionFromDB {
  id: string;
  user_id: string;
  content: {
    text: string;
    type: string;
    formula?: string;
  };
  marks: number;
  k_level: string;
  part: string;
  co_level: string;
  created_at: string;
  subject_code: string | null;
  subject_name: string | null;
  has_or?: boolean;
  has_formula?: boolean;
  or_content?: {
    text: string;
    type: string;
    formula?: string;
  };
  or_marks?: number;
  or_k_level?: string;
  or_part?: string;
  or_co_level?: string;
  or_has_formula?: boolean;
}

export interface FormData {
  unitNumber: string;
  subjectCode: string;
}

export interface MappedQuestion {
  id: string;
  content: string;
  contentType: string;
  marks: number;
  kLevel: string;
  part: string;
  coLevel: string;
  hasOr: string;
  hasFormula?: boolean;
  orContent?: string;
  orContentType?: string;
  orMarks?: number;
  orKLevel?: string;
  orPart?: string;
  orCoLevel?: string;
  orHasFormula?: boolean;
}

export const mapDBQuestionToTopicQuestion = (question: QuestionFromDB): MappedQuestion => {
  const hasOr = question.has_or === true && question.or_content;
  
  return {
    id: question.id,
    content: question.content.text,
    contentType: question.content.type || 'text',
    marks: question.marks,
    kLevel: question.k_level,
    part: question.part,
    coLevel: question.co_level,
    hasOr: hasOr ? "true" : "false",
    hasFormula: question.has_formula,
    orContent: hasOr ? question.or_content?.text : undefined,
    orContentType: hasOr ? question.or_content?.type : undefined,
    orMarks: hasOr ? question.or_marks : undefined,
    orKLevel: hasOr ? question.or_k_level : undefined,
    orPart: hasOr ? question.or_part : undefined,
    orCoLevel: hasOr ? question.or_co_level : undefined,
    orHasFormula: hasOr ? question.or_has_formula : undefined,
  };
};
