import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const inputCls = 'w-full rounded-lg border border-line bg-white px-3.5 py-3 text-sm text-ink placeholder:text-disabled outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20'

export default function ResetPasswordPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Restablecer contraseña · Ferretería El Catire'
  }, [])

  const [pass, setPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  async function submit(e) {
    e.preventDefault()
    setMsg('')
    setErr('')
    if (!/(?=.*[a-z])(?=^(?=.*\d).*[A-Z])(?=.*[!@#$%^&*()-+.]).{8,}$/.test(pass)) {
      setErr('La contraseña debe tener al menos 8 caracteres incluyendo una letra minúscula, una letra mayúscula, un número y un carácter especial.')
      return
    }
    if (pass !== confirm) {
      setErr('Las contraseñas no coinciden.')
      return
    }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pass })
    setSaving(false)
    if (error) {
      setErr(error.message)
      return
    }
    setMsg('Contraseña actualizada. Ya puedes iniciar sesión con la nueva.')
    setPass('')
    setConfirm('')
    setTimeout(() => navigate('/login'), 1800)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-canvas">
      <Link className="flex items-center mb-8" to="/" aria-label="Ferretería El Catire, ir al catálogo">
        <img src="/img/chamo.png" alt="Logo Ferretería El Catire" className="h-45 w-auto transition-transform duration-200 hover:scale-105" />
      </Link>

      <div className="w-full max-w-[420px]">
        <h1 className="font-display font-bold text-[26px] text-ink tracking-[-0.01em]">Restablecer contraseña</h1>
        <p className="text-muted text-sm mt-1 mb-7">Crea una nueva contraseña para tu cuenta.</p>

        {loading ? (
          <p className="text-muted text-sm">Cargando…</p>
        ) : !user ? (
          <>
            <p className="text-sm text-[#b91c1c] font-medium mb-4">El enlace no es válido o ya expiró. Solicita uno nuevo desde «¿Olvidaste tu contraseña?» en la página de inicio de sesión.</p>
            <Link to="/login" className="inline-flex items-center justify-center bg-brand hover:bg-brandhover text-white font-semibold text-[15px] tracking-[0.02em] py-3.5 px-4 rounded-lg min-h-[50px] transition-colors shadow-[0_2px_8px_rgba(238,102,16,0.3)]">
              Ir a iniciar sesión
            </Link>
          </>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="resetPass" className="text-sm font-semibold text-ink">Nueva contraseña</label>
              <input id="resetPass" type="password" required placeholder="Mínimo 8 caracteres" autoComplete="new-password" value={pass} onChange={(e) => setPass(e.target.value)} className={inputCls} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="resetConfirm" className="text-sm font-semibold text-ink">Confirmar contraseña</label>
              <input id="resetConfirm" type="password" required placeholder="Repite la contraseña" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls} />
            </div>

            {msg && <p className="text-sm text-action font-medium">{msg}</p>}
            {err && <p className="text-sm text-[#b91c1c] font-medium">{err}</p>}

            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer mt-1 flex items-center justify-center gap-2 bg-brand hover:bg-brandhover text-white font-semibold text-[15px] tracking-[0.02em] py-3.5 px-4 rounded-lg min-h-[50px] transition-colors shadow-[0_2px_8px_rgba(238,102,16,0.3)] disabled:opacity-60"
            >
              {saving ? 'Guardando…' : 'Guardar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
