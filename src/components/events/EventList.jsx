import { useEffect } from 'react'
import { format } from 'date-fns'
import { da } from 'date-fns/locale'
import { useEventStore } from '../../stores/eventStore'

function EventList() {
  const { events, loading, error, fetchEvents } = useEventStore()

  useEffect(() => {
    fetchEvents()
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  )

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      {error}
    </div>
  )

  if (events.length === 0) return (
    <div className="text-center py-12">
      <p className="text-gray-500">Ingen events at vise</p>
    </div>
  )

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map(event => (
        <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {event.imageUrl && (
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-xl font-bold">{event.title}</h3>
            <p className="text-gray-600">
              {format(new Date(event.date), 'dd. MMMM yyyy', { locale: da })}
            </p>
            <p className="text-gray-600">{event.time}</p>
            <p className="text-gray-600">{event.location}</p>
            <p className="mt-2">{event.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Oprettet af: {event.creatorName}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EventList 