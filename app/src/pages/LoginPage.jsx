import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Slider from '../components/Slider'
import Toast from '../components/Toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setMsg('')
    setErr('')
    if (!email || !pass) {
      setErr('Completa todos los campos.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr('Ingresa un correo válido.')
      return
    }
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass })
    setLoading(false)
    if (error) {
      setErr('Correo o contraseña incorrectos.')
      return
    }
    if (data?.user) {
      setMsg('Bienvenido de nuevo.')
      setTimeout(() => navigate('/'), 700)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <section className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
        <Link className="flex items-center self-start mb-8" to="/" aria-label="Ferretería El Catire, ir al catálogo">
          <img src="/img/fec.JPG" alt="Logo Ferretería El Catire" className="h-16 w-auto rounded-2xl object-contain shadow-[0_1px_4px_rgba(0,0,0,0.28)] transition-transform duration-200 hover:scale-105" />
        </Link>

        <div className="w-full max-w-[420px]">
          <h1 className="font-display font-bold text-[26px] text-ink tracking-[-0.01em]">Iniciar sesión</h1>
          <p className="text-muted text-sm mt-1 mb-7">Accede para continuar con tu pedido.</p>

          <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="loginEmail" className="text-sm font-semibold text-ink">Correo</label>
              <input
                id="loginEmail"
                type="email"
                required
                placeholder="tu@correo.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3.5 py-3 text-sm text-ink placeholder:text-disabled outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="loginPassword" className="text-sm font-semibold text-ink">Contraseña</label>
              <input
                id="loginPassword"
                type="password"
                required
                placeholder="Tu contraseña"
                autoComplete="current-password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3.5 py-3 text-sm text-ink placeholder:text-disabled outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            {err && <p className="text-sm text-[#b91c1c] font-medium">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 bg-brand hover:bg-brandhover text-white font-semibold text-[15px] tracking-[0.02em] py-3.5 px-4 rounded-lg min-h-[50px] transition-colors shadow-[0_2px_8px_rgba(238,102,16,0.3)] disabled:opacity-60"
            >
              {loading ? 'Entrando…' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-5">
            ¿No tienes cuenta?
            <Link to="/register" className="font-semibold text-brand hover:text-brandhover underline underline-offset-2 transition-colors">Regístrate</Link>
          </p>
        </div>
      </section>

      <Slider />
      <Toast message={err || msg} />
    </div>
  )
}
