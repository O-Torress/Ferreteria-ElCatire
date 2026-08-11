import { useProducts } from '../context/ProductsContext'
import { useCart } from '../context/CartContext'
import { useSede } from '../context/SedeContext'
import { fmtUSD, fmtBs, WHATSAPP_NUMBER } from '../lib/utils'

export default function CartDrawer({ open, onClose }) {
  const { byId, sedes } = useProducts()
  const { items, rate, totalUsd, count, add, dec, remove, clear } = useCart()
  const { sede } = useSede()

  const sedeName = (sedes.find((s) => s.id === sede) || {}).nombre || sede
  const ids = Object.keys(items).filter((id) => byId[id])

  const waText = [
    'Hola Ferretería El Catire, quiero confirmar mi pedido para ' + sedeName + ':',
    ...ids.map((id) => {
      const p = byId[id]
      const q = items[id]
      return '• ' + q + ' x ' + p.nombre + ' — ' + fmtUSD(p.precio_usd * q) + ' (' + fmtBs(p.precio_usd * rate * q) + ')'
    }),
    '',
    'Total: ' + fmtUSD(totalUsd) + ' (' + fmtBs(totalUsd * rate) + ')'
  ].join('\n')
  const waHref = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(waText)

  return (
    <>
      <div
        className={'fixed inset-0 bg-ink/45 transition-opacity duration-200 z-[80] ' + (open ? 'opacity-100' : 'opacity-0 pointer-events-none')}
        onClick={onClose}
      ></div>
      <aside
        className={'fixed top-0 right-0 bottom-0 w-full max-w-[420px] bg-white z-[90] flex flex-col shadow-[-8px_0_26px_rgba(26,37,54,0.2)] transition-transform duration-300 ease-out ' + (open ? 'translate-x-0' : 'translate-x-full')}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        <header className="flex items-center gap-2 px-5 py-3.5 border-b border-line">
          <h2 className="font-display text-[19px] font-semibold tracking-[-0.01em]">Tu pedido</h2>
          <span className="text-xs text-brand font-semibold bg-brand/10 border border-brand/35 rounded-full px-2.5 py-0.5">{sedeName}</span>
          <button onClick={onClose} className="w-10 h-10 ml-auto rounded-lg text-muted hover:bg-canvas hover:text-ink grid place-items-center transition-colors" aria-label="Cerrar carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </header>

        {ids.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2.5 p-8 text-center text-muted text-sm">
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-disabled"><circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2 3h2.2l2 12.2a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.3L20.5 8H5.2"/></svg>
            <strong className="font-display text-ink font-semibold text-[17px]">Tu carrito está vacío</strong>
            <span>Añade productos desde el catálogo para armar tu pedido.</span>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-3.5 flex flex-col gap-3.5">
              {ids.map((id) => {
                const p = byId[id]
                const q = items[id]
                return (
                  <div key={id} className="flex gap-3 items-center">
                    <div className="w-[58px] h-[58px] rounded-lg overflow-hidden border border-line bg-media flex-none">
                      {p.imagen_url ? (
                        <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-disabled">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.5-3.5L6 21"/></svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-snug">{p.nombre}</p>
                      <p className="text-[12.5px] text-muted mt-0.5 mb-1.5">{fmtUSD(p.precio_usd)} · {fmtBs(p.precio_usd * rate)}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-line rounded-lg overflow-hidden">
                          <button onClick={() => dec(id)} className="w-7 h-8 grid place-items-center text-ink font-semibold hover:bg-canvas transition-colors" aria-label="Reducir cantidad">−</button>
                          <span className="min-w-[32px] text-center text-sm font-semibold">{q}</span>
                          <button onClick={() => add(id)} className="w-7 h-8 grid place-items-center text-ink font-semibold hover:bg-canvas transition-colors" aria-label="Aumentar cantidad">+</button>
                        </div>
                        <span className="font-display font-semibold text-sm tracking-[-0.01em]">{fmtUSD(p.precio_usd * q)}</span>
                      </div>
                    </div>
                    <button onClick={() => remove(id)} className="text-muted w-[30px] h-[30px] rounded-md grid place-items-center flex-none hover:text-action hover:bg-[#fdeeee] transition-colors" aria-label="Quitar del carrito">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                    </button>
                  </div>
                )
              })}
              <button onClick={clear} className="self-end text-xs text-muted hover:text-action transition-colors">Vaciar carrito</button>
            </div>

            <footer className="border-t border-line px-5 pt-3.5 pb-5 flex flex-col gap-3">
              <div className="grid gap-1.5">
                <div className="flex justify-between items-baseline text-sm"><span className="text-muted">Subtotal (US$)</span><b className="font-display text-[17px] font-bold tracking-[-0.01em]">{fmtUSD(totalUsd)}</b></div>
                <div className="flex justify-between items-baseline text-sm"><span className="text-muted">Subtotal (Bs)</span><b className="font-display text-[17px] font-bold tracking-[-0.01em]">{fmtBs(totalUsd * rate)}</b></div>
                <div className="flex justify-between items-baseline text-sm border-t border-dashed border-line pt-2 mt-0.5"><span className="text-muted">Artículos</span><b className="font-display text-[19px] font-bold tracking-[-0.01em]">{count}</b></div>
              </div>
              <a className="flex items-center justify-center gap-2 bg-action hover:bg-actionhover text-white font-semibold text-[15px] tracking-[0.02em] py-3.5 px-4 rounded-lg min-h-[50px] transition-colors" href={waHref} target="_blank" rel="noopener">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1.1L3 20l1.1-5.3A8.4 8.4 0 1 1 21 11.5Z"/><path d="M9 9.5c.3 2 1.5 3.2 3.5 3.5.6.1 1.2-.4 1.2-1 0-.4-.2-.7-.5-.9"/></svg>
                Confirmar pedido por WhatsApp
              </a>
              <p className="text-xs text-muted text-center">Pedido para {sedeName} · El enlace abre WhatsApp con el resumen.</p>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}
