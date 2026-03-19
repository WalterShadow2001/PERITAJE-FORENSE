'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ActivatePage() {
  const [key, setKey]     = useState('')
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<{ok:boolean, msg:string, expires?:string} | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setResult(null)
    const res = await fetch('/api/license/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ license_key: key.trim().toUpperCase(), email: email.trim() }),
    })
    const data = await res.json()
    setResult({ ok: res.ok, msg: data.message || data.error, expires: data.expires_at })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col">
      <nav className="bg-[#161B22] border-b border-[#30363D] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#3FB950] rounded-md flex items-center justify-center text-xs font-bold text-black">PD</div>
          <span className="font-bold text-[#E6EDF3] text-sm">Peritaje Digital Pro</span>
        </Link>
        <Link href="/" className="text-[#8B949E] hover:text-[#E6EDF3] text-sm">← Inicio</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔑</div>
            <h1 className="text-2xl font-bold text-[#E6EDF3]">Verificar Licencia</h1>
            <p className="text-[#8B949E] text-sm mt-1">Ingresa tu clave para verificar el estado</p>
          </div>

          <form onSubmit={handleActivate} className="space-y-4">
            <div>
              <label className="block text-sm text-[#8B949E] mb-1.5">License Key</label>
              <input value={key} onChange={e => setKey(e.target.value)}
                placeholder="PD-XXXX-XXXX-XXXX-XXXX"
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-[#E6EDF3] font-mono focus:outline-none focus:border-[#58A6FF] tracking-wider uppercase"
                required/>
            </div>
            <div>
              <label className="block text-sm text-[#8B949E] mb-1.5">Email de compra</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-[#E6EDF3] focus:outline-none focus:border-[#58A6FF]"
                required/>
            </div>

            {result && (
              <div className={`rounded-lg px-4 py-3 ${result.ok ? 'bg-[#3FB950]/10 border border-[#3FB950]/30 text-[#3FB950]' : 'bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149]'}`}>
                <p className="font-medium">{result.ok ? '✔' : '✗'} {result.msg}</p>
                {result.expires && <p className="text-sm mt-1 opacity-75">Expira: {new Date(result.expires).toLocaleDateString('es')}</p>}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition-colors">
              {loading ? 'Verificando...' : 'Verificar Licencia'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-[#0D1117] rounded-lg border border-[#30363D]">
            <p className="text-[#8B949E] text-xs text-center">
              La activación se realiza desde el programa instalado.<br/>
              Esta página solo verifica el estado de tu licencia.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
