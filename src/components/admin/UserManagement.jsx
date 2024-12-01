import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const { user: currentUser } = useAuth()

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/auth/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdmin),
        credentials: 'include'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }

      const data = await response.json()
      setUsers([...users, data.user])
      setNewAdmin({ name: '', email: '', password: '' })
      setSuccess('Admin bruger blev oprettet succesfuldt')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Opret ny administrator
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Kun webmasters kan oprette admin-konti
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        <form onSubmit={handleCreateAdmin} className="mt-8 space-y-6">
          <div className="space-y-5 flex flex-col items-center">
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700">
                Navn
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  className="input-field pl-1 h-8 w-56 bg-gray-100 rounded-md"
                  placeholder="Administrators navn"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  className="input-field pl-1 h-8 w-56 bg-gray-100 rounded-md"
                  placeholder="admin@example.com"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700">
                Adgangskode
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  className="input-field pl-1 h-8 w-56 bg-gray-100 rounded-md"
                  placeholder="••••••••"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="btn-primary bg-green-500 hover:bg-green-700 hover:text-white rounded-lg w-52 flex justify-center py-3"
              disabled={loading}
            >
              {loading ? 'Opretter...' : 'Opret Administrator'}
            </button>
          </div>
        </form>

        {/* Liste over eksisterende administratorer kan tilføjes her senere */}
      </div>
    </div>
  )
}

export default UserManagement 