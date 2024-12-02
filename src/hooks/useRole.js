import { useAuth } from '../context/AuthContext'

export function useRole() {
  const { user } = useAuth()
  
  return {
    isAdmin: () => user?.role === 'admin',
    isWebmaster: () => user?.role === 'webmaster',
    isAuthenticated: () => !!user,
    role: user?.role
  }
} 