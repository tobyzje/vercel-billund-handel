import { useAuth } from '../context/AuthContext'

export function useRole() {
  const { user } = useAuth()
  
  const isAdmin = user?.user_metadata?.role === 'admin'
  const isWebmaster = user?.user_metadata?.role === 'webmaster'
  const isAuthenticated = !!user
  
  return {
    isAdmin,
    isWebmaster,
    isAuthenticated,
    role: user?.user_metadata?.role
  }
} 