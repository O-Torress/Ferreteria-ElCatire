import { CATEGORIES, categoryLabel } from '../lib/utils'
import { useProducts } from '../context/ProductsContext'

export default function CategoriesDrawer({ open, onClose, active, onSelect }) {
  const { products } = useProducts()
  const items = [{ id: 'all', label: 'Todas las categorías' }, ...CATEGORIES]

  const counts = {}
  products.forEach((p) => {
    if (!p.activo) return
    counts[p.categoria] = (counts[p.categoria] || 0) + 1
  })

  function pick(id) {
    onSelect(id)
    onClose()
  }

  return (
    <>
      <div
        className={'fixed inset-0 bg-ink/45 transition-opacity duration-200 z-[80] ' + (open ? 'opacity-100' : 'opacity-0 pointer-events-none')}
        onClick={onClose}
      ></div>
      <aside
        className={'fixed top-0 left-0 bottom-0 w-full max-w-[380px] bg-white z-[90] flex flex-col shadow-[8px_0_26px_rgba(26,37,54,0.2)] transition-transform duration-300 ease-out ' + (open ? 'translate-x-0' : '-translate-x-full')}
        role="dialog"
        aria-modal="true"
        aria-label="Categorías del catálogo"
      >
        <header className="flex items-center gap-2 px-5 py-3.5 border-b border-line">
          <h2 className="font-display text-[19px] font-semibold tracking-[-0.01em]">Categorías</h2>
          <button onClick={onClose} className="w-10 h-10 ml-auto rounded-lg text-muted hover:bg-canvas hover:text-ink grid place-items-center transition-colors" aria-label="Cerrar categorías">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </header>

        <nav className="flex-1 overflow-y-auto px-3.5 py-4 flex flex-col gap-1.5" aria-label="Lista de categorías">
          {items.map((c) => {
            const on = active === c.id
            const n = c.id === 'all' ? products.filter((p) => p.activo).length : (counts[c.id] || 0)
            return (
              <button
                key={c.id}
                onClick={() => pick(c.id)}
                className={
                  'flex items-center gap-3 px-4 py-3.5 rounded-lg text-left text-[15px] min-h-[50px] transition-colors ' +
                  (on
                    ? 'bg-brand text-white font-semibold shadow-[0_2px_8px_rgba(238,102,16,0.35)]'
                    : 'text-ink font-medium hover:bg-canvas hover:text-brand')
                }
                aria-current={on ? 'true' : undefined}
              >
                <span className={'inline-block w-2 h-2 rounded-full flex-none ' + (on ? 'bg-white' : 'bg-brand/60')}></span>
                <span className="flex-1">{c.id === 'all' ? c.label : categoryLabel(c.id)}</span>
                <span className={'text-xs font-semibold px-2 py-0.5 rounded-full ' + (on ? 'bg-white/20' : 'bg-canvas text-muted border border-line')}>
                  {n}
                </span>
              </button>
            )
          })}
        </nav>

        <footer className="border-t border-line px-5 py-3.5">
          <p className="text-xs text-muted">Filtra el catálogo por categoría.</p>
        </footer>
      </aside>
    </>
  )
}
