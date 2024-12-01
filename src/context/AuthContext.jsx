import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || '/api/auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }

        const response = await fetch(`${API_URL}/check`, {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
        } else {
          localStorage.removeItem('user')
          setUser(null)
        }
      } catch (err) {
        console.error('Auth check fejlede:', err)
        localStorage.removeItem('user')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server svarede ikke med JSON");
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login fejlede')
      }

      const data = await response.json()
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      return data.user
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
      localStorage.removeItem('user')
    } catch (err) {
      console.error('Logout fejlede:', err)
    }
  }

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/check`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (err) {
      console.error('Auth check fejlede:', err)
      setUser(null)
    }
  }

  const register = async (name, email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registrering fejlede')
      }

      const data = await response.json()
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      return data.user
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout, 
      checkAuth,
      register
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)