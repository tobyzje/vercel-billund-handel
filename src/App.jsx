import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminPanel from './components/admin/AdminPanel'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import EventList from './components/events/EventList'
import { useRealtime } from './hooks/useRealtime'
import { useEffect, useState } from 'react'
import { supabase } from './config/supabase'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.user_metadata?.role))) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession()
        if (error) throw error
        navigate('/')
      } catch (err) {
        console.error('Auth callback error:', err)
        setError(err.message)
      }
    }

    handleCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Fejl ved login: {error}
      </div>
    )
  }

  return (
    <div className="p-4">
      Logger ind...
    </div>
  )
}

function App() {
  useRealtime()

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/events" replace />} />
          <Route path="events" element={<EventList />} />
          <Route path="login" element={<Login />} />
          <Route path="opret-konto" element={<Register />} />
          <Route 
            path="admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'webmaster']}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
