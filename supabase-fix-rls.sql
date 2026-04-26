-- =====================================================
-- ARBORA HOGAR - RLS Fix + Storage Upload Policies
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- =====================================================

-- -------------------------------------------------------
-- 1. DROP existing restrictive read-only policies
-- -------------------------------------------------------
DROP POLICY IF EXISTS "Public read projects"    ON projects;
DROP POLICY IF EXISTS "Public read gallery"     ON gallery;
DROP POLICY IF EXISTS "Public read categories"  ON categories;
DROP POLICY IF EXISTS "Public insert contacts"  ON contact_entries;

-- -------------------------------------------------------
-- 2. Full access for anon role (Phase 1 — no auth yet)
--    The frontend still filters published=true in queries.
--    Replace these with role-based policies in Phase 2.
-- -------------------------------------------------------
CREATE POLICY "Anon all projects"       ON projects        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon all gallery"        ON gallery         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon all categories"     ON categories      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon insert contacts"    ON contact_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon read contacts"      ON contact_entries FOR SELECT USING (true);

-- -------------------------------------------------------
-- 3. Storage upload + delete policies
--    Without these, file uploads from the frontend fail.
-- -------------------------------------------------------

-- project-images bucket
CREATE POLICY "Anon upload project-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Anon update project-images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'project-images');

CREATE POLICY "Anon delete project-images" ON storage.objects
  FOR DELETE USING (bucket_id = 'project-images');

-- project-models bucket
CREATE POLICY "Anon upload project-models" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-models');

CREATE POLICY "Anon delete project-models" ON storage.objects
  FOR DELETE USING (bucket_id = 'project-models');

-- gallery-images bucket
CREATE POLICY "Anon upload gallery-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery-images');

CREATE POLICY "Anon delete gallery-images" ON storage.objects
  FOR DELETE USING (bucket_id = 'gallery-images');
