import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { eventService } from '../../services/eventService'

function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadEvent()
  }, [id])

  const loadEvent = async () => {
    try {
      const event = await eventService.getEventById(id)
      setFormData({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await eventService.updateEvent(id, formData, image)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Rediger event</h2>
      
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Dato</label>
          <input
            type="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.date}
            onChange={e => setFormData({...formData, date: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tid</label>
          <input
            type="time"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.time}
            onChange={e => setFormData({...formData, time: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lokation</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Beskrivelse</label>
          <textarea
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nyt billede (valgfrit)</label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full"
            onChange={e => setImage(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          {loading ? 'Gemmer...' : 'Gem ændringer'}
        </button>
      </div>
    </form>
  )
}

export default EditEvent 