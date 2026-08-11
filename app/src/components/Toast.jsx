import { useEffect, useState } from 'react'

export default function Toast({ message }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!message) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 2600)
    return () => clearTimeout(t)
  }, [message])

  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={
        'fixed top-4 right-4 bg-white border border-line rounded-lg shadow-[0_10px_26px_rgba(26,37,54,0.2)] p-[11px_16px_11px_12px] flex items-center gap-[11px] text-sm font-medium z-[120] max-w-[min(380px,calc(100vw-32px))] transition-all duration-200 ' +
        (visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-[18px] pointer-events-none')
      }
    >
      <span className="w-6 h-6 rounded-full bg-action text-white grid place-items-center flex-none">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
      </span>
      <span>{message}</span>
    </div>
  )
}
