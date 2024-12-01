import { useEffect } from 'react'
import { supabase } from '../config/supabase'
import { useEventStore } from '../stores/eventStore'

export function useRealtime() {
  const { fetchEvents } = useEventStore()

  useEffect(() => {
    // Subscribe til events tabel
    const subscription = supabase
      .channel('events-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        () => {
          // Opdater events når der sker ændringer
          fetchEvents(true)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])
} 