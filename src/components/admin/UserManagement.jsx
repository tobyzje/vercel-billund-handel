import { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { useAuth } from '../../context/AuthContext'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const { user: currentUser } = useAuth()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user:id (
            email,
            created_at
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(profiles)
    } catch (err) {
      setError('Kunne ikke hente brugere: ' + err.message)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await adminService.createUser(newUser)
      setSuccess('Bruger oprettet succesfuldt')
      setNewUser({ name: '', email: '', password: '', role: 'user' })
      fetchUsers()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole)
      fetchUsers()
      setSuccess('Brugerrolle opdateret')
    } catch (err) {
      setError('Kunne ikke opdatere rolle: ' + err.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Brugeradministration</h2>

      {/* Fejl og success beskeder */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Opret ny bruger formular */}
      <form onSubmit={handleCreateUser} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <h3 className="text-xl font-semibold mb-4">Opret ny bruger</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Navn
            </label>
            <input
              type="text"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Rolle
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="user">Bruger</option>
              <option value="admin">Administrator</option>
              <option value="webmaster">Webmaster</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Opretter...' : 'Opret bruger'}
          </button>
        </div>
      </form>

      {/* Brugerliste */}
      <div className="bg-white shadow-md rounded overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Navn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rolle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Handlinger
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.user?.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="user">Bruger</option>
                    <option value="admin">Administrator</option>
                    <option value="webmaster">Webmaster</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManagement 