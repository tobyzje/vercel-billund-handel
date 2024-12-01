require('dotenv').config()
const express = require('express')
const mongoose = require('sequelize')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth')
const eventRoutes = require('./routes/events')
const redis = require('./config/redis')
const sequelize = require('./config/database.js')

const app = express()

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://billund-handelsforening.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(cookieParser())

// Test Redis connection
try {
  await redis.set('test', 'connection')
  const testResult = await redis.get('test')
  if (testResult === 'connection') {
    console.log('✅ Redis forbindelse etableret')
    await redis.del('test')
  }
} catch (error) {
  console.error('❌ Redis forbindelsesfejl:', error)
  process.exit(1)
}

// Test database connection
try {
  await sequelize.authenticate()
  console.log('✅ Database forbindelse etableret')
  
  // Sync models (i development)
  if (process.env.NODE_ENV === 'development') {
    await sequelize.sync({ alter: true })
    console.log('✅ Database modeller synkroniseret')
  }
} catch (error) {
  console.error('❌ Database forbindelsesfejl:', error)
  process.exit(1)
}

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server fejl:', err)
  res.status(500).json({ 
    message: 'Der opstod en fejl på serveren',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server kører på port ${PORT}`)
  console.log(`🌍 Miljø: ${process.env.NODE_ENV}`)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
  process.exit(1)
})

// Add test endpoint
app.get('/api/test', async (req, res) => {
  try {
    await redis.set('test', 'Hello from Redis!')
    const result = await redis.get('test')
    await redis.del('test')
    res.json({ 
      message: 'API og Redis forbindelse OK',
      redisTest: result
    })
  } catch (error) {
    console.error('Test endpoint fejl:', error)
    res.status(500).json({ 
      message: 'Fejl i test endpoint',
      error: error.message
    })
  }
}) 