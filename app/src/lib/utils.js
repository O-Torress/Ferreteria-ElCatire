export const CATEGORIES = [
  { id: 'herramientas', label: 'Herramientas' },
  { id: 'pinturas', label: 'Pinturas' },
  { id: 'electricidad', label: 'Electricidad' },
  { id: 'plomeria', label: 'Plomería' }
]

export const WHATSAPP_NUMBER = '584126912280'
export const DEFAULT_RATE = 36.5

export function fmtUSD(n) {
  const v = Number(n) || 0
  return '$ ' + v.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtBs(n) {
  const v = Number(n) || 0
  return 'Bs ' + v.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function categoryLabel(id) {
  const c = CATEGORIES.find((x) => x.id === id)
  return c ? c.label : id
}
