import { createHash } from 'crypto'
import bcrypt from 'bcryptjs'
import redis, { redisHelpers } from '../config/redis.js'

class User {
  static async create(userData) {
    const { name, email, password, role = 'user' } = userData
    
    // Check if user exists
    const existingUser = await redisHelpers.getUserByEmail(email)
    if (existingUser) {
      throw new Error('Bruger eksisterer allerede')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userId = createHash('md5').update(email).digest('hex')
    const user = {
      id: userId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      active: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    }

    // Save to Redis
    await redisHelpers.createUser(user)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  static async findByEmail(email) {
    const userId = await redis.get(`user:email:${email.toLowerCase()}`)
    if (!userId) return null
    
    const user = await redis.hgetall(`user:${userId}`)
    return user || null
  }

  static async findById(id) {
    const user = await redis.hgetall(`user:${id}`)
    if (!user) return null
    
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  static async updateLastLogin(id) {
    const lastLogin = new Date().toISOString()
    await redis.hset(`user:${id}`, { lastLogin })
    return lastLogin
  }

  static async comparePassword(storedPassword, candidatePassword) {
    return bcrypt.compare(candidatePassword, storedPassword)
  }
}

export default User 