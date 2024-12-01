import { create } from 'zustand'
import { eventService } from '../services/eventService'

export const useEventStore = create((set, get) => ({
  events: [],
  loading: false,
  error: null,
  lastFetched: null,

  fetchEvents: async (force = false) => {
    // Check cache først
    const now = Date.now()
    const cacheAge = now - get().lastFetched
    if (!force && get().events.length > 0 && cacheAge < 5 * 60 * 1000) {
      return // Brug cache hvis mindre end 5 minutter gammelt
    }

    set({ loading: true, error: null })
    try {
      const events = await eventService.getEvents()
      set({ 
        events, 
        loading: false,
        lastFetched: now
      })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  addEvent: async (eventData, imageFile) => {
    set({ loading: true, error: null })
    try {
      const newEvent = await eventService.createEvent(eventData, imageFile)
      set(state => ({ 
        events: [...state.events, newEvent],
        loading: false 
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  updateEvent: async (id, eventData, imageFile) => {
    set({ loading: true, error: null })
    try {
      const updatedEvent = await eventService.updateEvent(id, eventData, imageFile)
      set(state => ({
        events: state.events.map(event => 
          event.id === id ? updatedEvent : event
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  deleteEvent: async (id) => {
    set({ loading: true, error: null })
    try {
      await eventService.deleteEvent(id)
      set(state => ({
        events: state.events.filter(event => event.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  }
})) 