import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Peritaje Digital Pro — Licencias',
  description: 'Sistema de gestión de licencias para Peritaje Digital Pro',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#0D1117] text-[#E6EDF3] min-h-screen">{children}</body>
    </html>
  )
}
