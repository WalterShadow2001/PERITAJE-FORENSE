'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (res.ok) { router.push('/admin') }
    else { setError(data.error || 'Credenciales incorrectas'); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-10 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#3FB950] rounded-2xl flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">PD</div>
          <h1 className="text-2xl font-bold text-[#E6EDF3]">Panel Admin</h1>
          <p className="text-[#8B949E] text-sm mt-1">Peritaje Digital Pro · Licencias</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-[#8B949E] mb-1.5">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-[#E6EDF3] focus:outline-none focus:border-[#58A6FF] transition-colors"
              placeholder="admin@peritaje.com" required
            />
          </div>
          <div>
            <label className="block text-sm text-[#8B949E] mb-1.5">Contraseña</label>
            <input
              type="password" value={password} onChange={e => setPass(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-[#E6EDF3] focus:outline-none focus:border-[#58A6FF] transition-colors"
              placeholder="••••••••" required
            />
          </div>
          {error && <p className="text-[#F85149] text-sm bg-[#F85149]/10 border border-[#F85149]/30 rounded-lg px-4 py-2">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition-colors mt-2"
          >
            {loading ? 'Entrando...' : 'Entrar al Panel'}
          </button>
        </form>
      </div>
    </div>
  )
}
