import { create } from 'zustand'
import { eventService } from '../services/eventService'

export const useEventStore = create((set) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async () => {
    set({ loading: true, error: null })
    try {
      const events = await eventService.getEvents()
      set({ events, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  deleteEvent: async (id) => {
    try {
      await eventService.deleteEvent(id)
      set(state => ({
        events: state.events.filter(event => event.id !== id)
      }))
    } catch (error) {
      set({ error: error.message })
    }
  }
})) 