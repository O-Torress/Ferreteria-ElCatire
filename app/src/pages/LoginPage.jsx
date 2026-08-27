import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'

const inputCls = 'w-full rounded-lg border border-line bg-white px-3.5 py-3 text-sm text-ink placeholder:text-disabled outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20'

export default function LoginPage() {
  const [mode, setMode] = useState('login')

  useEffect(() => {
    document.title = 'Iniciar sesión · Ferretería El Catire'
  }, [])

  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  function switchMode(next) {
    setMode(next)
    setMsg('')
    setErr('')
  }

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
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass })
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

  async function submitRecover(e) {
    e.preventDefault()
    setMsg('')
    setErr('')
    if (!email) {
      setErr('Ingresa el correo de tu cuenta.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr('Ingresa un correo válido.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + '/restablecer'
    })
    setLoading(false)
    if (error) {
      setErr(error.message)
      return
    }
    setMsg('Te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-canvas">
      <Link className="flex items-center mb-8" to="/" aria-label="Ferretería El Catire, ir al catálogo">
        <img src="/img/chamo.png" alt="Logo Ferretería El Catire" className="h-45 w-auto transition-transform duration-200 hover:scale-105" />
      </Link>

      <div className="w-full max-w-[420px]">
        <h1 className="font-display font-bold text-[26px] text-ink tracking-[-0.01em]">{mode === 'login' ? 'Iniciar sesión' : 'Recuperar contraseña'}</h1>
        <p className="text-muted text-sm mt-1 mb-7">
          {mode === 'login' ? 'Accede para continuar con tu pedido.' : 'Te enviaremos un enlace para crear una nueva contraseña.'}
        </p>

        {mode === 'login' ? (
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
                className={inputCls}
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
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => switchMode('recover')}
                className="self-end text-[13px] font-medium text-muted hover:text-brand transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {err && <p className="text-sm text-[#b91c1c] font-medium">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer mt-1 flex items-center justify-center gap-2 bg-brand hover:bg-brandhover text-white font-semibold text-[15px] tracking-[0.02em] py-3.5 px-4 rounded-lg min-h-[50px] transition-colors shadow-[0_2px_8px_rgba(238,102,16,0.3)] disabled:opacity-60"
            >
              {loading ? 'Entrando…' : 'Iniciar Sesión'}
            </button>
          </form>
        ) : (
          <form onSubmit={submitRecover} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="recoverEmail" className="text-sm font-semibold text-ink">Correo</label>
              <input
                id="recoverEmail"
                type="email"
                required
                placeholder="tu@correo.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>

            {msg && <p className="text-sm text-action font-medium">{msg}</p>}
            {err && <p className="text-sm text-[#b91c1c] font-medium">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer mt-1 flex items-center justify-center gap-2 bg-brand hover:bg-brandhover text-white font-semibold text-[15px] tracking-[0.02em] py-3.5 px-4 rounded-lg min-h-[50px] transition-colors shadow-[0_2px_8px_rgba(238,102,16,0.3)] disabled:opacity-60"
            >
              {loading ? 'Enviando…' : 'Enviar enlace'}
            </button>

            <button
              type="button"
              onClick={() => switchMode('login')}
              className="cursor-pointer text-sm font-medium text-muted hover:text-brand transition-colors"
            >
              Volver a iniciar sesión
            </button>
          </form>
        )}

        {mode === 'login' && (
          <p className="text-center text-sm text-muted mt-5">
            ¿No tienes cuenta?
            <Link to="/register" className="font-semibold text-brand hover:text-brandhover underline underline-offset-2 transition-colors"> Regístrate</Link>
          </p>
        )}
      </div>
      <Toast message={err || msg} />
    </div>
  )
}
