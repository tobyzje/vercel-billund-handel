const API_URL = import.meta.env.VITE_API_URL

export const eventService = {
  async getEvents() {
    try {
      const response = await fetch(`${API_URL}/events`, {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Kunne ikke hente events')
      return response.json()
    } catch (error) {
      console.error('Get events error:', error)
      throw error
    }
  },

  async createEvent(eventData, imageFile) {
    try {
      const formData = new FormData()
      Object.keys(eventData).forEach(key => {
        formData.append(key, eventData[key])
      })
      if (imageFile) {
        formData.append('image', imageFile)
      }

      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (!response.ok) throw new Error('Kunne ikke oprette event')
      return response.json()
    } catch (error) {
      console.error('Create event error:', error)
      throw error
    }
  },

  async deleteEvent(id) {
    try {
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Kunne ikke slette event')
      return response.json()
    } catch (error) {
      console.error('Delete event error:', error)
      throw error
    }
  }
} 