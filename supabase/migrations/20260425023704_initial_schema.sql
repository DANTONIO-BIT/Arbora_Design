-- =====================================================
-- ARBORA HOGAR - Database Schema
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- =====================================================
-- Table: categories
-- Categorías reutilizables en proyectos y galería
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#8B6F5C',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar categorías por defecto
INSERT INTO categories (name, slug, color, description) VALUES
  ('Apartamento', 'apartamento', '#8B6F5C', 'Proyectos de departamentos'),
  ('Casa', 'casa', '#6B4E40', 'Proyectos residenciales'),
  ('Cocina', 'cocina', '#5D4037', 'Diseño de cocinas'),
  ('Reforma', 'reforma', '#4E342E', 'Reformas integrales'),
  ('Muebles a medida', 'muebles', '#3E2723', 'Muebles personalizados')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- Table: projects
-- Proyectos con storytelling completo
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id),
  area INTEGER,
  location TEXT,
  description TEXT,
  story TEXT,
  images TEXT[] DEFAULT '{}',
  has_model BOOLEAN DEFAULT false,
  model_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Table: gallery
-- Imágenes para grid rápido
-- =====================================================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  image_url TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  project_id UUID REFERENCES projects(id),
  description TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Table: contact_entries
-- Leads del formulario de contacto
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  service TEXT,
  area INTEGER,
  message TEXT,
  wants_appointment BOOLEAN DEFAULT false,
  appointment_date DATE,
  status TEXT DEFAULT 'nuevo',
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RLS Policies (seguridad)
-- =====================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_entries ENABLE ROW LEVEL SECURITY;

-- Público: lectura de categorías
CREATE POLICY "Public read categories" ON categories
  FOR SELECT USING (true);

-- Público: lectura de proyectos publicados
CREATE POLICY "Public read projects" ON projects
  FOR SELECT USING (published = true);

-- Público: lectura de galería publicada
CREATE POLICY "Public read gallery" ON gallery
  FOR SELECT USING (published = true);

-- Público: crear contact_entries
CREATE POLICY "Public insert contacts" ON contact_entries
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- Storage Buckets
-- =====================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('project-images', 'project-images', true),
  ('project-models', 'project-models', true),
  ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public access project-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Public access project-models" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-models');

CREATE POLICY "Public access gallery-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery-images');

-- =====================================================
-- Trigger: Notificar nuevo lead por email
-- (Requiere Resend configurado)
-- =====================================================
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
BEGIN
  -- Por implementar con Resend cuando esté configurado
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_contact_entry
  AFTER INSERT ON contact_entries
  FOR EACH ROW EXECUTE FUNCTION notify_new_lead();