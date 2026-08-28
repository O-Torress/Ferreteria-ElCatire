import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import LandingHeader from '../components/LandingHeader'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductsContext'
import { useCart } from '../context/CartContext'
import { CATEGORIES, categoryLabel } from '../lib/utils'

const HERO_DATA = [
  {
    img: '/img/slider/imgf.jpg',
    title: 'Tenemos todo lo que buscas',
  },
  {
    img: '/img/slider/imgf2.jpg',
    title: 'Calidad en la que puedes confiar',
  },
  {
    img: '/img/slider/imgf3.jpg',
    title: 'Precios competitivos',
  },
  {
    img: '/img/slider/imgf4.jpg',
    title: 'Amplio catálogo de productos',
  }
]

const CAT_ICONS = {
  herramientas: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
  ),
  pinturas: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 3H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/><path d="M12 11v6"/><path d="M8 17h8"/><circle cx="12" cy="20" r="1"/></svg>
  ),
  electricidad: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  plomeria: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8z"/><path d="M9 6v2"/><path d="M15 6v2"/><path d="M9 18h6"/></svg>
  ),
  construccion: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="22" height="12" rx="2"/><path d="M1 10h22"/><path d="M10 6v12"/><path d="M14 6v12"/></svg>
  ),
  cerrajeria: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
  ),
  iluminacion: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
  ),
  electrodomesticos: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
  )
}

export default function LandingPage() {
  const { products, loading } = useProducts()
  const { rate, add } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [heroIdx, setHeroIdx] = useState(0)
  const heroTimer = useRef(null)

  useEffect(() => {
    document.title = 'Ferretería El Catire · Maracaibo'
  }, [])

  useEffect(() => {
    heroTimer.current = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_DATA.length), 5000)
    return () => clearInterval(heroTimer.current)
  }, [])

  const featured = products.filter((p) => p.activo && Number(p.stock ?? 0) > 0).slice(0, 6)

  const hero = HERO_DATA[heroIdx]

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader onOpenCart={() => setCartOpen(true)} />

      <main className="flex-1">
        {/* Hero */}
        <section id="hero" className="relative h-[500px] sm:h-[560px] lg:h-[680px] overflow-hidden">
          {HERO_DATA.map((h, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-[1200ms]"
              style={{ opacity: i === heroIdx ? 1 : 0 }}
            >
              <img src={h.img} alt="" className="w-full h-full object-cover" style={{ imageRendering: 'auto' }} loading="eager" />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-inkdeep/90 via-inkdeep/50 to-inkdeep/20" />
          <div className="relative z-10 max-w-[1280px] mx-auto px-5 h-full flex flex-col justify-end pb-16">
            <h1 className="font-display font-bold text-[clamp(28px,5vw,44px)] text-white leading-[1.1] max-w-[750px]">
              {hero.title}
            </h1>
            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <Link
                to="/catalogo"
                className="inline-flex items-center justify-center bg-brand hover:bg-brandhover text-white font-semibold text-[15px] tracking-[0.02em] py-3.5 px-6 rounded-lg min-h-[50px] transition-colors shadow-[0_2px_12px_rgba(238,102,16,0.35)]"
              >
                Ver Catálogo Completo
              </Link>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {HERO_DATA.map((_, i) => (
              <button
                key={i}
                onClick={() => { setHeroIdx(i); clearInterval(heroTimer.current); heroTimer.current = setInterval(() => setHeroIdx((j) => (j + 1) % HERO_DATA.length), 5000) }}
                className={'h-2 rounded-full transition-all duration-300 ' + (i === heroIdx ? 'bg-white' : 'bg-white/40')}
                style={{ width: i === heroIdx ? '22px' : '8px' }}
                aria-label={'Ir a slide ' + (i + 1)}
              />
            ))}
          </div>
        </section>

        {/* Categorías */}
        <section className="max-w-[1280px] mx-auto px-5 py-12 lg:py-16">
          <h2 className="font-display font-bold text-[clamp(22px,3vw,28px)] text-ink tracking-[-0.01em] text-center">Categorías</h2>
          <p className="text-muted text-sm text-center mt-1 mb-8">Explora lo que tenemos para ti</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to={'/catalogo?cat=' + c.id}
                className="group flex flex-col items-center gap-3 bg-white border border-line rounded-lg p-5 hover:border-brand hover:shadow-[0_4px_16px_rgba(238,102,16,0.12)] transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-brand/10 text-brand grid place-items-center group-hover:bg-brand group-hover:text-white transition-colors">
                  {CAT_ICONS[c.id] || CAT_ICONS.herramientas}
                </div>
                <span className="text-sm font-semibold text-ink text-center group-hover:text-brand transition-colors">{c.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Productos destacados */}
        {featured.length > 0 && (
          <section className="bg-canvas py-12 lg:py-16">
            <div className="max-w-[1280px] mx-auto px-5">
              <h2 className="font-display font-bold text-[clamp(22px,3vw,28px)] text-ink tracking-[-0.01em] text-center">Productos Destacados</h2>
              <p className="text-muted text-sm text-center mt-1 mb-8">Los favoritos de nuestros clientes</p>
              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 min-[740px]:grid-cols-4 gap-5">
                {featured.map((p) => (
                  <ProductCard key={p.id} product={p} stockQty={p.stock} rate={rate} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  to="/catalogo"
                  className="inline-flex items-center justify-center bg-brand hover:bg-brandhover text-white font-semibold text-sm tracking-[0.02em] py-3 px-6 rounded-lg min-h-[46px] transition-colors"
                >
                  Ver todo el catálogo
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Sede */}
        <section id="sede" className="max-w-[1280px] mx-auto px-5 py-12 lg:py-16">
          <h2 className="font-display font-bold text-[clamp(22px,3vw,28px)] text-ink tracking-[-0.01em] text-center">Nuestra Sede</h2>
          <p className="text-muted text-sm text-center mt-1 mb-8">Encuéntranos en Maracaibo</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-line rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand/10 text-brand grid place-items-center flex-none">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-[17px] text-ink">Sede San Jacinto</h3>
                  <p className="text-sm text-muted mt-1">AV. 16 GUAJIRA, C.C FERREMALL</p>
                </div>
              </div>
              <div className="mt-5 border-t border-line pt-4">
                <div className="flex items-center gap-2 text-sm text-ink">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span className="font-medium">Horarios:</span>
                </div>
                <p className="text-sm text-muted mt-1.5 ml-6">
                  Lunes a Viernes: 8:00 AM - 8:00 PM<br />
                  Sábados y Domingos: 8:00 AM - 2:00 PM
                </p>
              </div>
              <div className="mt-4 border-t border-line pt-4">
                <a href="https://wa.me/58424262630" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-action hover:text-actionhover transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  +58-424262630
                </a>
              </div>
            </div>

            <div className="bg-white border border-line rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-semibold text-[17px] text-ink mb-3">¿Cómo comprar?</h3>
                <div className="flex flex-col gap-4 mt-6">
                  {[
                    { step: '1', text: 'Navega por nuestro catálogo' },
                    { step: '2', text: 'Arma tu carrito con lo que necesites' },
                    { step: '3', text: 'Confirma tu pedido directamente por WhatsApp' }
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-brand text-white text-sm font-bold grid place-items-center flex-none">{s.step}</span>
                      <p className="text-sm text-ink pt-1">{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section className="py-12 lg:py-16">
          <div className="max-w-[1280px] mx-auto px-5">
            <h2 className="font-display font-bold text-[clamp(22px,3vw,28px)] text-ink tracking-[-0.01em] text-center">¿Por qué comprar en El Catire?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              {[
                { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, title: 'Retiro Inmediato en Tienda', desc: 'Consulta stock y retira sin esperas en nuestra sede de Maracaibo.' },
                { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, title: 'Atención Personalizada', desc: 'Asesoría directa por WhatsApp con nuestros especialistas.' },
                { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, title: 'Múltiples Métodos de Pago', desc: 'Efectivo, Pago Móvil, Cashea, Zelle o Punto de Venta al retirar.' }
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3 bg-white border border-line rounded-lg p-6">
                  <div className="w-14 h-14 rounded-full bg-brand/10 text-brand grid place-items-center">
                    {b.icon}
                  </div>
                  <h3 className="font-display font-semibold text-[16px] text-ink">{b.title}</h3>
                  <p className="text-sm text-muted">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <section id="contacto">
      <Footer/>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </section>
    </div>
  )
}
