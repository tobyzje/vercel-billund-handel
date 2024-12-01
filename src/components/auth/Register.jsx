import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Register() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validering
    if (userData.password !== userData.confirmPassword) {
      alert('Adgangskoderne matcher ikke')
      return
    }

    try {
      await register(userData.name, userData.email, userData.password)
      navigate('/admin') // Eller hvor end brugeren skal hen efter registrering
    } catch (err) {
      console.error('Registrering fejlede:', err)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Opret konto hos Billund Handelsforening
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Eller log ind på eksisterende konto{' '}
            <Link to="/login" className="font-medium text-green-500 uppercase underline hover:text-accent/80">
              her
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                  placeholder="Dit navn"
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
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
                  placeholder="din@email.dk"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
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
                  value={userData.password}
                  onChange={(e) => setUserData({...userData, password: e.target.value})}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700">
                Bekræft adgangskode
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  className="input-field pl-1 h-8 w-56 bg-gray-100 rounded-md"
                  placeholder="••••••••"
                  value={userData.confirmPassword}
                  onChange={(e) => setUserData({...userData, confirmPassword: e.target.value})}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Jeg accepterer{' '}
                <a href="#" className="font-medium text-green-500 hover:text-green-600">
                  betingelserne
                </a>
              </label>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="btn-primary bg-green-500 hover:bg-green-700 hover:text-white rounded-lg w-52 flex justify-center py-3"
              disabled={loading}
            >
              {loading ? 'Opretter konto...' : 'Opret konto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register 