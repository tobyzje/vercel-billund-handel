import { createHash } from 'crypto'
import redis from '../config/redis.js'

class Event {
  static async create(eventData) {
    const { title, date, time, location, description, imageUrl, createdBy } = eventData
    
    const event = {
      id: createHash('md5').update(`${title}-${Date.now()}`).digest('hex'),
      title,
      date,
      time,
      location,
      description,
      imageUrl,
      imagePublicId: eventData.imagePublicId,
      createdBy,
      createdAt: new Date().toISOString()
    }

    // Save to Redis
    await redis.hset(`event:${event.id}`, event)
    await redis.zadd('events:by-date', { 
      score: new Date(date).getTime(),
      member: event.id 
    })

    return event
  }

  static async findAll() {
    const eventIds = await redis.zrange('events:by-date', 0, -1)
    const events = await Promise.all(
      eventIds.map(id => redis.hgetall(`event:${id}`))
    )
    return events
  }

  static async findById(id) {
    return redis.hgetall(`event:${id}`)
  }

  static async delete(id) {
    const event = await this.findById(id)
    if (!event) return false

    await redis.del(`event:${id}`)
    await redis.zrem('events:by-date', id)
    return true
  }
}

export default Event 