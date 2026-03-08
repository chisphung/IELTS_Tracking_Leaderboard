'use client';

import { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import styles from './Hero.module.css';

interface HeroProps {
  users: User[];
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Hero({ users }: HeroProps) {
  const usersWithExam = users.filter((u) => u.exam_date);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  // Auto-select first user with an exam date
  useEffect(() => {
    if (!selectedUserId && usersWithExam.length > 0) {
      setSelectedUserId(usersWithExam[0].id);
    }
  }, [usersWithExam, selectedUserId]);

  const selectedUser = users.find((u) => u.id === selectedUserId);
  const examDate = selectedUser?.exam_date;

  useEffect(() => {
    if (!examDate) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const diff = new Date(examDate).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [examDate]);

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>IELTS Battle Arena</h1>
        <p className={styles.subtitle}>Track, Compete, Conquer 🏆</p>

        {usersWithExam.length > 0 ? (
          <>
            <div className={styles.userSelector}>
              {usersWithExam.map((u) => (
                <button
                  key={u.id}
                  className={`${styles.userChip} ${
                    selectedUserId === u.id ? styles.userChipActive : ''
                  }`}
                  onClick={() => setSelectedUserId(u.id)}
                >
                  {u.name}
                </button>
              ))}
            </div>

            {timeLeft && (
              <>
                <div className={styles.countdownWrapper}>
                  <div className={styles.countdownItem}>
                    <span className={styles.countdownValue}>
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className={styles.countdownLabel}>Days</span>
                  </div>
                  <span className={styles.countdownDivider}>:</span>
                  <div className={styles.countdownItem}>
                    <span className={styles.countdownValue}>
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className={styles.countdownLabel}>Hours</span>
                  </div>
                  <span className={styles.countdownDivider}>:</span>
                  <div className={styles.countdownItem}>
                    <span className={styles.countdownValue}>
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className={styles.countdownLabel}>Minutes</span>
                  </div>
                  <span className={styles.countdownDivider}>:</span>
                  <div className={styles.countdownItem}>
                    <span className={styles.countdownValue}>
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className={styles.countdownLabel}>Seconds</span>
                  </div>
                </div>
                <p className={styles.examDate}>
                  {selectedUser?.name}&apos;s Exam Day:{' '}
                  <span className={styles.examDateValue}>
                    {new Date(examDate!).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </p>
              </>
            )}
          </>
        ) : (
          <p className={styles.noExamDate}>
            Set your exam date in your goal card to see the countdown ⏳
          </p>
        )}
      </div>
    </section>
  );
}
