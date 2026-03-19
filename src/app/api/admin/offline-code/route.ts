import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminFromRequest } from '@/lib/auth'
import { generateOfflineCode, currentMonthYear } from '@/lib/license'

export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { license_key, hwid } = await req.json()
  if (!license_key || !hwid)
    return NextResponse.json({ error: 'license_key y hwid son requeridos' }, { status: 400 })

  // Verificar que la licencia existe y está activa
  const { data: lic } = await supabaseAdmin
    .from('licenses').select('*').eq('license_key', license_key).single()
  if (!lic) return NextResponse.json({ error: 'Licencia no encontrada' }, { status: 404 })
  if (!lic.is_active) return NextResponse.json({ error: 'Licencia inactiva' }, { status: 403 })

  const month = currentMonthYear()
  const code  = generateOfflineCode(license_key, hwid, month)

  // Guardar el código en la BD para auditoría
  await supabaseAdmin.from('licenses').update({
    offline_code:       code,
    offline_code_month: month,
  }).eq('license_key', license_key)

  return NextResponse.json({ code, month, valid_until: `Fin de ${month}` })
}
