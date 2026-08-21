import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useProducts } from '../../context/ProductsContext'

export default function AdminStock() {
  const { products, reload } = useProducts()
  const [drafts, setDrafts] = useState({})
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  function valueFor(id) {
    const p = products.find((x) => x.id === id)
    return drafts[id] !== undefined ? drafts[id] : (p?.stock ?? 0)
  }

  async function saveAll() {
    setErr('')
    setMsg('')
    const ops = Object.keys(drafts).map(async (id) => {
      const cantidad = Math.max(0, Math.round(Number(drafts[id]) || 0))
      return supabase.from('Productos').update({ stock: cantidad }).eq('codigo', Number(id))
    })
    const results = await Promise.all(ops)
    const errores = results.filter((r) => r.error)
    if (errores.length) {
      setErr('No se pudo guardar todo: ' + errores[0].error.message)
      return
    }
    setDrafts({})
    setMsg('Stock guardado correctamente.')
    reload()
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
        <div>
          <h1 className="font-display font-bold text-[22px] text-ink tracking-[-0.01em]">Stock</h1>
          <p className="text-muted text-sm mt-0.5">Cantidad disponible de cada producto.</p>
        </div>
        <button
          onClick={saveAll}
          disabled={Object.keys(drafts).length === 0}
          className="bg-action hover:bg-actionhover text-white font-semibold text-sm tracking-[0.02em] px-4 py-2.5 rounded-lg min-h-[42px] transition-colors disabled:bg-disabled disabled:cursor-not-allowed"
        >
          {Object.keys(drafts).length > 0 ? 'Guardar cambios (' + Object.keys(drafts).length + ')' : 'Guardar cambios'}
        </button>
      </div>

      {msg && <p className="text-sm text-action font-medium mb-4">{msg}</p>}
      {err && <p className="text-sm text-[#b91c1c] font-medium mb-4">{err}</p>}

      <div className="bg-white border border-line rounded-lg overflow-x-auto mb-6">
        {products.length === 0 ? (
          <div className="text-sm text-muted text-center py-12">
            Aún no hay productos para gestionar stock.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[12.5px] uppercase tracking-[0.06em] text-muted">
                <th className="px-4 py-3 font-semibold min-w-[220px]">Producto</th>
                <th className="px-4 py-3 font-semibold text-center min-w-[160px]">Stock disponible</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink leading-snug">{p.nombre}</p>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={valueFor(p.id)}
                      onChange={(e) => setDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                      className="w-full text-center rounded-lg border border-line bg-white px-2 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
