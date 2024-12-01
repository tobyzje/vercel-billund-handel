import { supabase } from '../config/supabase'

export const eventService = {
  async createEvent(eventData, imageFile) {
    try {
      // Upload billede
      const { data: imageData, error: imageError } = await supabase.storage
        .from('event-images')
        .upload(`${Date.now()}-${imageFile.name}`, imageFile)

      if (imageError) throw imageError

      // Opret event med billede URL
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          image_url: `${supabase.storageUrl}/object/public/event-images/${imageData.path}`,
          created_by: supabase.auth.user()?.id
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Create event error:', error)
      throw error
    }
  },

  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        created_by (
          name
        )
      `)
      .order('date', { ascending: true })

    if (error) throw error
    return data
  },

  async deleteEvent(id) {
    const { error } = await supabase
      .from('events')
      .delete()
      .match({ id })

    if (error) throw error
  }
} 