'use client';

import { useState } from 'react';
import type { User, PracticeSession, Skill } from '@/lib/types';
import { addSession, deleteSession } from '@/lib/store';
import Modal from './Modal';
import styles from './PracticeTable.module.css';

interface PracticeTableProps {
  sessions: PracticeSession[];
  users: User[];
  activeSkill: Skill;
  onSkillChange: (skill: Skill) => void;
  onRefresh: () => void;
}

const SKILLS: { key: Skill; label: string; icon: string }[] = [
  { key: 'listening', label: 'Listening', icon: '🎧' },
  { key: 'reading', label: 'Reading', icon: '📖' },
  { key: 'writing', label: 'Writing', icon: '✍️' },
  { key: 'speaking', label: 'Speaking', icon: '🎤' },
];

export default function PracticeTable({
  sessions,
  users,
  activeSkill,
  onSkillChange,
  onRefresh,
}: PracticeTableProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    user_id: '',
    date: new Date().toISOString().split('T')[0],
    task_name: '',
    score: '',
    correct_answers: '',
    total_questions: '40',
    part1: '',
    part2: '',
    part3: '',
    part4: '',
    notes: '',
  });

  const handleSubmit = async () => {
    if (!form.user_id) return;
    setLoading(true);
    try {
      await addSession({
        user_id: form.user_id,
        skill: activeSkill,
        date: form.date,
        task_name: form.task_name || undefined,
        score: form.score ? parseFloat(form.score) : undefined,
        correct_answers: form.correct_answers
          ? parseInt(form.correct_answers)
          : undefined,
        total_questions: parseInt(form.total_questions) || 40,
        part1: form.part1 ? parseFloat(form.part1) : undefined,
        part2: form.part2 ? parseFloat(form.part2) : undefined,
        part3: form.part3 ? parseFloat(form.part3) : undefined,
        part4: form.part4 ? parseFloat(form.part4) : undefined,
        notes: form.notes || undefined,
      });
      setForm({
        user_id: form.user_id,
        date: new Date().toISOString().split('T')[0],
        task_name: '',
        score: '',
        correct_answers: '',
        total_questions: '40',
        part1: '',
        part2: '',
        part3: '',
        part4: '',
        notes: '',
      });
      setShowModal(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await deleteSession(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const getScoreClass = (score?: number) => {
    if (!score) return '';
    if (score >= 7) return styles.scoreHigh;
    if (score >= 5.5) return styles.scoreMid;
    return styles.scoreLow;
  };

  const showParts = activeSkill === 'listening' || activeSkill === 'reading';
  const showCorrect = activeSkill === 'listening' || activeSkill === 'reading';

  return (
    <section className="section">
      <div className="section-header">
        <span className="section-icon">📊</span>
        <h2 className="section-title">Practice Sessions</h2>
      </div>

      <div className={`glass-card ${styles.tableCard}`}>
        <div className={styles.controls}>
          <div className="tabs">
            {SKILLS.map(({ key, label, icon }) => (
              <button
                key={key}
                className={`tab ${activeSkill === key ? 'active' : ''}`}
                onClick={() => onSkillChange(key)}
              >
                {icon} {label}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Result
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <div className={styles.emptyText}>
              No {activeSkill} sessions yet. Add your first result!
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Task</th>
                  <th>Score</th>
                  {showCorrect && <th>Correct</th>}
                  {showParts && <th>Part 1</th>}
                  {showParts && <th>Part 2</th>}
                  {showParts && <th>Part 3</th>}
                  {activeSkill === 'listening' && <th>Part 4</th>}
                  <th>User</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id}>
                    <td>
                      {new Date(s.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td>{s.task_name || '—'}</td>
                    <td className={`${styles.scoreCell} ${getScoreClass(s.score)}`}>
                      {s.score ?? '—'}
                    </td>
                    {showCorrect && (
                      <td>
                        {s.correct_answers != null
                          ? `${s.correct_answers}/${s.total_questions}`
                          : '—'}
                      </td>
                    )}
                    {showParts && <td>{s.part1 ?? '—'}</td>}
                    {showParts && <td>{s.part2 ?? '—'}</td>}
                    {showParts && <td>{s.part3 ?? '—'}</td>}
                    {activeSkill === 'listening' && <td>{s.part4 ?? '—'}</td>}
                    <td>
                      <div className={styles.userCell}>
                        {s.users?.name || '—'}
                      </div>
                    </td>
                    <td>
                      <button
                        className={styles.deleteRowBtn}
                        onClick={() => handleDeleteSession(s.id)}
                        title="Delete"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        title={`Add ${activeSkill.charAt(0).toUpperCase() + activeSkill.slice(1)} Result`}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : 'Save Result'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">User</label>
          <select
            className="form-select"
            value={form.user_id}
            onChange={(e) => setForm({ ...form, user_id: e.target.value })}
          >
            <option value="">Select user...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Band Score</label>
            <input
              className="form-input"
              type="number"
              step="0.5"
              min="0"
              max="9"
              placeholder="e.g. 7.0"
              value={form.score}
              onChange={(e) => setForm({ ...form, score: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Task Name</label>
          <input
            className="form-input"
            placeholder="e.g. Cambridge 18 Test 1"
            value={form.task_name}
            onChange={(e) => setForm({ ...form, task_name: e.target.value })}
          />
        </div>

        {showCorrect && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Correct Answers</label>
              <input
                className="form-input"
                type="number"
                min="0"
                max="40"
                placeholder="e.g. 35"
                value={form.correct_answers}
                onChange={(e) =>
                  setForm({ ...form, correct_answers: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Questions</label>
              <input
                className="form-input"
                type="number"
                value={form.total_questions}
                onChange={(e) =>
                  setForm({ ...form, total_questions: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {showParts && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Part 1</label>
              <input
                className="form-input"
                type="number"
                placeholder="—"
                value={form.part1}
                onChange={(e) => setForm({ ...form, part1: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Part 2</label>
              <input
                className="form-input"
                type="number"
                placeholder="—"
                value={form.part2}
                onChange={(e) => setForm({ ...form, part2: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Part 3</label>
              <input
                className="form-input"
                type="number"
                placeholder="—"
                value={form.part3}
                onChange={(e) => setForm({ ...form, part3: e.target.value })}
              />
            </div>
            {activeSkill === 'listening' && (
              <div className="form-group">
                <label className="form-label">Part 4</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="—"
                  value={form.part4}
                  onChange={(e) => setForm({ ...form, part4: e.target.value })}
                />
              </div>
            )}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Notes</label>
          <input
            className="form-input"
            placeholder="Optional notes..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
      </Modal>
    </section>
  );
}
