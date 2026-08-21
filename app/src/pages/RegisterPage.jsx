import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Slider from '../components/Slider'
import Toast from '../components/Toast'

const inputCls = 'w-full rounded-lg border border-line bg-white px-3.5 py-3 text-sm text-ink placeholder:text-disabled outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20'

const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/

export default function RegisterPage() {
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', pass: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  function set(k) { return (e) => setForm((f) => ({ ...f, [k]: e.target.value })) }

  async function submit(e) {
    e.preventDefault()
    setMsg('')
    setErr('')
    const { nombre, apellido, email, pass, confirm } = form
    if (!nombre || !apellido || !email || !pass || !confirm) {
      setErr('Completa todos los campos.')
      return
    }
    if (!NAME_RE.test(nombre.trim()) || !NAME_RE.test(apellido.trim())) {
      setErr('El nombre y el apellido solo pueden contener letras, acentos y espacios.')
      return
    }
    if (pass.length < 6) {
      setErr('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (pass !== confirm) {
      setErr('Las contraseñas no coinciden.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr('Ingresa un correo válido.')
      return
    }

    const nombreLimpio = nombre.trim()
    const apellidoLimpio = apellido.trim()

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { nombre: nombreLimpio, apellido: apellidoLimpio } }
    })
    setLoading(false)

    if (error) {
      setErr(error.message)
      return
    }

    if (data?.user) {
      setMsg('Cuenta creada. Revisa tu correo para confirmar y luego inicia sesión.')
      setTimeout(() => navigate('/login'), 1800)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <section className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
        <Link className="flex items-center self-start mb-8" to="/" aria-label="Ferretería El Catire, ir al catálogo">
          <img src="/img/fec.JPG" alt="Logo Ferretería El Catire" className="h-16 w-auto rounded-2xl object-contain shadow-[0_1px_4px_rgba(0,0,0,0.28)] transition-transform duration-200 hover:scale-105" />
        </Link>

        <div className="w-full max-w-[420px]">
          <h1 className="font-display font-bold text-[26px] text-ink tracking-[-0.01em]">Crear cuenta</h1>
          <p className="text-muted text-sm mt-1 mb-7">Regístrate para realizar tus pedidos.</p>

          <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="regNombre" className="text-sm font-semibold text-ink">Nombre</label>
                <input id="regNombre" type="text" required placeholder="Tu nombre" value={form.nombre} onChange={set('nombre')} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="regApellido" className="text-sm font-semibold text-ink">Apellido</label>
                <input id="regApellido" type="text" required placeholder="Tu apellido" value={form.apellido} onChange={set('apellido')} className={inputCls} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="regEmail" className="text-sm font-semibold text-ink">Correo</label>
              <input id="regEmail" type="email" required placeholder="tu@correo.com" autoComplete="email" value={form.email} onChange={set('email')} className={inputCls} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="regPass" className="text-sm font-semibold text-ink">Contraseña</label>
                <input id="regPass" type="password" required placeholder="Mínimo 6 caracteres" autoComplete="new-password" value={form.pass} onChange={set('pass')} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="regConfirm" className="text-sm font-semibold text-ink">Confirmar contraseña</label>
                <input id="regConfirm" type="password" required placeholder="Repite la contraseña" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} className={inputCls} />
              </div>
            </div>

            {err && <p className="text-sm text-[#b91c1c] font-medium">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 bg-brand hover:bg-brandhover text-white font-semibold text-[15px] tracking-[0.02em] py-3.5 px-4 rounded-lg min-h-[50px] transition-colors shadow-[0_2px_8px_rgba(238,102,16,0.3)] disabled:opacity-60"
            >
              {loading ? 'Creando cuenta…' : 'Registrarse'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-5">
            ¿Ya tienes cuenta?
            <Link to="/login" className="font-semibold text-brand hover:text-brandhover underline underline-offset-2 transition-colors">Inicia sesión</Link>
          </p>
        </div>
      </section>

      <Slider />
      <Toast message={err || msg} />
    </div>
  )
}
