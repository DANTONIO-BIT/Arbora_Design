-- =====================================================
-- ADMIN POLICIES (PHASE 1 - Development)
-- Allow all operations for now to enable the Admin Panel
-- =====================================================

-- Categories
CREATE POLICY "Enable all for anon on categories" ON categories
  FOR ALL USING (true) WITH CHECK (true);

-- Projects
CREATE POLICY "Enable all for anon on projects" ON projects
  FOR ALL USING (true) WITH CHECK (true);

-- Gallery
CREATE POLICY "Enable all for anon on gallery" ON gallery
  FOR ALL USING (true) WITH CHECK (true);

-- Storage: Allow uploads/updates/deletes in buckets
CREATE POLICY "Enable all for anon on project-images" ON storage.objects
  FOR ALL USING (bucket_id = 'project-images') WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Enable all for anon on project-models" ON storage.objects
  FOR ALL USING (bucket_id = 'project-models') WITH CHECK (bucket_id = 'project-models');

CREATE POLICY "Enable all for anon on gallery-images" ON storage.objects
  FOR ALL USING (bucket_id = 'gallery-images') WITH CHECK (bucket_id = 'gallery-images');
