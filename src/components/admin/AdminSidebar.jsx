import { NavLink, useNavigate } from 'react-router-dom'
import { 
  CalendarIcon, 
  PlusCircleIcon, 
  Cog6ToothIcon, 
  Bars3Icon, 
  XMarkIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      console.error('Logout fejlede:', err)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-primary text-white hover:bg-accent transition-colors"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:static top-0 left-0 z-40
        w-64 min-h-screen bg-primary text-white
        transform transition-transform duration-300 ease-in-out
        lg:transform-none flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top section */}
        <div className="flex-1 p-4">
          <div className="mb-8 flex items-center gap-3">
            <Cog6ToothIcon className="h-8 w-8" />
            <h2 className="text-2xl font-bold">Admin Panel</h2>
          </div>
          
          <nav className="space-y-2">
            <NavLink 
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg hover:bg-opacity-80 transition-all ${
                  isActive ? 'bg-accent' : 'hover:bg-accent'
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <CalendarIcon className="h-5 w-5" />
              <span>Alle Events</span>
            </NavLink>
            
            <NavLink 
              to="/admin/create-event"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg hover:bg-opacity-80 transition-all ${
                  isActive ? 'bg-accent' : 'hover:bg-accent'
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>Opret Nyt Event</span>
            </NavLink>

            {user?.role === 'webmaster' && (
              <NavLink 
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg hover:bg-opacity-80 transition-all ${
                    isActive ? 'bg-accent' : 'hover:bg-accent'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UsersIcon className="h-5 w-5" />
                <span>Brugeradministration</span>
              </NavLink>
            )}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="p-4 border-t border-white/10">
          <div className="space-y-2">
            <NavLink
              to="/"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-all text-white/90 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <EyeIcon className="h-5 w-5" />
              <span>Vis side som borger</span>
            </NavLink>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-all text-white/90 hover:text-white"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              <span>Log ud</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

export default AdminSidebar