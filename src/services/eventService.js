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
      .from('events')
      .select(`
        *,
        created_by (
          name,
          role
        )
      `)
      .order('date', { ascending: true })

    if (error) throw error
    return data
  },

  async getEventById(id) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        created_by (
          name,
          role
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async updateEvent(id, eventData, imageFile = null) {
    try {
      let updateData = { ...eventData }

      if (imageFile) {
        // Upload nyt billede
        const fileName = `${Date.now()}-${imageFile.name}`
        const { data: imageData, error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        // Få public URL til det nye billede
        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName)

        // Tilføj billede info til update data
        updateData.image_url = publicUrl
        updateData.image_path = fileName

        // Slet gammelt billede hvis det findes
        const { data: oldEvent } = await supabase
          .from('events')
          .select('image_path')
          .eq('id', id)
          .single()

        if (oldEvent?.image_path) {
          await supabase.storage
            .from('event-images')
            .remove([oldEvent.image_path])
        }
      }

      // Opdater event
      const { data, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select('*, created_by(name)')
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Update event error:', error)
      throw error
    }
  },

  async deleteEvent(id) {
    try {
      // Hent event for at få image_path
      const { data: event } = await supabase
        .from('events')
        .select('image_path')
        .eq('id', id)
        .single()

      // Slet billede hvis det findes
      if (event?.image_path) {
        await supabase.storage
          .from('event-images')
          .remove([event.image_path])
      }

      // Slet event
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Delete event error:', error)
      throw error
    }
  }
} 