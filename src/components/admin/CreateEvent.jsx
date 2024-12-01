import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { eventService } from '../../services/eventService'

function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await eventService.createEvent(formData, image)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Opret nyt event</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Titel</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        {/* ... andre form felter ... */}

        <div>
          <label className="block text-sm font-medium text-gray-700">Billede</label>
          <input
            type="file"
            accept="image/*"
            required
            className="mt-1 block w-full"
            onChange={e => setImage(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          {loading ? 'Opretter...' : 'Opret Event'}
        </button>
      </div>
    </form>
  )
}

export default CreateEvent 