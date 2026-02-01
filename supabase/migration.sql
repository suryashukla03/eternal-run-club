-- Eternal Run Club Database Migration
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create team enum type
CREATE TYPE team_name AS ENUM ('Alpha', 'Beta');

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    team_name team_name NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create runs table
CREATE TABLE public.runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    distance_km DECIMAL(5, 2) NOT NULL CHECK (distance_km >= 0),
    duration_mins INTEGER NOT NULL CHECK (duration_mins > 0),
    points INTEGER NOT NULL DEFAULT 0,
    image_proof_url TEXT,
    run_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure one run per user per day
    CONSTRAINT unique_user_run_date UNIQUE (user_id, run_date)
);

-- Create indexes for faster queries
CREATE INDEX idx_runs_user_id ON public.runs(user_id);
CREATE INDEX idx_runs_run_date ON public.runs(run_date);
CREATE INDEX idx_users_team_name ON public.users(team_name);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all users" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for runs table
CREATE POLICY "Anyone can view all runs" ON public.runs
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own runs" ON public.runs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own runs" ON public.runs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own runs" ON public.runs
    FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for run proof images
INSERT INTO storage.buckets (id, name, public)
VALUES ('run-proofs', 'run-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for run proof images
CREATE POLICY "Anyone can view run proofs" ON storage.objects
    FOR SELECT USING (bucket_id = 'run-proofs');

CREATE POLICY "Authenticated users can upload run proofs" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'run-proofs' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can delete their own run proofs" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'run-proofs' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Function to get team scores
CREATE OR REPLACE FUNCTION get_team_scores()
RETURNS TABLE (team team_name, total_points BIGINT, total_runs BIGINT, total_distance DECIMAL) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.team_name as team,
        COALESCE(SUM(r.points), 0)::BIGINT as total_points,
        COUNT(r.id)::BIGINT as total_runs,
        COALESCE(SUM(r.distance_km), 0) as total_distance
    FROM public.users u
    LEFT JOIN public.runs r ON u.id = r.user_id
    GROUP BY u.team_name
    ORDER BY total_points DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get individual leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard()
RETURNS TABLE (
    user_id UUID,
    username TEXT,
    team team_name,
    total_points BIGINT,
    total_runs BIGINT,
    total_distance DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.username,
        u.team_name as team,
        COALESCE(SUM(r.points), 0)::BIGINT as total_points,
        COUNT(r.id)::BIGINT as total_runs,
        COALESCE(SUM(r.distance_km), 0) as total_distance
    FROM public.users u
    LEFT JOIN public.runs r ON u.id = r.user_id
    GROUP BY u.id, u.username, u.team_name
    ORDER BY total_points DESC, total_runs DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get user stats
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS TABLE (
    total_points BIGINT,
    total_runs BIGINT,
    total_distance DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(r.points), 0)::BIGINT as total_points,
        COUNT(r.id)::BIGINT as total_runs,
        COALESCE(SUM(r.distance_km), 0) as total_distance
    FROM public.runs r
    WHERE r.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
