import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'

function Layout() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAdminRoute && <Navbar />}
      <main className={`${!isAdminRoute ? 'container mx-auto px-4' : ''} py-8`}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout 