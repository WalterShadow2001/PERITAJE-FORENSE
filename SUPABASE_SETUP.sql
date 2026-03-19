-- ================================================================
-- PERITAJE DIGITAL PRO — SETUP SUPABASE
-- Ejecuta este script en: Supabase → SQL Editor → New Query
-- ================================================================

-- 1. Tabla de licencias
CREATE TABLE IF NOT EXISTS licenses (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_key         TEXT UNIQUE NOT NULL,
  email               TEXT NOT NULL,
  customer_name       TEXT NOT NULL DEFAULT '',
  type                TEXT NOT NULL DEFAULT 'monthly'
                      CHECK (type IN ('monthly','yearly','lifetime','offline')),
  is_active           BOOLEAN DEFAULT true,
  activated_at        TIMESTAMPTZ,
  expires_at          TIMESTAMPTZ,
  hwid                TEXT,
  offline_code        TEXT,
  offline_code_month  TEXT,
  activations_count   INT DEFAULT 0,
  max_activations     INT DEFAULT 1,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de versiones
CREATE TABLE IF NOT EXISTS app_versions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  version      TEXT NOT NULL,
  download_url TEXT NOT NULL,
  changelog    TEXT DEFAULT '',
  is_required  BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Insertar versión inicial
INSERT INTO app_versions (version, download_url, changelog, is_required)
VALUES (
  '4.0',
  'https://peritaje-digital-licencias.vercel.app/download/v4',
  'Versión inicial: análisis forense con IA Groq, motor heurístico, recuperación de archivos.',
  false
) ON CONFLICT DO NOTHING;

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE licenses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_versions ENABLE ROW LEVEL SECURITY;

-- 5. Políticas: solo service_role puede leer/escribir
-- (el anon key NO puede acceder directamente — todo va por la API de Next.js)
DROP POLICY IF EXISTS "service_full_licenses"     ON licenses;
DROP POLICY IF EXISTS "service_full_app_versions" ON app_versions;

CREATE POLICY "service_full_licenses"
  ON licenses FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_full_app_versions"
  ON app_versions FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- 6. Licencia de prueba para admin (opcional — bórrala en producción)
INSERT INTO licenses (
  license_key, email, customer_name, type,
  is_active, max_activations, notes
) VALUES (
  'PD-TEST-DEMO-XXXX-2026',
  'admin@peritaje.com',
  'Licencia de Prueba Admin',
  'lifetime',
  true, 5,
  'Licencia demo para pruebas. NO usar en producción.'
) ON CONFLICT DO NOTHING;

-- ================================================================
-- VERIFICAR QUE TODO SE CREO CORRECTAMENTE:
-- ================================================================
SELECT 'licenses'     AS tabla, count(*) AS filas FROM licenses
UNION ALL
SELECT 'app_versions' AS tabla, count(*) AS filas FROM app_versions;
