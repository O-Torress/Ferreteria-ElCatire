const RATE_URL = 'https://ve.dolarapi.com/v1/dolares/oficial'
const CACHE_KEY = 'fec_rate'
const TIMEOUT_MS = 6000

function readCachedRate() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { rate, ts } = JSON.parse(raw)
    if (!isFinite(rate) || rate <= 0) return null
    if (Date.now() - ts > 1000 * 60 * 60) return null
    return rate
  } catch {
    return null
  }
}

function cacheRate(rate) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, ts: Date.now() }))
  } catch {}
}

export async function fetchRate() {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(RATE_URL, { signal: controller.signal })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = await res.json()

    let rate = null
    if (Array.isArray(data) && data.length) {
      rate = data[0].promedio || data[0].venta || data[0].compra
    } else if (data && typeof data === 'object') {
      rate = data.promedio || data.venta || data.compra || data.ask || data.bid || data.valor || data.price
    }
    const n = Number(rate)
    if (!isFinite(n) || n <= 0) throw new Error('Tasa no encontrada en la respuesta')
    cacheRate(n)
    return n
  } catch {
    const cached = readCachedRate()
    if (cached != null) return cached
    throw new Error('No se pudo obtener la tasa')
  } finally {
    clearTimeout(timer)
  }
}
