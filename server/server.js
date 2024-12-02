import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.js'
import eventRoutes from './routes/events.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const startServer = async () => {
  try {
    const app = express()

    // Middleware
    app.use(cors({
      origin: ['http://localhost:5173', 'https://vercel-billund-handel.vercel.app'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }))
    app.use(express.json())
    app.use(cookieParser())
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

    // Error handling
    app.use((err, req, res, next) => {
      console.error('Server error:', err)
      res.status(500).json({ 
        message: 'Der skete en fejl!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      })
    })

    // Routes
    app.use('/api/auth', authRoutes)
    app.use('/api/events', eventRoutes)

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`✅ Server kører på port ${PORT}`)
    })
  } catch (err) {
    console.error('❌ Server startup fejl:', err)
    process.exit(1)
  }
}

startServer() 