import { supabase } from './supabase';
import type { User, PracticeSession, PracticeImage, UserRanking, Skill } from './types';

// ===== USERS =====

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function addUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
}

// ===== PRACTICE SESSIONS =====

export async function getSessions(skill?: Skill): Promise<PracticeSession[]> {
  let query = supabase
    .from('practice_sessions')
    .select('*, users(name, avatar_url)')
    .order('date', { ascending: false });
  if (skill) {
    query = query.eq('skill', skill);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function addSession(
  session: Omit<PracticeSession, 'id' | 'created_at' | 'users'>
): Promise<PracticeSession> {
  const { data, error } = await supabase
    .from('practice_sessions')
    .insert(session)
    .select('*, users(name, avatar_url)')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSession(id: string): Promise<void> {
  const { error } = await supabase.from('practice_sessions').delete().eq('id', id);
  if (error) throw error;
}

// ===== PRACTICE IMAGES =====

export async function getImages(): Promise<PracticeImage[]> {
  const { data, error } = await supabase
    .from('practice_images')
    .select('*, users(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function uploadImage(
  userId: string,
  file: File,
  caption?: string
): Promise<PracticeImage> {
  const fileName = `${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('practice-images')
    .upload(fileName, file);
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('practice-images')
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('practice_images')
    .insert({
      user_id: userId,
      image_url: urlData.publicUrl,
      caption,
    })
    .select('*, users(name)')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteImage(id: string): Promise<void> {
  const { error } = await supabase.from('practice_images').delete().eq('id', id);
  if (error) throw error;
}

// ===== RANKINGS =====

export async function getRankings(): Promise<UserRanking[]> {
  const users = await getUsers();
  const { data: sessions, error } = await supabase
    .from('practice_sessions')
    .select('*');
  if (error) throw error;

  const rankings: UserRanking[] = users.map((user) => {
    const userSessions = (sessions || []).filter((s) => s.user_id === user.id);

    const avgBySkill = (skill: Skill) => {
      const skillSessions = userSessions.filter(
        (s) => s.skill === skill && s.score != null
      );
      if (skillSessions.length === 0) return 0;
      const sum = skillSessions.reduce((acc, s) => acc + (s.score || 0), 0);
      return Math.round((sum / skillSessions.length) * 10) / 10;
    };

    const avgL = avgBySkill('listening');
    const avgR = avgBySkill('reading');
    const avgW = avgBySkill('writing');
    const avgS = avgBySkill('speaking');
    const scores = [avgL, avgR, avgW, avgS].filter((s) => s > 0);
    const avgOverall =
      scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 2) / 2
        : 0;

    return {
      user,
      avgListening: avgL,
      avgReading: avgR,
      avgWriting: avgW,
      avgSpeaking: avgS,
      avgOverall,
      totalSessions: userSessions.length,
    };
  });

  return rankings.sort((a, b) => b.avgOverall - a.avgOverall);
}
