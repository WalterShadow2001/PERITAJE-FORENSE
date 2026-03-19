import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/updates/check?version=4.0
export async function GET(req: NextRequest) {
  const current = req.nextUrl.searchParams.get('version') || '0'

  const { data } = await supabaseAdmin
    .from('app_versions').select('*').order('created_at', { ascending: false }).limit(1)

  if (!data || data.length === 0)
    return NextResponse.json({ update_available: false })

  const latest = data[0]

  // Comparación simple de versiones
  const hasUpdate = latest.version !== current

  return NextResponse.json({
    update_available: hasUpdate,
    latest_version:   latest.version,
    current_version:  current,
    download_url:     latest.download_url,
    changelog:        latest.changelog,
    is_required:      latest.is_required,
  })
}
