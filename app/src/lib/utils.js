export const CATEGORIES = [
  { id: 'herramientas', label: 'Herramientas' },
  { id: 'pinturas', label: 'Pinturas y acabados' },
  { id: 'electricidad', label: 'Electricidad' },
  { id: 'plomeria', label: 'Plomería' },
  { id: 'construccion', label: 'Construcción' },
  { id: 'cerrajeria', label: 'Cerrajería' },
  { id: 'iluminacion', label: 'Iluminación' },
  { id: 'electrodomesticos', label: 'Electrodomésticos' }
]

export const WHATSAPP_NUMBER = '584242626309'
export const DEFAULT_RATE = 36.5

export function normalizeText(s) {
  return String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

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
