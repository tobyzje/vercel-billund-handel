import { useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminPanel from './components/admin/AdminPanel'
import Login from './components/auth/Login'
import Register from './components/auth/Register'

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

function App() {
  const { checkAuth } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Offentlige routes */}
          <Route path="login" element={<Login />} />
          <Route path="opret-konto" element={<Register />} />

          {/* Admin routes */}
          <Route 
            path="admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'webmaster']}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
