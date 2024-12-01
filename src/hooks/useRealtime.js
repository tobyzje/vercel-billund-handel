import { useEffect } from 'react'
import { supabase } from '../config/supabase'
import { useEventStore } from '../stores/eventStore'

export function useRealtime() {
  const { fetchEvents } = useEventStore()

  useEffect(() => {
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        () => {
          fetchEvents(true)
        }
      )

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Realtime subscription active')
      }
    })

    return () => {
      channel.unsubscribe()
    }
  }, [fetchEvents])
} 