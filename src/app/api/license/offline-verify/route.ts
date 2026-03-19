import { NextRequest, NextResponse } from 'next/server'
import { verifyOfflineCode, currentMonthYear } from '@/lib/license'

// POST /api/license/offline-verify
// Called when program has no internet — verifies the HMAC code locally
export async function POST(req: NextRequest) {
  const { license_key, hwid, code } = await req.json()
  if (!license_key || !hwid || !code)
    return NextResponse.json({ valid: false, error: 'Datos incompletos' }, { status: 400 })

  const month = currentMonthYear()
  const valid = verifyOfflineCode(license_key, hwid, month, code)

  if (!valid)
    return NextResponse.json({ valid: false, error: 'Código inválido o expirado (es mensual)' }, { status: 403 })

  return NextResponse.json({ valid: true, month, message: `Código válido para ${month}` })
}
