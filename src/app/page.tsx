import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* NAV */}
      <nav className="border-b border-[#30363D] bg-[#161B22]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#3FB950] rounded-lg flex items-center justify-center text-sm font-bold text-black">PD</div>
            <span className="font-bold text-[#E6EDF3]">Peritaje Digital Pro</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/terms" className="text-[#8B949E] hover:text-[#E6EDF3] text-sm">Términos</Link>
            <Link href="/activate" className="text-[#8B949E] hover:text-[#E6EDF3] text-sm">Activar Licencia</Link>
            <Link href="/login" className="bg-[#238636] hover:bg-[#2ea043] text-white text-sm px-4 py-1.5 rounded-md font-medium transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-[#161B22] border border-[#30363D] rounded-full px-4 py-1.5 text-sm text-[#58A6FF] mb-8">
          <span className="w-2 h-2 bg-[#3FB950] rounded-full animate-pulse"></span>
          Desarrollado por WalterDP para Lic. DarianaDLRM
        </div>
        <h1 className="text-5xl font-bold text-[#E6EDF3] mb-6 leading-tight">
          Peritaje Digital<br />
          <span className="text-[#58A6FF]">Profesional</span>
        </h1>
        <p className="text-xl text-[#8B949E] mb-10 max-w-2xl mx-auto">
          Sistema forense con IA para análisis de archivos, conexiones de red,
          memoria y recuperación de archivos eliminados.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/activate" className="bg-[#58A6FF] hover:bg-[#79c0ff] text-[#0D1117] font-bold px-8 py-3 rounded-lg transition-colors text-lg">
            Activar mi Licencia
          </Link>
          <Link href="/terms" className="border border-[#30363D] hover:border-[#58A6FF] text-[#8B949E] hover:text-[#E6EDF3] px-8 py-3 rounded-lg transition-colors text-lg">
            Ver Términos
          </Link>
        </div>
      </div>

      {/* PLANES */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-[#E6EDF3] mb-12">Planes de Licencia</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { tipo: 'Mensual', precio: '$299', periodo: '/mes', desc: 'Ideal para análisis puntuales', color: 'border-[#30363D]', badge: null },
            { tipo: 'Anual',   precio: '$2,499', periodo: '/año', desc: 'Ahorra 30% vs mensual', color: 'border-[#58A6FF]', badge: 'Popular' },
            { tipo: 'Lifetime', precio: '$5,999', periodo: ' pago único', desc: 'Acceso de por vida', color: 'border-[#3FB950]', badge: 'Mejor valor' },
          ].map(p => (
            <div key={p.tipo} className={`bg-[#161B22] border-2 ${p.color} rounded-xl p-8 relative`}>
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#58A6FF] text-[#0D1117] text-xs font-bold px-3 py-1 rounded-full">
                  {p.badge}
                </span>
              )}
              <h3 className="text-xl font-bold text-[#E6EDF3] mb-2">{p.tipo}</h3>
              <div className="text-3xl font-bold text-[#58A6FF] mb-1">
                {p.precio}<span className="text-sm text-[#8B949E]">{p.periodo}</span>
              </div>
              <p className="text-[#8B949E] text-sm mb-6">{p.desc}</p>
              <ul className="space-y-2 text-sm text-[#8B949E] mb-6">
                {['Análisis forense completo','IA con Groq Llama3','Reporte Excel profesional',
                  'Recuperación de archivos','Soporte técnico'].map(f => (
                  <li key={f} className="flex gap-2"><span className="text-[#3FB950]">✓</span>{f}</li>
                ))}
              </ul>
              <button className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-2.5 rounded-lg font-medium transition-colors">
                Contactar para comprar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CARACTERÍSTICAS */}
      <div className="max-w-6xl mx-auto px-6 py-16 border-t border-[#30363D]">
        <h2 className="text-3xl font-bold text-center text-[#E6EDF3] mb-12">¿Qué incluye?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon:'🔍', title:'Análisis de Archivos', desc:'Escanea los últimos archivos accedidos con análisis heurístico avanzado' },
            { icon:'🌐', title:'Monitor de Red', desc:'Detecta conexiones sospechosas, IPs externas y puertos de C&C' },
            { icon:'🧠', title:'Memoria & Procesos', desc:'Examina procesos activos, DLLs cargadas y archivos en RAM' },
            { icon:'🤖', title:'IA con Groq Llama3', desc:'Análisis contextual de cada elemento con explicación técnica detallada' },
            { icon:'📊', title:'Reporte Excel', desc:'Exporta un informe profesional con 5 hojas y código de colores por riesgo' },
            { icon:'🔄', title:'Recuperación de Archivos', desc:'Recupera archivos de la papelera y detecta borrados permanentes vía MFT' },
          ].map(f => (
            <div key={f.title} className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 hover:border-[#58A6FF] transition-colors">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-[#E6EDF3] mb-2">{f.title}</h3>
              <p className="text-[#8B949E] text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-[#30363D] bg-[#161B22] py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#8B949E] text-sm">
            © 2026 Peritaje Digital Pro · Desarrollado por <strong className="text-[#58A6FF]">WalterDP</strong> para <strong className="text-[#58A6FF]">Lic. DarianaDLRM</strong>
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/terms"    className="text-[#8B949E] hover:text-[#E6EDF3]">Términos y Condiciones</Link>
            <Link href="/activate" className="text-[#8B949E] hover:text-[#E6EDF3]">Activar Licencia</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
