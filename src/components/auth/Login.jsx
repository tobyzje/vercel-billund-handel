import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await login(credentials.email, credentials.password)
      console.log('Logged in user:', user)
      if (['admin', 'webmaster'].includes(user.role)) {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      console.error('Login fejlede:', err)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Log ind på Billund Handelsforening
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Eller opret en ny konto{' '}
            <Link to="/opret-konto" className="font-medium text-green-500 uppercase underline hover:text-accent/80">
              her
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5 flex flex-col items-center">
            <div className="text-center">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  className="input-field pl-1 h-8 w-56 bg-gray-100 rounded-md"
                  placeholder="din@email.dk"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="text-center">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Adgangskode
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  className="input-field pl-1 h-8 w-56 bg-gray-100 rounded-md"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Husk mig
              </label>
            </div>

            <div className="text-sm">
              <Link to="/glemt-kode" className="font-medium text-accent hover:text-accent/80">
                Glemt adgangskode?
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="btn-primary bg-green-500 hover:bg-green-700 hover:text-white rounded-lg w-52 flex justify-center py-3"
              disabled={loading}
            >
              {loading ? 'Logger ind...' : 'Log ind'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login 