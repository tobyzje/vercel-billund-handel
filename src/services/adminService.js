import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceRole = import.meta.env.VITE_SUPABASE_SERVICE_ROLE

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Missing Supabase environment variables:', { 
    url: supabaseUrl, 
    serviceRole: !!supabaseServiceRole 
  })
  throw new Error('Missing required Supabase configuration')
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  },
  headers: {
    'apikey': supabaseServiceRole
  },
  global: {
    headers: {
      'apikey': supabaseServiceRole,
      'Authorization': `Bearer ${supabaseServiceRole}`
    }
  }
})

// Tilføj auth header til alle requests
supabaseAdmin.rest.headers = {
  'apikey': supabaseServiceRole,
  'Authorization': `Bearer ${supabaseServiceRole}`
}

// Test forbindelsen ved opstart med mere detaljeret fejlhåndtering
const testConnection = async () => {
  try {
    console.log('Testing Supabase admin connection...')
    console.log('Headers:', supabaseAdmin.rest.headers)
    
    const { data, error } = await supabaseAdmin.auth.admin.listUsers()
    
    if (error) {
      console.error('Connection test failed:', error)
      throw error
    }
    
    console.log('✅ Admin service initialized successfully')
    console.log('Found', data.users.length, 'users')
    return true
  } catch (err) {
    console.error('❌ Admin service initialization failed:', err)
    console.error('Error details:', {
      message: err.message,
      status: err.status,
      name: err.name,
      details: err.details
    })
    throw err
  }
}

// Kør test ved opstart
testConnection()

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
  },

  // Test forbindelsen uden at kræve en auth session
  async testConnection() {
    try {
      // Test admin adgang
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
      
      if (error) throw error
      console.log('Supabase admin connection test successful:', users.length, 'users found')
      return true
    } catch (error) {
      console.error('Supabase admin connection test failed:', error)
      throw error
    }
  }
} 