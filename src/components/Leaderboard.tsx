'use client';

import type { UserRanking } from '@/lib/types';
import styles from './Leaderboard.module.css';

interface LeaderboardProps {
  rankings: UserRanking[];
}

const AVATAR_COLORS = [
  'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  'linear-gradient(135deg, #06b6d4, #0891b2)',
  'linear-gradient(135deg, #ec4899, #db2777)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ef4444, #dc2626)',
];

export default function Leaderboard({ rankings }: LeaderboardProps) {
  const getRankClass = (rank: number) => {
    if (rank === 0) return styles.gold;
    if (rank === 1) return styles.silver;
    if (rank === 2) return styles.bronze;
    return styles.regular;
  };

  const getMedal = (rank: number) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return `${rank + 1}`;
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <section className="section">
      <div className="section-header">
        <span className="section-icon">🏆</span>
        <h2 className="section-title">Leaderboard</h2>
      </div>

      <div className={`glass-card ${styles.leaderboardCard}`}>
        {rankings.length === 0 || rankings.every((r) => r.totalSessions === 0) ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏅</div>
            <div>Add practice sessions to see rankings!</div>
          </div>
        ) : (
          <div className={styles.list}>
            {rankings
              .filter((r) => r.totalSessions > 0)
              .map((r, idx) => (
                <div key={r.user.id} className={`${styles.row} animate-fade-in`}>
                  <div className={`${styles.rankBadge} ${getRankClass(idx)}`}>
                    {getMedal(idx)}
                  </div>
                  <div
                    className="avatar"
                    style={{
                      background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                    }}
                  >
                    {getInitials(r.user.name)}
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.leaderName}>{r.user.name}</div>
                    <div className={styles.sessionCount}>
                      {r.totalSessions} session{r.totalSessions !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className={styles.skillScores}>
                    <div className={styles.skillScore}>
                      <span className={styles.skillLabel}>L</span>
                      <span className={styles.skillValue}>
                        {r.avgListening > 0 ? r.avgListening.toFixed(1) : '—'}
                      </span>
                    </div>
                    <div className={styles.skillScore}>
                      <span className={styles.skillLabel}>R</span>
                      <span className={styles.skillValue}>
                        {r.avgReading > 0 ? r.avgReading.toFixed(1) : '—'}
                      </span>
                    </div>
                    <div className={styles.skillScore}>
                      <span className={styles.skillLabel}>W</span>
                      <span className={styles.skillValue}>
                        {r.avgWriting > 0 ? r.avgWriting.toFixed(1) : '—'}
                      </span>
                    </div>
                    <div className={styles.skillScore}>
                      <span className={styles.skillLabel}>S</span>
                      <span className={styles.skillValue}>
                        {r.avgSpeaking > 0 ? r.avgSpeaking.toFixed(1) : '—'}
                      </span>
                    </div>
                  </div>
                  <div className={styles.overallScore}>
                    <span className={styles.overallLabel}>Overall</span>
                    <span className={styles.overallValue}>
                      {r.avgOverall > 0 ? r.avgOverall.toFixed(1) : '—'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
