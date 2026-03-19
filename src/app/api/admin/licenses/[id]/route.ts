import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminFromRequest } from '@/lib/auth'

async function requireAdmin(req: NextRequest) {
  const admin = await getAdminFromRequest(req)
  if (!admin) throw new Error('UNAUTHORIZED')
}

// PATCH /api/admin/licenses/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    const updates = await req.json()
    const { data, error } = await supabaseAdmin
      .from('licenses').update(updates).eq('id', params.id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ license: data })
  } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
}

// DELETE /api/admin/licenses/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req)
    const { error } = await supabaseAdmin.from('licenses').delete().eq('id', params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
}
