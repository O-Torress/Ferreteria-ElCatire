import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useProducts } from '../../context/ProductsContext'
import { categoryLabel } from '../../lib/utils'

const EMPTY = { nombre: '', sku: '', categoria: 'herramientas', precio_usd: '', imagen_url: '' }

const inputCls = 'w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-disabled outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20'

export default function AdminProducts() {
  const { products, reload } = useProducts()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const isNew = editing === 'new'

  function startNew() {
    setEditing('new')
    setForm(EMPTY)
    setErr('')
    setMsg('')
  }

  function startEdit(p) {
    setEditing(p.id)
    setForm({ nombre: p.nombre, sku: p.sku, categoria: p.categoria, precio_usd: String(p.precio_usd), imagen_url: p.imagen_url || '' })
    setErr('')
    setMsg('')
  }

  function cancel() {
    setEditing(null)
    setForm(EMPTY)
    setErr('')
    setMsg('')
  }

  async function save(e) {
    e.preventDefault()
    setErr('')
    setMsg('')
    const precio = Number(form.precio_usd)
    if (!form.nombre || !form.sku || !isFinite(precio) || precio < 0) {
      setErr('Completa nombre, referencia (SKU) y un precio válido.')
      return
    }
    const payload = {
      nombre: form.nombre.trim(),
      sku: form.sku.trim(),
      categoria: form.categoria,
      precio_usd: precio,
      imagen_url: form.imagen_url.trim() || null
    }
    setSaving(true)
    let error = null
    if (isNew) {
      const res = await supabase.from('productos').insert(payload).maybeSingle()
      error = res.error
    } else {
      const res = await supabase.from('productos').update(payload).eq('id', editing).maybeSingle()
      error = res.error
    }
    setSaving(false)
    if (error) {
      setErr(error.message)
      return
    }
    setMsg(isNew ? 'Producto creado.' : 'Producto actualizado.')
    setEditing(null)
    setForm(EMPTY)
    reload()
  }

  async function toggleActive(p) {
    const { error } = await supabase.from('productos').update({ activo: !p.activo }).eq('id', p.id)
    if (!error) reload()
  }

  async function remove(p) {
    if (!confirm('¿Eliminar el producto "' + p.nombre + '"? Esta acción no se puede deshacer.')) return
    const { error } = await supabase.from('productos').delete().eq('id', p.id)
    if (!error) {
      setMsg('Producto eliminado.')
      reload()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
        <div>
          <h1 className="font-display font-bold text-[22px] text-ink tracking-[-0.01em]">Productos</h1>
          <p className="text-muted text-sm mt-0.5">{products.length} productos en el catálogo</p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-1.5 bg-brand hover:bg-brandhover text-white font-semibold text-sm tracking-[0.02em] px-4 py-2.5 rounded-lg min-h-[42px] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          Nuevo producto
        </button>
      </div>

      {msg && <p className="text-sm text-action font-medium mb-4">{msg}</p>}
      {err && <p className="text-sm text-[#b91c1c] font-medium mb-4">{err}</p>}

      {editing !== null && (
        <form onSubmit={save} className="bg-white border border-line rounded-lg p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink">Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} placeholder="Ej. Martillo de uña 16 oz" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink">Referencia (SKU)</label>
            <input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} placeholder="Ej. FEC-HAM-016" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink">Categoría</label>
            <select value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))} className={inputCls}>
              <option value="herramientas">Herramientas</option>
              <option value="pinturas">Pinturas</option>
              <option value="electricidad">Electricidad</option>
              <option value="plomeria">Plomería</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink">Precio (US$)</label>
            <input type="number" step="0.01" min="0" value={form.precio_usd} onChange={(e) => setForm((f) => ({ ...f, precio_usd: e.target.value }))} placeholder="0.00" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-semibold text-ink">URL de la imagen</label>
            <input value={form.imagen_url} onChange={(e) => setForm((f) => ({ ...f, imagen_url: e.target.value }))} placeholder="https://… o URL pública de Supabase Storage" className={inputCls} />
          </div>
          <div className="flex items-center gap-2.5 sm:col-span-2">
            <button type="submit" disabled={saving} className="bg-action hover:bg-actionhover text-white font-semibold text-sm tracking-[0.02em] px-5 py-2.5 rounded-lg min-h-[42px] transition-colors disabled:opacity-60">
              {saving ? 'Guardando…' : isNew ? 'Crear producto' : 'Guardar cambios'}
            </button>
            <button type="button" onClick={cancel} className="text-sm font-medium text-muted hover:text-ink px-3 py-2.5 transition-colors">Cancelar</button>
          </div>
        </form>
      )}

      <div className="bg-white border border-line rounded-lg overflow-hidden">
        {products.length === 0 ? (
          <div className="text-sm text-muted text-center py-12">
            Aún no hay productos. Crea el primero con el botón «Nuevo producto».
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[12.5px] uppercase tracking-[0.06em] text-muted">
                <th className="px-4 py-3 font-semibold">Producto</th>
                <th className="px-4 py-3 font-semibold hidden sm:table-cell">Categoría</th>
                <th className="px-4 py-3 font-semibold">Precio</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Estado</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg overflow-hidden border border-line bg-media flex-none">
                        {p.imagen_url ? (
                          <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-disabled">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.5-3.5L6 21"/></svg>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-ink leading-snug">{p.nombre}</p>
                        <p className="text-[12px] text-muted">Ref. {p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-muted">{categoryLabel(p.categoria)}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{'$ ' + Number(p.precio_usd).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={'text-xs font-semibold px-2.5 py-1 rounded-full ' + (p.activo ? 'bg-action/10 text-action border border-action/30' : 'bg-disabled/20 text-muted border border-line')}>
                      {p.activo ? 'Activo' : 'Oculto'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => toggleActive(p)} className="text-xs font-medium text-muted hover:text-ink px-2 py-1.5 rounded-md hover:bg-canvas transition-colors">
                        {p.activo ? 'Ocultar' : 'Publicar'}
                      </button>
                      <button onClick={() => startEdit(p)} className="text-xs font-medium text-muted hover:text-ink px-2 py-1.5 rounded-md hover:bg-canvas transition-colors">Editar</button>
                      <button onClick={() => remove(p)} className="text-xs font-medium text-[#b91c1c] hover:bg-[#fdeeee] px-2 py-1.5 rounded-md transition-colors">Eliminar</button>
                    </div>
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
