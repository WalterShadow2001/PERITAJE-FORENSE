import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { license_key, email } = await req.json()
  if (!license_key || !email)
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })

  const { data: lic } = await supabaseAdmin
    .from('licenses').select('is_active,expires_at,type,customer_name,email')
    .eq('license_key', license_key.toUpperCase()).single()

  if (!lic) return NextResponse.json({ error: 'Licencia no encontrada' }, { status: 404 })
  if (lic.email.toLowerCase() !== email.toLowerCase())
    return NextResponse.json({ error: 'Email no coincide' }, { status: 403 })
  if (!lic.is_active)
    return NextResponse.json({ error: 'Licencia inactiva' }, { status: 403 })
  if (lic.expires_at && new Date(lic.expires_at) < new Date())
    return NextResponse.json({ error: 'Licencia expirada' }, { status: 403 })

  return NextResponse.json({
    message:       `Licencia ${lic.type} válida para ${lic.customer_name || lic.email}`,
    expires_at:    lic.expires_at,
    license_type:  lic.type,
  })
}
