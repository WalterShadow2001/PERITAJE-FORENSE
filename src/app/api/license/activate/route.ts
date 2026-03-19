import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST /api/license/activate
// Called by Python program on first use with license_key + email + hwid
export async function POST(req: NextRequest) {
  const { license_key, email, hwid } = await req.json()

  if (!license_key || !email || !hwid)
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })

  const { data: lic, error } = await supabaseAdmin
    .from('licenses').select('*').eq('license_key', license_key.toUpperCase()).single()

  if (error || !lic)
    return NextResponse.json({ valid: false, error: 'Licencia no encontrada' }, { status: 404 })

  if (!lic.is_active)
    return NextResponse.json({ valid: false, error: 'Licencia inactiva o suspendida' }, { status: 403 })

  if (lic.email.toLowerCase() !== email.toLowerCase())
    return NextResponse.json({ valid: false, error: 'Email no coincide con la licencia' }, { status: 403 })

  // Si ya está activada en otro equipo y se alcanzó el límite
  if (lic.hwid && lic.hwid !== hwid && lic.activations_count >= lic.max_activations)
    return NextResponse.json({
      valid: false,
      error: `Esta licencia ya está activada en otro equipo (${lic.activations_count}/${lic.max_activations}). Contacta soporte para resetear.`
    }, { status: 403 })

  // Verificar expiración
  if (lic.expires_at && new Date(lic.expires_at) < new Date())
    return NextResponse.json({ valid: false, error: 'Licencia expirada' }, { status: 403 })

  // Primera activación o mismo equipo
  const isNew = !lic.hwid || lic.hwid !== hwid
  if (isNew) {
    await supabaseAdmin.from('licenses').update({
      hwid,
      activated_at:      lic.activated_at || new Date().toISOString(),
      activations_count: (lic.activations_count || 0) + (lic.hwid === hwid ? 0 : 1),
    }).eq('id', lic.id)
  }

  return NextResponse.json({
    valid:        true,
    message:      'Licencia activada correctamente',
    license_type: lic.type,
    expires_at:   lic.expires_at,
    customer_name:lic.customer_name,
    is_lifetime:  lic.type === 'lifetime',
  })
}
