import { useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminPanel from './components/admin/AdminPanel'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import AdminRoute from './components/auth/AdminRoute'
import EventCalendar from './components/public/EventCalendar'

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
          <Route path="kalender" element={<EventCalendar />} />
          <Route path="login" element={<Login />} />
          <Route path="opret-konto" element={<Register />} />

          {/* Admin routes */}
          <Route 
            path="admin/*" 
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
