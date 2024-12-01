import { useState, useEffect } from 'react'
import { eventService } from '../../services/eventService'
import { format } from 'date-fns'
import { da } from 'date-fns/locale'

function EventList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const data = await eventService.getEvents()
      setEvents(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map(event => (
        <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src={event.image_url} 
            alt={event.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold">{event.title}</h3>
            <p className="text-gray-600">
              {format(new Date(event.date), 'dd. MMMM yyyy', { locale: da })}
            </p>
            <p className="text-gray-600">{event.time}</p>
            <p className="text-gray-600">{event.location}</p>
            <p className="mt-2">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EventList 