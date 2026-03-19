import crypto from 'crypto'

const OFFLINE_SECRET = process.env.OFFLINE_SECRET || 'peritaje_digital_secret_2026'

// Genera una license key tipo: PD-XXXX-XXXX-XXXX-XXXX
export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const segment = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `PD-${segment(4)}-${segment(4)}-${segment(4)}-${segment(4)}`
}

// Genera el código offline para un mes determinado
// El código es válido solo para ese mes + hwid + license_key
export function generateOfflineCode(licenseKey: string, hwid: string, monthYear: string): string {
  const data = `${licenseKey}:${hwid}:${monthYear}:${OFFLINE_SECRET}`
  const hash = crypto.createHmac('sha256', OFFLINE_SECRET).update(data).digest('hex')
  // Formato legible: XXXX-XXXX-XXXX (primeros 12 chars en grupos de 4)
  const code = hash.slice(0, 12).toUpperCase()
  return `${code.slice(0,4)}-${code.slice(4,8)}-${code.slice(8,12)}`
}

// Verifica si un código offline es válido
export function verifyOfflineCode(
  licenseKey: string,
  hwid: string,
  monthYear: string,
  code: string
): boolean {
  const expected = generateOfflineCode(licenseKey, hwid, monthYear)
  return expected === code.toUpperCase()
}

// Calcula fecha de expiración según tipo
export function calcExpiration(type: 'monthly' | 'yearly' | 'lifetime'): Date | null {
  const now = new Date()
  if (type === 'monthly') { now.setMonth(now.getMonth() + 1); return now }
  if (type === 'yearly')  { now.setFullYear(now.getFullYear() + 1); return now }
  return null // lifetime = no expira
}

// Retorna el mes-año actual en formato YYYY-MM
export function currentMonthYear(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
}
