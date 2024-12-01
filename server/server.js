require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth')
const eventRoutes = require('./routes/events')

const app = express()

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// MongoDB connection med retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    console.log('✅ MongoDB Atlas forbindelse etableret')
  } catch (err) {
    console.error('❌ MongoDB Atlas forbindelsesfejl:', err)
    // Retry connection
    setTimeout(connectDB, 5000)
  }
}

connectDB()

// MongoDB error handling
mongoose.connection.on('error', (err) => {
  console.error('MongoDB forbindelsesfejl:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB forbindelse afbrudt. Forsøger at genoprette...')
  connectDB()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)

// Global error handling
app.use((err, req, res, next) => {
  console.error('Server fejl:', err.stack)
  res.status(500).json({ 
    message: 'Der opstod en fejl på serveren',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
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