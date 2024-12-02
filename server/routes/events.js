import { Router } from 'express'
import pool from '../config/database.js'
import auth from '../middleware/auth.js'
import multer from 'multer'
import path from 'path'

// Konfigurer multer til billede upload
const storage = multer.diskStorage({
  destination: 'uploads/events/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

const router = Router()

// Hent alle events
router.get('/', async (req, res) => {
  try {
    const [events] = await pool.query(`
      SELECT e.*, u.name as creatorName 
      FROM events e 
      LEFT JOIN users u ON e.createdBy = u.id 
      ORDER BY e.date ASC
    `)
    res.json(events)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server fejl' })
  }
})

// Opret event
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, date, time, location } = req.body
    const imageUrl = req.file ? `/uploads/events/${req.file.filename}` : null
    const imagePublicId = req.file ? req.file.filename : null

    const [result] = await pool.query(`
      INSERT INTO events (
        id, title, description, date, time, location, 
        imageUrl, imagePublicId, createdBy, createdAt
      ) VALUES (
        UUID(), ?, ?, ?, ?, ?, ?, ?, ?, NOW()
      )
    `, [title, description, date, time, location, imageUrl, imagePublicId, req.userId])

    res.status(201).json({ message: 'Event oprettet' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server fejl' })
  }
})

// Slet event
router.delete('/:id', auth, async (req, res) => {
  try {
    // Tjek om brugeren har rettigheder
    const [users] = await pool.query(
      'SELECT role FROM users WHERE id = ?',
      [req.userId]
    )
    
    if (!users[0] || !['admin', 'webmaster'].includes(users[0].role)) {
      return res.status(403).json({ message: 'Ikke tilladelse' })
    }

    await pool.query('DELETE FROM events WHERE id = ?', [req.params.id])
    res.json({ message: 'Event slettet' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server fejl' })
  }
})

export default router 