'use client';

import { useState, useRef } from 'react';
import type { User, PracticeImage } from '@/lib/types';
import { uploadImage, deleteImage } from '@/lib/store';
import Modal from './Modal';
import styles from './PracticeGallery.module.css';

interface PracticeGalleryProps {
  images: PracticeImage[];
  users: User[];
  onRefresh: () => void;
}

export default function PracticeGallery({ images, users, onRefresh }: PracticeGalleryProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [userId, setUserId] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !userId) return;
    setLoading(true);
    try {
      await uploadImage(userId, selectedFile, caption || undefined);
      setSelectedFile(null);
      setPreview(null);
      setCaption('');
      setShowModal(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteImage(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="section">
      <div className="section-header">
        <span className="section-icon">📸</span>
        <h2 className="section-title">Practice Gallery</h2>
      </div>

      <div className={`glass-card ${styles.galleryCard}`}>
        <div className={styles.header}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {images.length} photo{images.length !== 1 ? 's' : ''}
          </span>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Upload Photo
          </button>
        </div>

        {images.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📷</div>
            <div>No photos yet. Upload your practice moments!</div>
          </div>
        ) : (
          <div className={styles.grid}>
            {images.map((img) => (
              <div key={img.id} className={styles.imageCard}>
                <div className={styles.imageWrapper}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.image_url} alt={img.caption || 'Practice photo'} />
                  <button
                    className={styles.deleteImgBtn}
                    onClick={() => handleDelete(img.id)}
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
                <div className={styles.imageInfo}>
                  {img.caption && (
                    <div className={styles.imageCaption}>{img.caption}</div>
                  )}
                  <div className={styles.imageMeta}>
                    <span className={styles.imageUser}>
                      {img.users?.name || 'Unknown'}
                    </span>
                    <span className={styles.imageDate}>
                      {new Date(img.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        title="Upload Practice Photo"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedFile(null);
          setPreview(null);
        }}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading || !selectedFile || !userId}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">User</label>
          <select
            className="form-select"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Select user...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.uploadArea}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <div
            className={styles.dropzone}
            onClick={() => fileRef.current?.click()}
          >
            <div className={styles.dropzoneIcon}>📁</div>
            <div className={styles.dropzoneText}>
              {selectedFile ? selectedFile.name : 'Click to select an image'}
            </div>
          </div>
          {preview && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={preview} alt="Preview" className={styles.preview} />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Caption (optional)</label>
          <input
            className="form-input"
            placeholder="What were you practicing?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
      </Modal>
    </section>
  );
}
