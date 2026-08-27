function getPages(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const items = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(total - 1, page + 1)
  if (start > 2) items.push('...')
  for (let i = start; i <= end; i++) items.push(i)
  if (end < total - 1) items.push('...')
  items.push(total)
  return items
}

const BASE = 'min-w-[42px] h-[42px] px-3 rounded-full border text-sm font-medium tracking-[0.02em] flex items-center justify-center transition-colors cursor-pointer'

export default function Pagination({ page, total, onChange }) {
  if (!total || total <= 1) return null

  function go(p) {
    if (p >= 1 && p <= total && p !== page) onChange(p)
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-9 flex-wrap" aria-label="Paginación del catálogo">
      <button
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
        className={BASE + ' border-line bg-white text-ink hover:border-brand hover:text-brand disabled:opacity-40 disabled:pointer-events-none'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      {getPages(page, total).map((p, i) =>
        p === '...' ? (
          <span key={'e' + i} className="w-[20px] text-center text-muted select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => go(p)}
            aria-current={p === page ? 'page' : undefined}
            className={
              p === page
                ? BASE + ' border-brand bg-brand text-white font-semibold shadow-[0_2px_8px_rgba(238,102,16,0.35)]'
                : BASE + ' border-line bg-white text-ink hover:border-brand hover:text-brand'
            }
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => go(page + 1)}
        disabled={page >= total}
        aria-label="Página siguiente"
        className={BASE + ' border-line bg-white text-ink hover:border-brand hover:text-brand disabled:opacity-40 disabled:pointer-events-none'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </nav>
  )
}
