import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as api from '../api/auth'
import { setUnauthorizedHandler } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [initializing, setInitializing] = useState(Boolean(localStorage.getItem('token')))

  const clearAuth = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      if (localStorage.getItem('token')) {
        await api.logout()
      }
    } catch {
      // ignore logout errors and clear local state anyway
    } finally {
      clearAuth()
    }
  }, [clearAuth])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearAuth()
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    })
  }, [clearAuth])

  useEffect(() => {
    const boot = async () => {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) {
        setInitializing(false)
        return
      }
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
        const res = await api.getMe()
        setUser(res.data)
        localStorage.setItem('user', JSON.stringify(res.data))
      } catch {
        clearAuth()
      } finally {
        setInitializing(false)
      }
    }
    boot()
  }, [clearAuth])

  const login = useCallback(async (identifier, password) => {
    const res = await api.login({ identifier, password })
    const { token: newToken, user: newUser } = res.data
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    return res.data
  }, [])

  const value = useMemo(
    () => ({ user, token, initializing, login, logout: handleLogout, clearAuth }),
    [user, token, initializing, login, handleLogout, clearAuth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}