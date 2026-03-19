import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      <nav className="bg-[#161B22] border-b border-[#30363D] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#3FB950] rounded-md flex items-center justify-center text-xs font-bold text-black">PD</div>
          <span className="font-bold text-[#E6EDF3] text-sm">Peritaje Digital Pro</span>
        </Link>
        <Link href="/" className="text-[#8B949E] hover:text-[#E6EDF3] text-sm">← Inicio</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-[#E6EDF3] mb-2">Términos y Condiciones</h1>
        <p className="text-[#8B949E] mb-10">Última actualización: 17 de marzo de 2026</p>

        {[
          {
            n:'1', t:'Definiciones',
            c:`"Peritaje Digital Pro" (en adelante "el Software") es una herramienta de análisis forense digital desarrollada por WalterDP para Lic. DarianaDLRM. "Licencia" significa el derecho de uso otorgado al adquiriente. "Usuario" significa la persona natural o jurídica que adquiere y utiliza el Software.`
          },
          {
            n:'2', t:'Licencia de Uso',
            c:`El Software se otorga bajo licencia, no se vende. Al adquirir una licencia usted obtiene un derecho de uso personal, no transferible e intransferible, por el período contratado (mensual, anual o lifetime). Cada licencia permite la activación en un (1) dispositivo simultáneamente, salvo que se haya contratado un plan multi-dispositivo.`
          },
          {
            n:'3', t:'Restricciones',
            c:`Queda expresamente prohibido: (a) copiar, modificar, distribuir o sublicenciar el Software; (b) realizar ingeniería inversa, descompilación o desmontaje; (c) compartir, prestar, alquilar o transferir la licencia a terceros; (d) usar el Software para actividades ilegales o contrarias a la ética forense; (e) eliminar o alterar avisos de propiedad intelectual.`
          },
          {
            n:'4', t:'Activación y Hardware ID (HWID)',
            c:`El Software requiere activación en línea al primer uso. Se registrará el identificador único del hardware (HWID) del dispositivo. La licencia queda vinculada a dicho dispositivo. Si necesita cambiar de dispositivo, debe solicitar el reseteo de HWID al soporte. El uso offline está permitido durante períodos limitados mediante código temporal, el cual vence al final del mes calendario para el que fue generado.`
          },
          {
            n:'5', t:'Uso Offline',
            c:`El Software incluye un mecanismo de uso offline que permite operar sin conexión a internet. Durante el uso offline, un contador interno verifica el tiempo restante de licencia. Al expirar el período, el Software solicitará nueva autenticación. El usuario no debe manipular el reloj del sistema para extender artificialmente el período offline, lo que constituye una violación de estos términos.`
          },
          {
            n:'6', t:'Actualizaciones',
            c:`Las actualizaciones durante el período de licencia vigente están incluidas. El Software verificará automáticamente la disponibilidad de nuevas versiones. Algunas actualizaciones pueden ser obligatorias por razones de seguridad. La instalación de actualizaciones requiere licencia activa vigente.`
          },
          {
            n:'7', t:'Privacidad y Datos',
            c:`El Software recopila: email de registro, HWID del dispositivo, y timestamps de activación. No se almacena información de los análisis forenses realizados. Los datos se almacenan en Supabase con cifrado en tránsito (TLS) y en reposo. No se venden ni comparten datos a terceros. Para solicitar eliminación de datos contacte al soporte.`
          },
          {
            n:'8', t:'Garantía y Soporte',
            c:`El Software se proporciona "tal cual". Se ofrece soporte técnico por email durante el período de licencia vigente. No se garantiza que el Software sea compatible con todos los sistemas operativos o configuraciones de hardware. El licenciante no se hace responsable de resultados de análisis forenses ni de decisiones tomadas basándose en ellos.`
          },
          {
            n:'9', t:'Limitación de Responsabilidad',
            c:`En ningún caso el licenciante será responsable de daños indirectos, incidentales, especiales, consecuentes o punitivos. La responsabilidad máxima del licenciante se limita al monto pagado por la licencia en los últimos doce (12) meses.`
          },
          {
            n:'10', t:'Terminación',
            c:`Esta licencia se termina automáticamente al vencimiento del período contratado. El licenciante puede revocar la licencia por incumplimiento de estos términos sin reembolso. Al terminar la licencia, el usuario debe dejar de usar el Software.`
          },
          {
            n:'11', t:'Ley Aplicable',
            c:`Estos términos se rigen por las leyes de la República Mexicana. Cualquier disputa se resolverá en los tribunales competentes de Monterrey, Nuevo León, México.`
          },
          {
            n:'12', t:'Contacto',
            c:`Para soporte, preguntas sobre licencias o solicitudes de cancelación: contacte a través del canal oficial con WalterDP (desarrollador) o Lic. DarianaDLRM (titular). Respuesta en 24-48 horas hábiles.`
          },
        ].map(s => (
          <section key={s.n} className="mb-8">
            <h2 className="text-xl font-bold text-[#E6EDF3] mb-3 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#58A6FF]/20 text-[#58A6FF] rounded-lg flex items-center justify-center text-sm font-bold">{s.n}</span>
              {s.t}
            </h2>
            <p className="text-[#8B949E] leading-relaxed pl-11">{s.c}</p>
          </section>
        ))}

        <div className="mt-12 p-6 bg-[#161B22] border border-[#30363D] rounded-xl">
          <p className="text-[#8B949E] text-sm">
            Al usar el Software, usted acepta estar vinculado por estos Términos y Condiciones.
            Si no está de acuerdo con alguna parte, no use el Software.
          </p>
        </div>
      </div>

      <footer className="border-t border-[#30363D] bg-[#161B22] py-6 mt-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#8B949E] text-sm">
            © 2026 Peritaje Digital Pro · Desarrollado por <strong className="text-[#58A6FF]">WalterDP</strong> para <strong className="text-[#58A6FF]">Lic. DarianaDLRM</strong>
          </p>
        </div>
      </footer>
    </div>
  )
}
