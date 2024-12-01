import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminPanel from './components/admin/AdminPanel'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import EventList from './components/events/EventList'
import { useRealtime } from './hooks/useRealtime'
import { useEffect } from 'react'
import { supabase } from './config/supabase'

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
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        window.location.href = '/'
      }
    })
  }, [])

  return <div>Bekræfter login...</div>
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
