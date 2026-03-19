import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET() {
  const { data } = await supabaseAdmin
    .from('app_versions').select('*').order('created_at', { ascending: false })
  return NextResponse.json({ versions: data || [] })
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { version, download_url, changelog, is_required } = await req.json()
  const { data, error } = await supabaseAdmin.from('app_versions')
    .insert({ version, download_url, changelog, is_required: !!is_required })
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ version: data }, { status: 201 })
}
