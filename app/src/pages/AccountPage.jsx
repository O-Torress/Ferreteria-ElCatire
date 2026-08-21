import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'

const inputCls = 'w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-disabled outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20'

export default function AccountPage() {
  const { user, profile, isAdmin, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const meta = user?.user_metadata || {}
  const [form, setForm] = useState({ nombre: '', apellido: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const [pass, setPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [passSaving, setPassSaving] = useState(false)
  const [passMsg, setPassMsg] = useState('')
  const [passErr, setPassErr] = useState('')
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    setForm({
      nombre: profile?.nombre ?? meta.nombre ?? '',
      apellido: profile?.apellido ?? meta.apellido ?? ''
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.nombre, profile?.apellido])

  async function saveProfile(e) {
    e.preventDefault()
    setMsg('')
    setErr('')
    const nombre = form.nombre.trim()
    const apellido = form.apellido.trim()
    if (!nombre || !apellido) {
      setErr('El nombre y el apellido no pueden quedar vacíos.')
      return
    }
    if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/.test(nombre) || !/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/.test(apellido)) {
      setErr('El nombre y el apellido solo pueden contener letras, acentos y espacios.')
      return
    }
    setSaving(true)
    const payload = { nombre, apellido }
    const { error } = await supabase.from('Perfiles').update(payload).eq('email', user.email)
    if (!error) await supabase.auth.updateUser({ data: payload })
    setSaving(false)
    if (error) {
      setErr(error.message)
      return
    }
    setMsg('Datos actualizados correctamente.')
    refreshProfile()
  }

  async function changePassword(e) {
    e.preventDefault()
    setPassMsg('')
    setPassErr('')
    if (pass.length < 6) {
      setPassErr('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (pass !== confirm) {
      setPassErr('Las contraseñas no coinciden.')
      return
    }
    setPassSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pass })
    setPassSaving(false)
    if (error) {
      setPassErr(error.message)
      return
    }
    setPass('') 
    setConfirm('')
    setPassMsg('Contraseña actualizada correctamente.')
  }

  async function logout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const rolLabel = isAdmin ? 'Administrador' : 'Cliente'

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Header query="" onQuery={() => {}} onOpenCart={() => setCartOpen(true)} />

      <main className="flex-1 py-8">
        <div className="max-w-[720px] mx-auto px-5">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <div>
              <h1 className="font-display font-bold text-[clamp(24px,3vw,30px)] text-ink tracking-[-0.01em] leading-[1.15]">Mi cuenta</h1>
              <p className="text-muted text-sm mt-0.5">Administra tus datos personales y tu sesión.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand/10 text-brand border border-brand/35">{rolLabel}</span>
          </div>

          <form onSubmit={saveProfile} className="bg-white border border-line rounded-lg p-5 sm:p-6 mb-5">
            <h2 className="font-display font-semibold text-[17px] tracking-[-0.01em] mb-4">Datos personales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="accNombre" className="text-sm font-semibold text-ink">Nombre</label>
                <input id="accNombre" type="text" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="accApellido" className="text-sm font-semibold text-ink">Apellido</label>
                <input id="accApellido" type="text" value={form.apellido} onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="accEmail" className="text-sm font-semibold text-ink">Correo</label>
                <input id="accEmail" type="email" value={user?.email || ''} disabled className={inputCls + ' bg-canvas text-muted cursor-not-allowed'} />
              </div>
            </div>

            {msg && <p className="text-sm text-action font-medium mt-3.5">{msg}</p>}
            {err && <p className="text-sm text-[#b91c1c] font-medium mt-3.5">{err}</p>}

            <button type="submit" disabled={saving} className="mt-4 bg-brand hover:bg-brandhover text-white font-semibold text-sm tracking-[0.02em] px-5 py-2.5 rounded-lg min-h-[42px] transition-colors disabled:opacity-60">
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </form>

          <form onSubmit={changePassword} className="bg-white border border-line rounded-lg p-5 sm:p-6 mb-5">
            <h2 className="font-display font-semibold text-[17px] tracking-[-0.01em] mb-4">Cambiar contraseña</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="accPass" className="text-sm font-semibold text-ink">Nueva contraseña</label>
                <input id="accPass" type="password" autoComplete="new-password" placeholder="Mínimo 6 caracteres" value={pass} onChange={(e) => setPass(e.target.value)} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="accConfirm" className="text-sm font-semibold text-ink">Confirmar contraseña</label>
                <input id="accConfirm" type="password" autoComplete="new-password" placeholder="Repite la contraseña" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls} />
              </div>
            </div>

            {passMsg && <p className="text-sm text-action font-medium mt-3.5">{passMsg}</p>}
            {passErr && <p className="text-sm text-[#b91c1c] font-medium mt-3.5">{passErr}</p>}

            <button type="submit" disabled={passSaving} className="mt-4 bg-action hover:bg-actionhover text-white font-semibold text-sm tracking-[0.02em] px-5 py-2.5 rounded-lg min-h-[42px] transition-colors disabled:opacity-60">
              {passSaving ? 'Actualizando…' : 'Actualizar contraseña'}
            </button>
          </form>

          <div className="bg-white border border-line rounded-lg p-5 sm:p-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-display font-semibold text-[17px] tracking-[-0.01em]">Sesión</h2>
              <p className="text-muted text-sm mt-0.5">Cierra sesión en este dispositivo.</p>
            </div>
            <div className="flex items-center gap-2.5">
              <button onClick={logout} className="text-sm font-semibold text-[#b91c1c] border border-[#b91c1c]/40 hover:bg-[#fdeeee] px-4 py-2.5 rounded-lg min-h-[42px] transition-colors">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
