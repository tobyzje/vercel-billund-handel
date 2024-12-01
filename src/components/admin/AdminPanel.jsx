import { Routes, Route } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminEventList from './AdminEventList'
import CreateEvent from './CreateEvent'
import UserManagement from './UserManagement'

function AdminPanel() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<AdminEventList />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </main>
    </div>
  )
}

export default AdminPanel 