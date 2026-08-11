import { useState } from 'react'
import { useProducts } from '../context/ProductsContext'

export default function SedeSelect({ value, onChange }) {
  const { sedes } = useProducts()
  const [open, setOpen] = useState(false)

  const list = sedes.length ? sedes : [{ id: 'Sede Norte', nombre: 'Sede Norte' }, { id: 'Sede Sur', nombre: 'Sede Sur' }]
  const current = list.find((s) => s.id === value) || list[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 bg-white/15 border border-white/40 rounded-lg pl-2 pr-8 text-white py-2.5 cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        <span className="text-sm font-medium">{current?.nombre}</span>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </span>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 bg-white border border-line rounded-lg shadow-[0_10px_26px_rgba(26,37,54,0.2)] p-1.5 z-[70]" role="listbox">
          {list.map((s) => (
            <button
              key={s.id}
              role="option"
              aria-selected={s.id === value}
              onClick={() => { onChange(s.id); setOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-ink hover:bg-canvas transition-colors"
            >
              {s.nombre}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
