export type Skill = 'listening' | 'reading' | 'writing' | 'speaking';

export interface User {
  id: string;
  name: string;
  avatar_url?: string;
  target_overall: number;
  target_listening: number;
  target_reading: number;
  target_writing: number;
  target_speaking: number;
  exam_date?: string;
  created_at: string;
}

export interface PracticeSession {
  id: string;
  user_id: string;
  skill: Skill;
  date: string;
  task_name?: string;
  score?: number;
  correct_answers?: number;
  total_questions: number;
  part1?: number;
  part2?: number;
  part3?: number;
  part4?: number;
  notes?: string;
  created_at: string;
  // joined
  users?: { name: string; avatar_url?: string };
}

export interface PracticeImage {
  id: string;
  user_id: string;
  image_url: string;
  caption?: string;
  created_at: string;
  // joined
  users?: { name: string };
}

export interface UserRanking {
  user: User;
  avgListening: number;
  avgReading: number;
  avgWriting: number;
  avgSpeaking: number;
  avgOverall: number;
  totalSessions: number;
}
