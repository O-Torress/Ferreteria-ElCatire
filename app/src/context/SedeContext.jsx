import { createContext, useContext, useState } from 'react'

const SedeContext = createContext(null)

const STORE_KEY = 'fec_sede'

export function SedeProvider({ children }) {
  const [sede, setSedeState] = useState(() => {
    try {
      return localStorage.getItem(STORE_KEY) || 'Sede Norte'
    } catch {
      return 'Sede Norte'
    }
  })

  const setSede = (id) => {
    setSedeState(id)
    try { localStorage.setItem(STORE_KEY, id) } catch {}
  }

  return <SedeContext.Provider value={{ sede, setSede }}>{children}</SedeContext.Provider>
}

export function useSede() {
  return useContext(SedeContext)
}
