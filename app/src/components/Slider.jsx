import { useEffect, useRef, useState } from 'react'

const SLIDER_IMAGES = [
  '/img/slider/img1.PNG',
  '/img/slider/img2.jpg',
  '/img/slider/img3.jpg',
  '/img/slider/img4.jpg'
]

export default function Slider() {
  const [idx, setIdx] = useState(0)
  const [broken, setBroken] = useState({})
  const timer = useRef(null)

  useEffect(() => {
    timer.current = setInterval(() => setIdx((i) => (i + 1) % SLIDER_IMAGES.length), 4200)
    return () => clearInterval(timer.current)
  }, [])

  const go = (n) => {
    setIdx(((n % SLIDER_IMAGES.length) + SLIDER_IMAGES.length) % SLIDER_IMAGES.length)
    clearInterval(timer.current)
    timer.current = setInterval(() => setIdx((i) => (i + 1) % SLIDER_IMAGES.length), 4200)
  }

  return (
    <section className="relative overflow-hidden bg-inkdeep h-64 lg:h-screen" data-od-id="slider">
      <div className="flex h-full will-change-transform transition-transform duration-[1200ms] ease-in-out" style={{ width: SLIDER_IMAGES.length * 100 + '%', transform: 'translateX(-' + idx * (100 / SLIDER_IMAGES.length) + '%)' }}>
        {SLIDER_IMAGES.map((src, i) => (
          <div key={src} className="relative h-full grid place-items-center p-6 sm:p-10" style={{ width: 100 / SLIDER_IMAGES.length + '%' }}>
            {!broken[i] && (
              <img
                src={src}
                alt="Imagen promocional Ferretería El Catire"
                onError={() => setBroken((b) => ({ ...b, [i]: true }))}
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-inkdeep/90 via-inkdeep/30 to-inkdeep/10 pointer-events-none"></div>

      <div className="absolute bottom-10 left-6 sm:left-10 max-w-[420px] pointer-events-none">
        <p className="font-display text-white text-2xl sm:text-3xl font-bold leading-snug">Todo lo que necesitas para tu proyecto</p>
        <p className="text-white/80 text-sm mt-2">Ferretería El Catire · Maracaibo</p>
      </div>

      <button onClick={() => go(idx - 1)} className="absolute top-1/2 -translate-y-1/2 left-3 w-10 h-10 grid place-items-center rounded-full bg-white/15 border border-white/25 text-white backdrop-blur-sm hover:bg-white/30 transition-colors" aria-label="Imagen anterior">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button onClick={() => go(idx + 1)} className="absolute top-1/2 -translate-y-1/2 right-3 w-10 h-10 grid place-items-center rounded-full bg-white/15 border border-white/25 text-white backdrop-blur-sm hover:bg-white/30 transition-colors" aria-label="Siguiente imagen">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDER_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={'Ir a la imagen ' + (i + 1)}
            className={'h-2 rounded-full transition-all duration-300 ' + (i === idx ? 'bg-white' : 'bg-white/40')}
            style={{ width: i === idx ? '22px' : '8px' }}
          ></button>
        ))}
      </div>
    </section>
  )
}
