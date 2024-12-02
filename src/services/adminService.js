import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tnojdniodflqvbqsvwli.supabase.co'
const supabaseServiceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRub2pkbmlvZGZscXZicXN2d2xpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMDg4MjQ3MCwiZXhwIjoyMDI2NDU4NDcwfQ.xYMl2WovQoWVUTYj_QsmLd_nRSK4oQYTA9RyiUgxedI'

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
})

export const adminService = {
  async createUser(userData) {
    const { email, password, name, role } = userData

    try {
      // Opret bruger med service role
      const { data, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role }
      })

      if (authError) throw authError

      // Opret profil
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([{
          id: data.user.id,
          name,
          role
        }])

      if (profileError) throw profileError

      return data.user
    } catch (error) {
      console.error('Create user error:', error)
      throw error
    }
  },

  async updateUserRole(userId, newRole) {
    try {
      // Opdater bruger metadata
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { user_metadata: { role: newRole } }
      )

      if (authError) throw authError

      // Opdater profil
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (profileError) throw profileError

      return true
    } catch (error) {
      console.error('Update user role error:', error)
      throw error
    }
  },

  async getAllUsers() {
    try {
      const { data: profiles, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select(`
          *,
          users:id (
            email,
            created_at
          )
        `)
        .order('created_at', { ascending: false })

      if (profileError) throw profileError
      return profiles
    } catch (error) {
      console.error('Get users error:', error)
      throw error
    }
  }
} 