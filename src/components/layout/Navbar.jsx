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
            <div className="flex-shrink-0 flex items-center">
              <NavLink to="/" className="text-xl font-bold text-primary">
                Billund Handelsforening
              </NavLink>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/kalender"
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
            <div className="relative ml-3">
              {user ? (
                <div className="flex items-center space-x-4">
                  {user.user_metadata?.role === 'admin' && (
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium ${
                          isActive
                            ? 'bg-accent text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                      }
                    >
                      Admin Panel
                    </NavLink>
                  )}
                  <div className="flex items-center space-x-2 text-gray-700">
                    <UserCircleIcon className="h-6 w-6" />
                    <span>{user.user_metadata?.name || user.email}</span>
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
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? 'bg-accent text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    Log ind
                  </NavLink>
                  <NavLink
                    to="/opret-konto"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-green-500 text-white hover:bg-green-600"
                  >
                    Opret konto
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Mobil menu knap */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
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
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <NavLink
            to="/kalender"
            className={({ isActive }) =>
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive
                  ? 'border-accent text-accent bg-accent/10'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
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
              <NavLink
                to="/profil"
                className={({ isActive }) =>
                  `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive
                      ? 'border-accent text-accent bg-accent/10'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`
                }
              >
                Min profil ({user.name})
              </NavLink>
              {(user.role === 'admin' || user.role === 'webmaster') && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      isActive
                        ? 'border-accent text-accent bg-accent/10'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  Admin Panel
                </NavLink>
              )}
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={() => {
                  handleLogout()
                  closeMenu()
                }}
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              >
                Log ud
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive
                      ? 'border-accent text-accent bg-accent/10'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`
                }
              >
                Log ind
              </NavLink>
              <NavLink
                to="/opret-konto"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-green-500 hover:bg-gray-50 hover:border-green-300"
              >
                Opret konto
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar