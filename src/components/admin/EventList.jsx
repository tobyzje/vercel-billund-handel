import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { da } from 'date-fns/locale'

function EventList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events', {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Kunne ikke hente events')
      const data = await response.json()
      setEvents(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (eventId) => {
    if (!window.confirm('Er du sikker på at du vil slette dette event?')) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Kunne ikke slette event')
      
      setEvents(events.filter(event => event._id !== eventId))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <button
          onClick={() => navigate('/admin/create-event')}
          className="btn-primary bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Opret nyt event
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map(event => (
          <div 
            key={event._id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h3 className="text-white text-xl font-semibold">{event.title}</h3>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <p className="text-gray-600">
                  <span className="font-semibold">Dato: </span>
                  {format(new Date(event.date), 'd. MMMM yyyy', { locale: da })}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Tid: </span>
                  {event.time}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Lokation: </span>
                  {event.location}
                </p>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">
                {event.description}
              </p>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => navigate(`/admin/edit-event/${event._id}`)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Ingen events at vise. Opret dit første event!
          </p>
        </div>
      )}
    </div>
  )
}

export default EventList 