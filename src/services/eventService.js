import { supabase } from '../config/supabase'

export const eventService = {
  async createEvent(eventData, imageFile) {
    try {
      // Upload billede
      const fileName = `${Date.now()}-${imageFile.name}`
      const { data: imageData, error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(fileName, imageFile)

      if (uploadError) throw uploadError

      // Få public URL til billedet
      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName)

      // Opret event
      const { data: event, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          image_url: publicUrl,
          image_path: fileName,
          created_by: (await supabase.auth.getUser()).data.user.id
        }])
        .select('*, created_by(name)')
        .single()

      if (error) throw error
      return event
    } catch (error) {
      console.error('Create event error:', error)
      throw error
    }
  },

  async getEvents() {
    const { data, error } = await supabase
      .from('events_with_creator')
      .select('*')
      .order('date', { ascending: true })

    if (error) throw error
    return data
  }
} 