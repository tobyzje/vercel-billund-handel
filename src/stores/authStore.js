import { create } from 'zustand'
import { supabase } from '../config/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,
  
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ user: session?.user || null, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  login: async (email, password) => {
    try {
      set({ loading: true, error: null })
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      set({ user: data.user, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },

  isAdmin: () => {
    const { user } = useAuthStore.getState()
    return user?.user_metadata?.role === 'admin'
  },

  isWebmaster: () => {
    const { user } = useAuthStore.getState()
    return user?.user_metadata?.role === 'webmaster'
  }
})) 