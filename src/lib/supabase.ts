import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const serviceKey   = process.env.SUPABASE_SERVICE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Admin client con permisos completos (solo server-side)
export const supabaseAdmin = createClient(supabaseUrl, serviceKey)

export type License = {
  id: string
  license_key: string
  email: string
  customer_name: string
  type: 'monthly' | 'yearly' | 'lifetime'
  is_active: boolean
  activated_at: string | null
  expires_at: string | null
  hwid: string | null
  offline_code: string | null
  offline_code_month: string | null
  activations_count: number
  max_activations: number
  created_at: string
  notes: string | null
}

export type AppVersion = {
  id: string
  version: string
  download_url: string
  changelog: string
  is_required: boolean
  created_at: string
}

/* ---------------------------------------------------------------
   SQL para ejecutar en Supabase → SQL Editor (una sola vez)
   ---------------------------------------------------------------

CREATE TABLE IF NOT EXISTS licenses (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_key         TEXT UNIQUE NOT NULL,
  email               TEXT NOT NULL,
  customer_name       TEXT NOT NULL DEFAULT '',
  type                TEXT NOT NULL DEFAULT 'monthly' CHECK (type IN ('monthly','yearly','lifetime')),
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

CREATE TABLE IF NOT EXISTS app_versions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  version      TEXT NOT NULL,
  download_url TEXT NOT NULL,
  changelog    TEXT DEFAULT '',
  is_required  BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar versión inicial
INSERT INTO app_versions (version, download_url, changelog, is_required)
VALUES ('4.0', 'https://tu-sitio.vercel.app/download/v4', 'Versión inicial', false)
ON CONFLICT DO NOTHING;

-- Política RLS: solo service_role puede modificar
ALTER TABLE licenses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_full" ON licenses     FOR ALL USING (true);
CREATE POLICY "service_full" ON app_versions FOR ALL USING (true);
*/
