'use client';

import { useState } from 'react';
import type { User } from '@/lib/types';
import { addUser, updateUser, deleteUser } from '@/lib/store';
import Modal from './Modal';
import styles from './GoalCards.module.css';

const AVATAR_COLORS = [
  'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  'linear-gradient(135deg, #06b6d4, #0891b2)',
  'linear-gradient(135deg, #ec4899, #db2777)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ef4444, #dc2626)',
];

const DEFAULT_FORM = {
  name: '',
  target_overall: '7.0',
  target_listening: '7.0',
  target_reading: '7.0',
  target_writing: '7.0',
  target_speaking: '7.0',
  exam_date: '',
};

interface GoalCardsProps {
  users: User[];
  onRefresh: () => void;
}

export default function GoalCards({ users, onRefresh }: GoalCardsProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ ...DEFAULT_FORM });

  const openAddModal = () => {
    setEditingUser(null);
    setForm({ ...DEFAULT_FORM });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      target_overall: String(user.target_overall),
      target_listening: String(user.target_listening),
      target_reading: String(user.target_reading),
      target_writing: String(user.target_writing),
      target_speaking: String(user.target_speaking),
      exam_date: user.exam_date || '',
    });
    setError('');
    setShowModal(true);
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return 'Name is required.';
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters.';
    if (!form.exam_date) return 'Exam date is required.';
    const examDateObj = new Date(form.exam_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (examDateObj < today) return 'Exam date must be in the future.';
    // Check duplicate name (only for new users, or if name changed during edit)
    const isDuplicate = users.some(
      (u) =>
        u.name.toLowerCase() === form.name.trim().toLowerCase() &&
        u.id !== editingUser?.id
    );
    if (isDuplicate) return `A member named "${form.name.trim()}" already exists.`;
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        target_overall: parseFloat(form.target_overall),
        target_listening: parseFloat(form.target_listening),
        target_reading: parseFloat(form.target_reading),
        target_writing: parseFloat(form.target_writing),
        target_speaking: parseFloat(form.target_speaking),
        exam_date: form.exam_date || undefined,
      };

      if (editingUser) {
        await updateUser(editingUser.id, payload);
      } else {
        await addUser(payload);
      }
      setForm({ ...DEFAULT_FORM });
      setShowModal(false);
      onRefresh();
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user and all their data?')) return;
    try {
      await deleteUser(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const bandOptions = [];
  for (let i = 4.0; i <= 9.0; i += 0.5) {
    bandOptions.push(i.toFixed(1));
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const skills = [
    { key: 'target_listening', label: 'Listening', color: '#8b5cf6' },
    { key: 'target_reading', label: 'Reading', color: '#06b6d4' },
    { key: 'target_writing', label: 'Writing', color: '#ec4899' },
    { key: 'target_speaking', label: 'Speaking', color: '#10b981' },
  ] as const;

  // Get today's date as YYYY-MM-DD for min attribute
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <section className="section">
      <div className="section-header">
        <span className="section-icon">🎯</span>
        <h2 className="section-title">Goals</h2>
      </div>

      <div className={styles.grid}>
        {users.map((user, idx) => (
          <div key={user.id} className={`glass-card ${styles.card} animate-fade-in`}>
            <div className={styles.cardActions}>
              <button
                className={styles.editBtn}
                onClick={() => openEditModal(user)}
                title="Edit user"
              >
                ✏️
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(user.id)}
                title="Delete user"
              >
                🗑
              </button>
            </div>
            <div className={styles.cardHeader}>
              <div
                className={styles.avatar}
                style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
              >
                {getInitials(user.name)}
              </div>
              <div>
                <div className={styles.userName}>{user.name}</div>
                {user.exam_date && (
                  <div className={styles.examInfo}>
                    📅 {new Date(user.exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.scores}>
              {skills.map(({ key, label, color }) => {
                const target = user[key] as number;
                const pct = (target / 9) * 100;
                return (
                  <div key={key} className={styles.scoreRow}>
                    <span className={styles.scoreLabel}>{label}</span>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                        }}
                      />
                    </div>
                    <span className={styles.scoreValue}>{target}</span>
                  </div>
                );
              })}
            </div>

            <div className={styles.overallBadge}>
              <div className={styles.overallLabel}>Target Overall</div>
              <div className={styles.overallValue}>{user.target_overall}</div>
            </div>
          </div>
        ))}

        <div
          className={`glass-card ${styles.addCard}`}
          onClick={openAddModal}
        >
          <div className={styles.addContent}>
            <div className={styles.addIcon}>+</div>
            <div className={styles.addText}>Add Member</div>
          </div>
        </div>
      </div>

      <Modal
        title={editingUser ? `Edit ${editingUser.name}` : 'Add New Member'}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading
                ? editingUser
                  ? 'Saving...'
                  : 'Adding...'
                : editingUser
                ? 'Save Changes'
                : 'Add Member'}
            </button>
          </>
        }
      >
        {error && (
          <div className={styles.errorMsg}>
            ⚠️ {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Name *</label>
          <input
            className="form-input"
            placeholder="Enter name"
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              setError('');
            }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Exam Date *</label>
          <input
            className="form-input"
            type="date"
            min={todayStr}
            value={form.exam_date}
            onChange={(e) => {
              setForm({ ...form, exam_date: e.target.value });
              setError('');
            }}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Overall</label>
            <select
              className="form-select"
              value={form.target_overall}
              onChange={(e) => setForm({ ...form, target_overall: e.target.value })}
            >
              {bandOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Listening</label>
            <select
              className="form-select"
              value={form.target_listening}
              onChange={(e) => setForm({ ...form, target_listening: e.target.value })}
            >
              {bandOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Reading</label>
            <select
              className="form-select"
              value={form.target_reading}
              onChange={(e) => setForm({ ...form, target_reading: e.target.value })}
            >
              {bandOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Writing</label>
            <select
              className="form-select"
              value={form.target_writing}
              onChange={(e) => setForm({ ...form, target_writing: e.target.value })}
            >
              {bandOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Speaking</label>
            <select
              className="form-select"
              value={form.target_speaking}
              onChange={(e) => setForm({ ...form, target_speaking: e.target.value })}
            >
              {bandOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </section>
  );
}
