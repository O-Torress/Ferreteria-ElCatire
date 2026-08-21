import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => sub?.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }
    supabase
      .from('Perfiles')
      .select('*')
      .eq('email', user.email)
      .maybeSingle()
      .then(async ({ data }) => {
        if (data) {
          setProfile(data)
          return
        }
        const meta = user.user_metadata || {}
        if (!meta.nombre && !meta.apellido) {
          setProfile(null)
          return
        }
        const { data: created } = await supabase
          .from('Perfiles')
          .insert({
            email: user.email,
            nombre: meta.nombre || '',
            apellido: meta.apellido || '',
            rol_user: 'cliente'
          })
          .maybeSingle()
        setProfile(created ?? null)
      })
  }, [user])

  const isAdmin = Boolean(profile?.rol_user === 'admin')

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
