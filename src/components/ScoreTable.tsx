'use client';

import { useState } from 'react';
import { listeningScoreTable, readingScoreTable } from '@/lib/scoring';

const styles = {
  wrapper: {
    marginBottom: '48px',
  } as React.CSSProperties,
  toggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.9rem',
    padding: '8px 0',
  } as React.CSSProperties,
  arrow: {
    transition: 'transform 0.2s ease',
    display: 'inline-block',
  } as React.CSSProperties,
  content: {
    marginTop: '16px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  } as React.CSSProperties,
  tableWrapper: {
    background: 'var(--bg-card)',
    borderRadius: '12px',
    border: '1px solid var(--border-glass)',
    overflow: 'hidden',
  } as React.CSSProperties,
  tableTitle: {
    padding: '12px 16px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-glass)',
  } as React.CSSProperties,
};

export default function ScoreTable() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section style={styles.wrapper}>
      <button style={styles.toggle} onClick={() => setIsOpen(!isOpen)}>
        <span
          style={{
            ...styles.arrow,
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        >
          ▶
        </span>
        📋 Score Conversion Table
      </button>

      {isOpen && (
        <div style={styles.content}>
          <div style={styles.tableWrapper}>
            <div style={styles.tableTitle}>🎧 Listening</div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Band Score</th>
                    <th>Correct Answers</th>
                  </tr>
                </thead>
                <tbody>
                  {listeningScoreTable.map((row) => (
                    <tr key={row.band}>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {row.band}
                      </td>
                      <td>
                        {row.min === row.max
                          ? row.min
                          : `${row.min}–${row.max}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={styles.tableWrapper}>
            <div style={styles.tableTitle}>📖 Reading (Academic)</div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Band Score</th>
                    <th>Correct Answers</th>
                  </tr>
                </thead>
                <tbody>
                  {readingScoreTable.map((row) => (
                    <tr key={row.band}>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {row.band}
                      </td>
                      <td>
                        {row.min === row.max
                          ? row.min
                          : `${row.min}–${row.max}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
