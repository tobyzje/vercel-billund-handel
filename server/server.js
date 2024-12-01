import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import sequelize from './config/database.js'
import authRoutes from './routes/auth.js'
import eventRoutes from './routes/events.js'

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

// Database sync
try {
  await sequelize.sync()
  console.log('✅ Database synkroniseret')
} catch (error) {
  console.error('❌ Database sync fejl:', error)
}

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)

// Error handling
app.use((err, req, res, next) => {
  console.error('Server fejl:', err)
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