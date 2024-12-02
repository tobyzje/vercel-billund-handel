import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  Bars3Icon, 
  XMarkIcon,
  CalendarDaysIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
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
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo og primær navigation */}
          <div className="flex">
            <NavLink to="/" className="flex items-center text-xl font-bold text-primary">
              Billund Handelsforening
            </NavLink>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    isActive
                      ? 'border-accent text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`
                }
              >
                <CalendarDaysIcon className="h-5 w-5 mr-1" />
                Events
              </NavLink>
            </div>
          </div>

          {/* Bruger menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {(user.role === 'admin' || user.role === 'webmaster') && (
                  <NavLink
                    to="/admin"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Admin Panel
                  </NavLink>
                )}
                <div className="flex items-center space-x-2 text-gray-700">
                  <UserCircleIcon className="h-6 w-6" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Log ud
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Log ind
                </NavLink>
                <NavLink
                  to="/opret-konto"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-accent text-white hover:bg-accent/90"
                >
                  Opret konto
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobil menu knap */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink
              to="/events"
              className={({ isActive }) =>
                `block px-3 py-2 text-base font-medium ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <div className="flex items-center">
                <CalendarDaysIcon className="h-5 w-5 mr-2" />
                Events
              </div>
            </NavLink>

            {user ? (
              <>
                {(user.role === 'admin' || user.role === 'webmaster') && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `block px-3 py-2 text-base font-medium ${
                        isActive
                          ? 'bg-accent/10 text-accent'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    Admin Panel
                  </NavLink>
                )}
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Log ud
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `block px-3 py-2 text-base font-medium ${
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  Log ind
                </NavLink>
                <NavLink
                  to="/opret-konto"
                  className="block px-3 py-2 text-base font-medium bg-accent text-white hover:bg-accent/90"
                >
                  Opret konto
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar