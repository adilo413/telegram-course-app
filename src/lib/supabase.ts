import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  content: string;
  subject: 'English' | 'Amharic' | 'Civic' | 'Math' | 'Science';
  status: 'active' | 'inactive';
  token: string;
  author_id: string;
  author_name: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface ChannelMember {
  id: string;
  user_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  joined_at: string;
}

export interface CourseAccessLog {
  id: string;
  course_id: string;
  user_id: string;
  accessed_at: string;
  ip_address?: string;
  user_agent?: string;
}

// Course subjects
export const COURSE_SUBJECTS = [
  'English',
  'Amharic', 
  'Civic',
  'Math',
  'Science'
] as const;

export type CourseSubject = typeof COURSE_SUBJECTS[number];
