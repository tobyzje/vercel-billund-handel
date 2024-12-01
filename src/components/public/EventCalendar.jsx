import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { da } from 'date-fns/locale'
import { 
  CalendarDaysIcon, 
  MapPinIcon, 
  ClockIcon,
  ViewColumnsIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'

function EventCalendar() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' eller 'list'

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (!response.ok) throw new Error('Kunne ikke hente events')
      const data = await response.json()
      setEvents(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kommende Events</h1>
          <p className="mt-2 text-gray-600">Se alle planlagte events i Billund</p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${
              viewMode === 'grid' 
                ? 'bg-white shadow text-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${
              viewMode === 'list' 
                ? 'bg-white shadow text-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ViewColumnsIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Events grid/list */}
      {viewMode === 'grid' ? (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 p-4">
                  <div className="absolute bottom-4">
                    <h3 className="text-white text-xl font-bold">{event.title}</h3>
                    <p className="text-white/90 flex items-center mt-2">
                      <CalendarDaysIcon className="h-5 w-5 mr-2" />
                      {format(new Date(event.date), 'd. MMMM yyyy', { locale: da })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="flex items-center text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  {event.time}
                </p>
                <p className="flex items-center text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  {event.location}
                </p>
                <p className="text-gray-700 line-clamp-2">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <div 
              key={event._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex">
                <div className="w-48 h-48 flex-shrink-0">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                  <div className="mt-4 space-y-2">
                    <p className="flex items-center text-gray-600">
                      <CalendarDaysIcon className="h-5 w-5 mr-2" />
                      {format(new Date(event.date), 'd. MMMM yyyy', { locale: da })}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <ClockIcon className="h-5 w-5 mr-2" />
                      {event.time}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <MapPinIcon className="h-5 w-5 mr-2" />
                      {event.location}
                    </p>
                  </div>
                  <p className="mt-4 text-gray-700">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {events.length === 0 && (
        <div className="text-center py-12">
          <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Ingen events</h3>
          <p className="mt-1 text-sm text-gray-500">Der er ingen planlagte events i øjeblikket.</p>
        </div>
      )}
    </div>
  )
}

export default EventCalendar 