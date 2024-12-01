import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.bhandel_KV_REST_API_URL,
  token: process.env.bhandel_KV_REST_API_TOKEN,
})

// Hjælpefunktioner til at håndtere data
export const redisHelpers = {
  // User helpers
  async createUserIndex(userId, email) {
    await redis.set(`user:email:${email.toLowerCase()}`, userId)
  },

  async getUserByEmail(email) {
    const userId = await redis.get(`user:email:${email.toLowerCase()}`)
    if (!userId) return null
    return redis.hgetall(`user:${userId}`)
  },

  async createUser(userData) {
    const { id, ...data } = userData
    await redis.hset(`user:${id}`, data)
    await this.createUserIndex(id, data.email)
    return id
  },

  // Event helpers
  async createEventIndex(eventId, date) {
    await redis.zadd('events:by-date', {
      score: new Date(date).getTime(),
      member: eventId
    })
  },

  async getEventsByDateRange(startDate, endDate) {
    return redis.zrangebyscore(
      'events:by-date',
      new Date(startDate).getTime(),
      new Date(endDate).getTime()
    )
  },

  async createEvent(eventData) {
    const { id, date, ...data } = eventData
    await redis.hset(`event:${id}`, data)
    await this.createEventIndex(id, date)
    return id
  },

  // Generic helpers
  async exists(key) {
    const value = await redis.exists(key)
    return value === 1
  },

  async deleteKey(key) {
    return redis.del(key)
  },

  async getAllKeys(pattern) {
    return redis.keys(pattern)
  }
}

export default redis 