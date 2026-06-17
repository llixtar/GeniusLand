-- ==========================================
-- SQL SCHEMA FOR GALLERY
-- Run this in the SQL Editor of your Supabase Dashboard:
-- https://supabase.com/dashboard/project/yldhgwfrjqohqlydjbfq/sql
-- ==========================================

-- 1. Create the gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies for gallery
-- Allow everyone (anonymous users) to read/view photos
CREATE POLICY "Allow public read access" ON public.gallery
  FOR SELECT USING (true);

-- Allow authenticated users (admin) to insert new photos
CREATE POLICY "Allow authenticated insert" ON public.gallery
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to delete photos
CREATE POLICY "Allow authenticated delete" ON public.gallery
  FOR DELETE USING (auth.role() = 'authenticated');

-- ==========================================
-- STORAGE BUCKET CONFIGURATION
-- Note: Create a public storage bucket named "gallery" in Supabase Dashboard -> Storage
-- Set policies for the "gallery" bucket:
--   - Select: public (everyone)
--   - Insert/Delete: authenticated users only
-- ==========================================
