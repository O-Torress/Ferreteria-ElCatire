import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useProducts } from '../../context/ProductsContext'

const inputCls = 'w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-disabled outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20'

export default function AdminStock() {
  const { products, stock, sedes, reload } = useProducts()
  const [drafts, setDrafts] = useState({})
  const [newSede, setNewSede] = useState({ nombre: '', direccion: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const stockMap = {}
  stock.forEach((s) => {
    stockMap[s.producto_id + '|' + s.sede_id] = s
  })

  function valueFor(productId, sedeId) {
    const key = productId + '|' + sedeId
    return drafts[key] !== undefined ? drafts[key] : (stockMap[key]?.cantidad ?? 0)
  }

  async function saveAll() {
    setErr('')
    setMsg('')
    const ops = Object.keys(drafts).map(async (key) => {
      const [producto_id, sede_id] = key.split('|')
      const cantidad = Math.max(0, Math.round(Number(drafts[key]) || 0))
      const existing = stockMap[key]
      if (existing) {
        return supabase.from('stock').update({ cantidad }).eq('id', existing.id)
      }
      return supabase.from('stock').insert({ producto_id, sede_id, cantidad })
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

  async function addSede(e) {
    e.preventDefault()
    setErr('')
    setMsg('')
    if (!newSede.nombre.trim()) {
      setErr('Ingresa el nombre de la sede.')
      return
    }
    const { error } = await supabase.from('sedes').insert({ nombre: newSede.nombre.trim(), direccion: newSede.direccion.trim() || null })
    if (error) {
      setErr(error.message)
      return
    }
    setNewSede({ nombre: '', direccion: '' })
    setMsg('Sede agregada.')
    reload()
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
        <div>
          <h1 className="font-display font-bold text-[22px] text-ink tracking-[-0.01em]">Stock y sedes</h1>
          <p className="text-muted text-sm mt-0.5">Cantidad disponible de cada producto por sede.</p>
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
        {sedes.length === 0 || products.length === 0 ? (
          <div className="text-sm text-muted text-center py-12">
            Crea primero sedes y productos para gestionar stock.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[12.5px] uppercase tracking-[0.06em] text-muted">
                <th className="px-4 py-3 font-semibold min-w-[220px]">Producto</th>
                {sedes.map((s) => (
                  <th key={s.id} className="px-4 py-3 font-semibold text-center min-w-[120px]">{s.nombre}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink leading-snug">{p.nombre}</p>
                    <p className="text-[12px] text-muted">Ref. {p.sku}</p>
                  </td>
                  {sedes.map((s) => (
                    <td key={s.id} className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={valueFor(p.id, s.id)}
                        onChange={(e) => setDrafts((d) => ({ ...d, [p.id + '|' + s.id]: e.target.value }))}
                        className="w-full text-center rounded-lg border border-line bg-white px-2 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <form onSubmit={addSede} className="bg-white border border-line rounded-lg p-5 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-ink">Nueva sede</label>
          <input value={newSede.nombre} onChange={(e) => setNewSede((f) => ({ ...f, nombre: e.target.value }))} placeholder="Ej. Sede Centro" className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-ink">Dirección (opcional)</label>
          <input value={newSede.direccion} onChange={(e) => setNewSede((f) => ({ ...f, direccion: e.target.value }))} placeholder="Ej. Av. Principal, Maracaibo" className={inputCls} />
        </div>
        <button type="submit" className="bg-brand hover:bg-brandhover text-white font-semibold text-sm tracking-[0.02em] px-4 py-2.5 rounded-lg min-h-[42px] transition-colors">
          Agregar sede
        </button>
      </form>
    </div>
  )
}
