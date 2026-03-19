'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { License } from '@/lib/supabase'

type Tab = 'licencias' | 'nueva' | 'versiones'

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab]             = useState<Tab>('licencias')
  const [licenses, setLicenses]   = useState<License[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState<License | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState({ email:'', customer_name:'', type:'monthly', notes:'', max_activations:'1' })
  const [saving, setSaving]       = useState(false)
  const [msg, setMsg]             = useState('')

  const fetchLicenses = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/licenses')
    if (res.status === 401) { router.push('/login'); return }
    const data = await res.json()
    setLicenses(data.licenses || [])
    setLoading(false)
  }, [router])

  useEffect(() => { fetchLicenses() }, [fetchLicenses])

  const filtered = licenses.filter(l =>
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    l.license_key.toLowerCase().includes(search.toLowerCase()) ||
    (l.customer_name || '').toLowerCase().includes(search.toLowerCase())
  )

  async function crearLicencia() {
    setSaving(true); setMsg('')
    const res = await fetch('/api/admin/licenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) { setMsg(`✔ Licencia creada: ${data.license.license_key}`); fetchLicenses(); setTab('licencias') }
    else setMsg(`✗ Error: ${data.error}`)
    setSaving(false)
  }

  async function toggleLicencia(id: string, active: boolean) {
    await fetch(`/api/admin/licenses/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !active }),
    })
    fetchLicenses()
  }

  async function eliminarLicencia(id: string) {
    if (!confirm('¿Eliminar esta licencia permanentemente?')) return
    await fetch(`/api/admin/licenses/${id}`, { method: 'DELETE' })
    fetchLicenses()
  }

  async function resetHWID(id: string) {
    await fetch(`/api/admin/licenses/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hwid: null, activations_count: 0 }),
    })
    fetchLicenses()
  }

  async function generarCodigoOffline(lic: License) {
    const hwid = prompt('HWID del equipo del cliente (aparece en el programa):')
    if (!hwid) return
    const res = await fetch('/api/admin/offline-code', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ license_key: lic.license_key, hwid }),
    })
    const data = await res.json()
    if (res.ok) alert(`Código offline del mes:\n\n${data.code}\n\nVálido hasta fin de mes para HWID: ${hwid}`)
    else alert(`Error: ${data.error}`)
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/login')
  }

  const badgeColor = (type: string) =>
    type === 'lifetime' ? 'bg-[#3FB950]/20 text-[#3FB950] border-[#3FB950]/30' :
    type === 'yearly'   ? 'bg-[#58A6FF]/20 text-[#58A6FF] border-[#58A6FF]/30' :
                          'bg-[#E3B341]/20 text-[#E3B341] border-[#E3B341]/30'

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Header */}
      <header className="bg-[#161B22] border-b border-[#30363D] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#3FB950] rounded-lg flex items-center justify-center text-sm font-bold text-black">PD</div>
          <span className="font-bold text-[#E6EDF3]">Admin · Peritaje Digital Pro</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#8B949E] text-sm">{licenses.length} licencias</span>
          <button onClick={logout} className="text-[#F85149] hover:text-[#ff7b72] text-sm">Cerrar sesión</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-[#161B22] border border-[#30363D] rounded-xl p-1 w-fit mb-8">
          {([['licencias','📋 Licencias'],['nueva','➕ Nueva Licencia'],['versiones','🔄 Versiones']] as [Tab,string][]).map(([t,label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab===t ? 'bg-[#1C2128] text-[#E6EDF3]' : 'text-[#8B949E] hover:text-[#E6EDF3]'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* === LICENCIAS === */}
        {tab === 'licencias' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#E6EDF3]">Gestión de Licencias</h2>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por email, key o nombre..."
                className="bg-[#161B22] border border-[#30363D] rounded-lg px-4 py-2 text-sm text-[#E6EDF3] w-72 focus:outline-none focus:border-[#58A6FF]"/>
            </div>

            {loading ? (
              <div className="text-center text-[#8B949E] py-20">Cargando...</div>
            ) : (
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#30363D] text-[#8B949E]">
                      {['License Key','Cliente','Email','Tipo','Estado','Expira','Activaciones','Acciones'].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(lic => (
                      <tr key={lic.id} className="border-b border-[#30363D]/50 hover:bg-[#1C2128] transition-colors">
                        <td className="px-4 py-3 font-mono text-[#58A6FF] text-xs">{lic.license_key}</td>
                        <td className="px-4 py-3 text-[#E6EDF3]">{lic.customer_name || '—'}</td>
                        <td className="px-4 py-3 text-[#8B949E]">{lic.email}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${badgeColor(lic.type)}`}>
                            {lic.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${lic.is_active ? 'bg-[#3FB950]/20 text-[#3FB950]' : 'bg-[#F85149]/20 text-[#F85149]'}`}>
                            {lic.is_active ? 'Activa' : 'Inactiva'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#8B949E] text-xs">
                          {lic.expires_at ? new Date(lic.expires_at).toLocaleDateString('es') : '∞ Lifetime'}
                        </td>
                        <td className="px-4 py-3 text-[#8B949E] text-center">
                          {lic.activations_count}/{lic.max_activations}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            <button onClick={() => { setSelected(lic); setShowModal(true) }}
                              className="text-xs bg-[#58A6FF]/20 text-[#58A6FF] hover:bg-[#58A6FF]/30 px-2 py-1 rounded transition-colors">
                              Ver
                            </button>
                            <button onClick={() => toggleLicencia(lic.id, lic.is_active)}
                              className={`text-xs px-2 py-1 rounded transition-colors ${lic.is_active ? 'bg-[#F85149]/20 text-[#F85149] hover:bg-[#F85149]/30' : 'bg-[#3FB950]/20 text-[#3FB950] hover:bg-[#3FB950]/30'}`}>
                              {lic.is_active ? 'Desactivar' : 'Activar'}
                            </button>
                            <button onClick={() => resetHWID(lic.id)}
                              className="text-xs bg-[#E3B341]/20 text-[#E3B341] hover:bg-[#E3B341]/30 px-2 py-1 rounded transition-colors">
                              Reset HWID
                            </button>
                            <button onClick={() => generarCodigoOffline(lic)}
                              className="text-xs bg-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/30 px-2 py-1 rounded transition-colors">
                              Código Offline
                            </button>
                            <button onClick={() => eliminarLicencia(lic.id)}
                              className="text-xs bg-[#F85149]/20 text-[#F85149] hover:bg-[#F85149]/30 px-2 py-1 rounded transition-colors">
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="text-center text-[#8B949E] py-16">No hay licencias que coincidan</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* === NUEVA LICENCIA === */}
        {tab === 'nueva' && (
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold text-[#E6EDF3] mb-6">Nueva Licencia</h2>
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 space-y-4">
              {[
                { label:'Email del cliente', key:'email', type:'email', ph:'cliente@ejemplo.com' },
                { label:'Nombre del cliente', key:'customer_name', type:'text', ph:'Juan Pérez' },
                { label:'Notas internas', key:'notes', type:'text', ph:'Opcional...' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm text-[#8B949E] mb-1.5">{f.label}</label>
                  <input type={f.type} placeholder={f.ph}
                    value={(form as Record<string,string>)[f.key]}
                    onChange={e => setForm({...form, [f.key]: e.target.value})}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-[#E6EDF3] focus:outline-none focus:border-[#58A6FF]"/>
                </div>
              ))}
              <div>
                <label className="block text-sm text-[#8B949E] mb-1.5">Tipo de licencia</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-[#E6EDF3] focus:outline-none focus:border-[#58A6FF]">
                  <option value="monthly">Mensual (1 mes)</option>
                  <option value="yearly">Anual (12 meses)</option>
                  <option value="lifetime">Lifetime (sin expiración)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#8B949E] mb-1.5">Máx. activaciones por licencia</label>
                <input type="number" min="1" max="10" value={form.max_activations}
                  onChange={e => setForm({...form, max_activations: e.target.value})}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-[#E6EDF3] focus:outline-none focus:border-[#58A6FF]"/>
              </div>
              {msg && <p className={`text-sm rounded-lg px-4 py-2 ${msg.startsWith('✔') ? 'bg-[#3FB950]/10 text-[#3FB950] border border-[#3FB950]/30' : 'bg-[#F85149]/10 text-[#F85149] border border-[#F85149]/30'}`}>{msg}</p>}
              <button onClick={crearLicencia} disabled={saving}
                className="w-full bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition-colors">
                {saving ? 'Creando...' : 'Generar Licencia'}
              </button>
            </div>
          </div>
        )}

        {/* === VERSIONES === */}
        {tab === 'versiones' && <VersionesTab />}
      </div>

      {/* Modal detalle licencia */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8 max-w-lg w-full">
            <h3 className="text-xl font-bold text-[#E6EDF3] mb-6">Detalle de Licencia</h3>
            <div className="space-y-3 text-sm">
              {[
                ['License Key', selected.license_key],
                ['Cliente', selected.customer_name || '—'],
                ['Email', selected.email],
                ['Tipo', selected.type],
                ['Estado', selected.is_active ? 'Activa' : 'Inactiva'],
                ['Activaciones', `${selected.activations_count}/${selected.max_activations}`],
                ['HWID', selected.hwid || 'No activado'],
                ['Expira', selected.expires_at ? new Date(selected.expires_at).toLocaleString('es') : 'Lifetime'],
                ['Código Offline', selected.offline_code ? `${selected.offline_code} (mes: ${selected.offline_code_month})` : 'No generado'],
                ['Creada', new Date(selected.created_at).toLocaleString('es')],
                ['Notas', selected.notes || '—'],
              ].map(([k,v]) => (
                <div key={k} className="flex gap-3">
                  <span className="text-[#8B949E] w-28 shrink-0">{k}:</span>
                  <span className="text-[#E6EDF3] font-mono break-all">{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowModal(false)}
              className="mt-6 w-full bg-[#30363D] hover:bg-[#444c56] text-[#E6EDF3] py-2 rounded-lg transition-colors">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function VersionesTab() {
  const [versions, setVersions] = useState<{id:string,version:string,download_url:string,changelog:string,is_required:boolean,created_at:string}[]>([])
  const [form, setForm]         = useState({ version:'', download_url:'', changelog:'', is_required: false })
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState('')

  useEffect(() => {
    fetch('/api/admin/versions').then(r => r.json()).then(d => setVersions(d.versions || []))
  }, [])

  async function crear() {
    setSaving(true); setMsg('')
    const res = await fetch('/api/admin/versions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) { setMsg('✔ Versión creada'); setVersions(v => [data.version, ...v]) }
    else setMsg(`✗ ${data.error}`)
    setSaving(false)
  }

  return (
    <div className="max-w-3xl space-y-8">
      <h2 className="text-2xl font-bold text-[#E6EDF3]">Gestión de Versiones</h2>

      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-[#E6EDF3]">Publicar nueva versión</h3>
        {[
          { label:'Número de versión', key:'version', ph:'4.1' },
          { label:'URL de descarga', key:'download_url', ph:'https://...' },
          { label:'Changelog', key:'changelog', ph:'Qué hay de nuevo...' },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-sm text-[#8B949E] mb-1.5">{f.label}</label>
            <input placeholder={f.ph} value={(form as Record<string,unknown>)[f.key] as string}
              onChange={e => setForm({...form, [f.key]: e.target.value})}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-[#E6EDF3] focus:outline-none focus:border-[#58A6FF]"/>
          </div>
        ))}
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_required} onChange={e => setForm({...form, is_required: e.target.checked})}
            className="w-4 h-4 accent-[#F85149]"/>
          <span className="text-sm text-[#E6EDF3]">Actualización obligatoria (fuerza la actualización)</span>
        </label>
        {msg && <p className={`text-sm px-4 py-2 rounded-lg ${msg.startsWith('✔') ? 'bg-[#3FB950]/10 text-[#3FB950]' : 'bg-[#F85149]/10 text-[#F85149]'}`}>{msg}</p>}
        <button onClick={crear} disabled={saving}
          className="bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-lg">
          {saving ? 'Publicando...' : 'Publicar Versión'}
        </button>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[#30363D] text-[#8B949E]">
            {['Versión','URL','Obligatoria','Fecha'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}
          </tr></thead>
          <tbody>
            {versions.map(v => (
              <tr key={v.id} className="border-b border-[#30363D]/50">
                <td className="px-4 py-3 font-bold text-[#58A6FF]">v{v.version}</td>
                <td className="px-4 py-3 text-[#8B949E] text-xs truncate max-w-xs">{v.download_url}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${v.is_required ? 'bg-[#F85149]/20 text-[#F85149]' : 'bg-[#30363D] text-[#8B949E]'}`}>
                    {v.is_required ? 'Sí' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#8B949E] text-xs">{new Date(v.created_at).toLocaleDateString('es')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
