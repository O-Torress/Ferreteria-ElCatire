import { CATEGORIES } from '../lib/utils'

const BASE = 'py-2 px-4 rounded-full border text-sm tracking-[0.02em] min-h-[42px] transition-colors flex items-center gap-1.5'

export default function CategoryFilters({ active, onChange }) {
  const items = [{ id: 'all', label: 'Todos' }, ...CATEGORIES]
  return (
    <nav className="flex flex-wrap gap-2.5 mt-5 mb-5" aria-label="Filtrar por categoría">
      {items.map((c) => {
        const on = active === c.id
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={
              on
                ? BASE + ' border-brand bg-brand text-white font-semibold shadow-[0_2px_8px_rgba(238,102,16,0.35)]'
                : BASE + ' border-line bg-white text-ink font-medium hover:border-brand hover:text-brand'
            }
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current"></span>
            {c.label}
          </button>
        )
      })}
    </nav>
  )
}
