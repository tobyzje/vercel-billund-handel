import { useState, useEffect } from 'react'
import { eventService } from '../../services/eventService'
import { format } from 'date-fns'
import { da } from 'date-fns/locale'
import { useEventStore } from '../../stores/eventStore'

function EventList() {
  const { events, loading, error, fetchEvents } = useEventStore()

  useEffect(() => {
    fetchEvents()
  }, [])

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
            <p className="text-sm text-gray-500 mt-2">
              Oprettet af: {event.created_by?.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EventList 