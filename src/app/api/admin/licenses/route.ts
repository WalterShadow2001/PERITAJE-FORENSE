import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminFromRequest } from '@/lib/auth'
import { generateLicenseKey, calcExpiration } from '@/lib/license'

async function requireAdmin(req: NextRequest) {
  const admin = await getAdminFromRequest(req)
  if (!admin) throw new Error('UNAUTHORIZED')
  return admin
}

// GET /api/admin/licenses
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const { data, error } = await supabaseAdmin
      .from('licenses').select('*').order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ licenses: data })
  } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
}

// POST /api/admin/licenses
export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const { email, customer_name, type, notes, max_activations } = body
    if (!email || !type) return NextResponse.json({ error: 'email y type son requeridos' }, { status: 400 })

    const license_key = generateLicenseKey()
    const expires_at  = calcExpiration(type as 'monthly'|'yearly'|'lifetime')

    const { data, error } = await supabaseAdmin.from('licenses').insert({
      license_key, email, customer_name: customer_name || '',
      type, notes: notes || null,
      max_activations: parseInt(max_activations) || 1,
      expires_at: expires_at?.toISOString() || null,
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ license: data }, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Error'
    if (msg === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
