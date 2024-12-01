import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user || !['admin', 'webmaster'].includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default AdminRoute 