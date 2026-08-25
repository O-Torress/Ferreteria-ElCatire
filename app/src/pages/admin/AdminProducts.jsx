import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useProducts } from '../../context/ProductsContext'
import { CATEGORIES, categoryLabel } from '../../lib/utils'
import Pagination from '../../components/Pagination'
import CategoriesDrawer from '../../components/CategoriesDrawer'

const EMPTY = { nombre: '', codigo: '', categoria: 'herramientas', precio_usd: '', imagen_url: '', marca: '', descripcion: '', stock: '' }
const PER_PAGE = 10

const inputCls = 'w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-disabled outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20'

export default function AdminProducts() {
  const { products, reload } = useProducts()

  useEffect(() => {
    document.title = 'Admin: Productos – Ferretería El Catire'
  }, [])

  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [page, setPage] = useState(1)
  const [cat, setCat] = useState('all')
  const [catsOpen, setCatsOpen] = useState(false)

  const counts = {}
  products.forEach((p) => { counts[p.categoria] = (counts[p.categoria] || 0) + 1 })
  const filtered = cat === 'all' ? products : products.filter((p) => p.categoria === cat)

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const safePage = Math.min(page, totalPages || 1)
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  function pickCat(id) {
    setCat(id)
    setPage(1)
  }

  const isNew = editing === 'new'

  function startNew() {
    setEditing('new')
    setForm(EMPTY)
    setErr('')
    setMsg('')
  }

  function startEdit(p) {
    setEditing(p.id)
    setForm({
      nombre: p.nombre,
      codigo: String(p.sku),
      categoria: p.categoria,
      precio_usd: String(p.precio_usd),
      imagen_url: p.imagen_url || '',
      marca: p.marca || '',
      descripcion: p.descripcion || '',
      stock: String(p.stock ?? 0)
    })
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
    const codigo = Number(form.codigo)
    if (!form.nombre || !Number.isInteger(codigo) || codigo <= 0 || !isFinite(precio) || precio < 0) {
      setErr('Completa nombre, un código numérico válido y un precio válido.')
      return
    }
    const imgTrimmed = form.imagen_url.trim()
    if (imgTrimmed && !imgTrimmed.startsWith('https://')) {
      setErr('La URL de la imagen debe comenzar con https://')
      return
    }
    const payload = {
      nombre: form.nombre.trim(),
      codigo,
      categoria: form.categoria,
      precio_detal: precio,
      img_url: imgTrimmed || null,
      marca: form.marca.trim() || null,
      descripcion: form.descripcion.trim() || null,
      stock: Math.max(0, Math.round(Number(form.stock) || 0))
    }
    setSaving(true)
    let error = null
    if (isNew) {
      const res = await supabase.from('Productos').insert(payload).maybeSingle()
      error = res.error
    } else {
      const res = await supabase.from('Productos').update(payload).eq('codigo', editing).maybeSingle()
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
    const { error } = await supabase.from('Productos').update({ deleted: p.activo }).eq('codigo', p.id)
    if (!error) reload()
  }

  async function remove(p) {
    if (!confirm('¿Eliminar el producto "' + p.nombre + '" del catálogo? Se ocultará de la tienda y podrás publicarlo de nuevo desde aquí.')) return
    const { error } = await supabase.from('Productos').update({ deleted: true }).eq('codigo', p.id)
    if (!error) {
      setMsg('Producto eliminado del catálogo.')
      reload()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
        <div>
          <h1 className="font-display font-bold text-[22px] text-ink tracking-[-0.01em]">Productos</h1>
          <p className="text-muted text-sm mt-0.5">{filtered.length} de {products.length} productos</p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-1.5 bg-brand hover:bg-brandhover text-white font-semibold text-sm tracking-[0.02em] px-4 py-2.5 rounded-lg min-h-[42px] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          Nuevo producto
        </button>
      </div>

      <div className="mb-5">
        <button
          onClick={() => setCatsOpen(true)}
          className="group inline-flex items-center gap-2 text-sm font-semibold tracking-[0.02em] text-ink hover:text-brand transition-colors min-h-[42px]"
          aria-haspopup="dialog"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          Ver categorías
          {cat !== 'all' && <span className="text-brand">· {categoryLabel(cat)}</span>}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5"><path d="m9 18 6-6-6-6"/></svg>
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
            <label className="text-sm font-semibold text-ink">Código</label>
            <input type="number" min="1" step="1" value={form.codigo} onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value }))} placeholder="Ej. 101" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink">Categoría</label>
            <select value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink">Marca</label>
            <input value={form.marca} onChange={(e) => setForm((f) => ({ ...f, marca: e.target.value }))} placeholder="Ej. Stanley" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink">Precio (US$)</label>
            <input type="number" step="0.01" min="0" value={form.precio_usd} onChange={(e) => setForm((f) => ({ ...f, precio_usd: e.target.value }))} placeholder="0.00" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink">Stock</label>
            <input type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} placeholder="Ej. 10" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-semibold text-ink">Descripción</label>
            <textarea rows="3" value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} placeholder="Describe el producto: medidas, materiales, uso recomendado…" className={inputCls + ' resize-y'}></textarea>
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

      <div className="bg-white border border-line rounded-lg overflow-x-auto">
        {products.length === 0 ? (
          <div className="text-sm text-muted text-center py-12">
            Aún no hay productos. Crea el primero con el botón «Nuevo producto».
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[12.5px] uppercase tracking-[0.06em] text-muted">
                <th className="px-4 py-3 font-semibold">Código</th>
                <th className="px-4 py-3 font-semibold">Producto</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Categoría</th>
                <th className="px-4 py-3 font-semibold">Precio</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Estado</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-muted whitespace-nowrap">{p.sku}</td>
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
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">{categoryLabel(p.categoria)}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{'$ ' + Number(p.precio_usd).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={'text-xs font-semibold px-2.5 py-1 rounded-full ' + (p.activo ? 'bg-action/10 text-action border border-action/30' : 'bg-disabled/20 text-muted border border-line')}>
                      {p.activo ? 'Activo' : 'Oculto'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {!p.activo && (
                        <button onClick={() => toggleActive(p)} className="text-xs font-medium text-action hover:bg-canvas px-2 py-1.5 rounded-md transition-colors">
                          Publicar
                        </button>
                      )}
                      <button onClick={() => startEdit(p)} className="text-xs font-medium text-muted hover:text-ink px-2 py-1.5 rounded-md hover:bg-canvas transition-colors">Editar</button>
                      {p.activo && (
                        <button onClick={() => remove(p)} className="text-xs font-medium text-[#b91c1c] hover:bg-[#fdeeee] px-2 py-1.5 rounded-md transition-colors">Eliminar</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={safePage} total={totalPages} onChange={setPage} />
      <CategoriesDrawer open={catsOpen} onClose={() => setCatsOpen(false)} active={cat} onSelect={pickCat} showAll />
    </div>
  )
}
