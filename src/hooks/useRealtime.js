import { useEffect } from 'react'
import { supabase } from '../config/supabase'
import { useEventStore } from '../stores/eventStore'
import { useAuth } from '../context/AuthContext'

export function useRealtime() {
  const { fetchEvents } = useEventStore()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return // Kun subscribe hvis bruger er logget ind

    console.log('Setting up realtime subscription...')

    const channel = supabase.channel('public:events')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          console.log('Event change received:', payload)
          fetchEvents(true)
        }
      )

    channel.subscribe((status) => {
      console.log('Subscription status:', status)
      if (status === 'SUBSCRIBED') {
        console.log('Successfully subscribed to events!')
      }
    })

    return () => {
      console.log('Cleaning up realtime subscription...')
      channel.unsubscribe()
    }
  }, [fetchEvents, user])
} 