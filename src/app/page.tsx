'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User, PracticeSession, PracticeImage, UserRanking, Skill } from '@/lib/types';
import { getUsers, getSessions, getImages, getRankings } from '@/lib/store';
import Hero from '@/components/Hero';
import GoalCards from '@/components/GoalCards';
import PracticeTable from '@/components/PracticeTable';
import Leaderboard from '@/components/Leaderboard';
import PracticeGallery from '@/components/PracticeGallery';
import ScoreTable from '@/components/ScoreTable';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [images, setImages] = useState<PracticeImage[]>([]);
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [activeSkill, setActiveSkill] = useState<Skill>('listening');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [u, s, img, r] = await Promise.all([
        getUsers(),
        getSessions(activeSkill),
        getImages(),
        getRankings(),
      ]);
      setUsers(u);
      setSessions(s);
      setImages(img);
      setRankings(r);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeSkill]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    loadData();
  };

  const handleSkillChange = (skill: Skill) => {
    setActiveSkill(skill);
  };

  return (
    <main className="container">
      <Hero users={users} />
      <GoalCards users={users} onRefresh={handleRefresh} />
      <ScoreTable />
      <PracticeTable
        sessions={sessions}
        users={users}
        activeSkill={activeSkill}
        onSkillChange={handleSkillChange}
        onRefresh={handleRefresh}
      />
      <Leaderboard rankings={rankings} />
      <PracticeGallery images={images} users={users} onRefresh={handleRefresh} />
    </main>
  );
}
