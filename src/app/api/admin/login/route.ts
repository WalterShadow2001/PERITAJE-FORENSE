import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'

// Credenciales del admin — almacenadas en variables de entorno
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@peritaje.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'PeritajeAdmin2026!'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password)
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })

  if (email !== ADMIN_EMAIL)
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })

  // Comparar contraseña (soporte bcrypt hash o texto plano como fallback)
  const valid = ADMIN_PASSWORD.startsWith('$2')
    ? await bcrypt.compare(password, ADMIN_PASSWORD)
    : password === ADMIN_PASSWORD

  if (!valid)
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })

  const token = await signToken({ email, role: 'admin' })

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', token, {
    httpOnly: true, secure: true, sameSite: 'strict',
    maxAge: 8 * 3600, path: '/',
  })
  return res
}
