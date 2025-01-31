export interface Question {
  id: string;
  content: string;
  marks: number;
  k_level: string;
  part: string;
  co_level: string;
  subject_code: string;
  subject_name: string;
  user_id: string;
  created_at: string;
  has_or?: boolean;
  or_content?: string;
  or_marks?: number;
  or_k_level?: string;
  or_part?: string;
  or_co_level?: string;
}