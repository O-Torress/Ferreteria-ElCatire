import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useProducts } from '../../context/ProductsContext'
import { CATEGORIES, categoryLabel, normalizeText } from '../../lib/utils'
import Pagination from '../../components/Pagination'
import CategoriesDrawer from '../../components/CategoriesDrawer'

const PER_PAGE = 10

export default function AdminStock() {
  const { products, reload } = useProducts()

  useEffect(() => {
    document.title = 'Admin: Stock – Ferretería El Catire'
  }, [])

  const [drafts, setDrafts] = useState({})
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [page, setPage] = useState(1)
  const [cat, setCat] = useState('all')
  const [search, setSearch] = useState('')
  const [catsOpen, setCatsOpen] = useState(false)

  const counts = {}
  products.forEach((p) => { counts[p.categoria] = (counts[p.categoria] || 0) + 1 })
  const nq = normalizeText(search)
  const byCat = cat === 'all' ? products : products.filter((p) => p.categoria === cat)
  const filtered = nq
    ? byCat.filter((p) => normalizeText(p.nombre).includes(nq) || String(p.sku).includes(nq))
    : byCat

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const safePage = Math.min(page, totalPages || 1)
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  function pickCat(id) {
    setCat(id)
    setPage(1)
  }

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
          className="bg-action hover:bg-actionhover text-white font-semibold text-sm tracking-[0.02em] px-4 py-2.5 rounded-lg min-h-[42px] transition-colors cursor-pointer disabled:bg-disabled disabled:cursor-not-allowed"
        >
          {Object.keys(drafts).length > 0 ? 'Guardar cambios (' + Object.keys(drafts).length + ')' : 'Guardar cambios'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
        <button
          onClick={() => setCatsOpen(true)}
          className="group inline-flex items-center gap-2 text-sm font-semibold tracking-[0.02em] text-ink hover:text-brand transition-colors min-h-[42px] cursor-pointer flex-none"
          aria-haspopup="dialog"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          Ver categorías
          {cat !== 'all' && <span className="text-brand">· {categoryLabel(cat)}</span>}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        <div className="relative w-full lg:max-w-md lg:ml-auto">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-disabled pointer-events-none"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Buscar por nombre o código…"
            className="w-full rounded-lg border border-line bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-disabled outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </div>

      {msg && <p className="text-sm text-action font-medium mb-4">{msg}</p>}
      {err && <p className="text-sm text-[#b91c1c] font-medium mb-4">{err}</p>}

      <div className="bg-white border border-line rounded-lg overflow-x-auto mb-6">
        {products.length === 0 ? (
          <div className="text-sm text-muted text-center py-12">
            Aún no hay productos para gestionar stock.
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-muted text-center py-12">
            No se encontraron productos{search ? ' con «' + search + '»' : ''}.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[12.5px] uppercase tracking-[0.06em] text-muted">
                <th className="px-4 py-3 font-semibold">Código</th>
                <th className="px-4 py-3 font-semibold min-w-[220px]">Producto</th>
                <th className="px-4 py-3 font-semibold text-center min-w-[160px]">Stock disponible</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-muted whitespace-nowrap">{p.sku}</td>
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

      <Pagination page={safePage} total={totalPages} onChange={setPage} />
      <CategoriesDrawer open={catsOpen} onClose={() => setCatsOpen(false)} active={cat} onSelect={pickCat} showAll />
    </div>
  )
}
