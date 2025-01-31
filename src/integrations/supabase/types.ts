export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      questions: {
        Row: {
          id: string
          user_id: string
          content: string
          marks: number
          k_level: string
          part: string
          co_level: string
          created_at: string
          subject_code: string
          subject_name: string
          has_or?: boolean
          or_content?: string
          or_marks?: number
          or_k_level?: string
          or_part?: string
          or_co_level?: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          marks: number
          k_level: string
          part: string
          co_level: string
          created_at?: string
          subject_code: string
          subject_name: string
          has_or?: boolean
          or_content?: string
          or_marks?: number
          or_k_level?: string
          or_part?: string
          or_co_level?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          marks?: number
          k_level?: string
          part?: string
          co_level?: string
          created_at?: string
          subject_code?: string
          subject_name?: string
          has_or?: boolean
          or_content?: string
          or_marks?: number
          or_k_level?: string
          or_part?: string
          or_co_level?: string
        }
      }
    }
  }
}