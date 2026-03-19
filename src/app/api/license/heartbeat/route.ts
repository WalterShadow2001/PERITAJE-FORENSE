import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST /api/license/heartbeat — keeps session alive, checks if still valid
export async function POST(req: NextRequest) {
  const { license_key, hwid } = await req.json()
  if (!license_key || !hwid)
    return NextResponse.json({ valid: false, error: 'Datos incompletos' }, { status: 400 })

  const { data: lic } = await supabaseAdmin
    .from('licenses').select('id,is_active,expires_at,hwid,type')
    .eq('license_key', license_key.toUpperCase()).single()

  if (!lic)  return NextResponse.json({ valid: false, error: 'No encontrada' }, { status: 404 })
  if (!lic.is_active) return NextResponse.json({ valid: false, error: 'Inactiva' }, { status: 403 })
  if (lic.hwid && lic.hwid !== hwid) return NextResponse.json({ valid: false, error: 'HWID no coincide' }, { status: 403 })
  if (lic.expires_at && new Date(lic.expires_at) < new Date())
    return NextResponse.json({ valid: false, error: 'Expirada' }, { status: 403 })

  return NextResponse.json({
    valid:       true,
    expires_at:  lic.expires_at,
    is_lifetime: lic.type === 'lifetime',
    server_time: new Date().toISOString(),
  })
}
