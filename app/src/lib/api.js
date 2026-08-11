const RATE_URL = 'https://ve.dolarapi.com/v1/dolares/oficial'

export async function fetchRate() {
  const res = await fetch(RATE_URL)
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
  return n
}
