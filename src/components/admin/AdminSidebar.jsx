import { NavLink } from 'react-router-dom'
import { useRole } from '../../hooks/useRole'
import { 
  CalendarIcon, 
  PlusCircleIcon,
  UsersIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

function AdminSidebar() {
  const { isWebmaster } = useRole()

  return (
    <div className="w-64 bg-gray-800 min-h-screen p-4">
      <div className="flex items-center gap-3 text-white mb-8">
        <Cog6ToothIcon className="h-8 w-8" />
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>
      
      <nav className="space-y-2">
        <NavLink 
          to="/admin"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg text-white hover:bg-gray-700 ${
              isActive ? 'bg-gray-700' : ''
            }`
          }
        >
          <CalendarIcon className="h-5 w-5" />
          <span>Events</span>
        </NavLink>

        <NavLink 
          to="/admin/create-event"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg text-white hover:bg-gray-700 ${
              isActive ? 'bg-gray-700' : ''
            }`
          }
        >
          <PlusCircleIcon className="h-5 w-5" />
          <span>Opret Event</span>
        </NavLink>

        {isWebmaster && (
          <NavLink 
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg text-white hover:bg-gray-700 ${
                isActive ? 'bg-gray-700' : ''
              }`
            }
          >
            <UsersIcon className="h-5 w-5" />
            <span>Brugere</span>
          </NavLink>
        )}
      </nav>
    </div>
  )
}

export default AdminSidebar