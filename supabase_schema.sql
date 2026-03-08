-- ============================================
-- IELTS Battle Arena - Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    name TEXT NOT NULL,
    avatar_url TEXT,
    target_overall DECIMAL(2, 1) DEFAULT 7.0,
    target_listening DECIMAL(2, 1) DEFAULT 7.0,
    target_reading DECIMAL(2, 1) DEFAULT 7.0,
    target_writing DECIMAL(2, 1) DEFAULT 7.0,
    target_speaking DECIMAL(2, 1) DEFAULT 7.0,
    exam_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practice sessions table
CREATE TABLE IF NOT EXISTS practice_sessions (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    skill TEXT NOT NULL CHECK (
        skill IN (
            'listening',
            'reading',
            'writing',
            'speaking'
        )
    ),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    task_name TEXT,
    score DECIMAL(2, 1),
    correct_answers INTEGER,
    total_questions INTEGER DEFAULT 40,
    part1 DECIMAL(4, 1),
    part2 DECIMAL(4, 1),
    part3 DECIMAL(4, 1),
    part4 DECIMAL(4, 1),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practice images table
CREATE TABLE IF NOT EXISTS practice_images (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

ALTER TABLE practice_images ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (no auth required for simplicity)
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Allow all on practice_sessions" ON practice_sessions FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Allow all on practice_images" ON practice_images FOR ALL USING (true)
WITH
    CHECK (true);

-- Create storage bucket for practice images
INSERT INTO
    storage.buckets (id, name, public)
VALUES (
        'practice-images',
        'practice-images',
        true
    ) ON CONFLICT (id) DO NOTHING;

-- Allow public access to storage bucket
CREATE POLICY "Public Access" ON storage.objects FOR ALL USING (bucket_id = 'practice-images')
WITH
    CHECK (bucket_id = 'practice-images');