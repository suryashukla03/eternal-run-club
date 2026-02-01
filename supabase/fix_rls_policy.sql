-- Fix RLS Policy for Users Table
-- Run this SQL in your Supabase SQL Editor to fix the signup issue

-- ============================================
-- STEP 1: Fix the RLS Policy
-- ============================================

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- Create a new policy that allows authenticated users to insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT 
    WITH CHECK (
        auth.uid() IS NOT NULL AND auth.uid() = id
    );

-- ============================================
-- STEP 2: Create trigger for automatic profile creation (RECOMMENDED)
-- This creates the user profile automatically when email is confirmed
-- ============================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, username, team_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'team_name')::team_name, 'Alpha')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger that fires after user confirms email
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STEP 3: Also handle users who update (confirm email)
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create profile if email was just confirmed and profile doesn't exist
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        INSERT INTO public.users (id, email, username, team_name)
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
            COALESCE((NEW.raw_user_meta_data->>'team_name')::team_name, 'Alpha')
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();
