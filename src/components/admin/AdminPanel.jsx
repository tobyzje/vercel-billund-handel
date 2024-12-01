import { Routes, Route } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import EventList from './EventList'
import CreateEvent from './CreateEvent'
import UserManagement from './UserManagement'
import { useAuth } from '../../context/AuthContext'

function AdminPanel() {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/create-event" element={<CreateEvent />} />
            {user?.role === 'webmaster' && (
              <Route path="/users" element={<UserManagement />} />
            )}
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default AdminPanel 