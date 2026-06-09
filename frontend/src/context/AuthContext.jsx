import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

// ── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

// ── Constants ────────────────────────────────────────────────────────────────
const USER_KEY  = 'msc_user'

// ── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
  })
  const [loading, setLoading] = useState(true)   // initial session check
  const [error,   setError]   = useState(null)

  // ── Persist helpers ───────────────────────────────────────────────────────
  const persist = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setUser(user)
  }

  const clear = () => {
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  // ── Verify token on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await authService.getMe()
        persist(data.user)
      } catch {
        clear()
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auth actions ──────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    setError(null)
    const { data } = await authService.register(formData)
    persist(data.user)
    return data
  }, [])

  const login = useCallback(async (credentials) => {
    setError(null)
    const { data } = await authService.login(credentials)
    persist(data.user)
    return data
  }, [])

  const logout = useCallback(async () => {
    try { await authService.logout() } catch { /* ignore */ }
    clear()
  }, [])

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, loading, error, setError, isAuthenticated, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
