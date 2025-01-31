export type QuestionType = "MCQ" | "SHORT_ANSWER";

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  marks: number;
  options?: Option[];
  correctOption?: string;
}

export interface QuestionPaper {
  title: string;
  totalMarks: number;
  duration: number;
  questions: Question[];
}