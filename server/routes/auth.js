import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/database.js'
import auth from '../middleware/auth.js'

const router = Router()

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    console.log('Login attempt:', { email })
    
    // Tjek om brugeren findes
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND active = 1',
      [email]
    )
    console.log('Found users:', users.length)
    
    if (users.length === 0) {
      console.log('No user found with email:', email)
      return res.status(401).json({ message: 'Ugyldig email eller password' })
    }

    const user = users[0]
    console.log('Found user:', { id: user.id, name: user.name, role: user.role })

    // Tjek password
    const validPassword = await bcrypt.compare(password, user.password)
    console.log('Password valid:', validPassword)
    
    if (!validPassword) {
      console.log('Invalid password for user:', email)
      return res.status(401).json({ message: 'Ugyldig email eller password' })
    }

    // Opdater lastLogin
    await pool.query(
      'UPDATE users SET lastLogin = NOW() WHERE id = ?',
      [user.id]
    )

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    })

    console.log('Login successful for user:', email)
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server fejl', error: err.message })
  }
})

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email er allerede i brug' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const [result] = await pool.query(
      `INSERT INTO users (id, name, email, password, role, active, createdAt) 
       VALUES (UUID(), ?, ?, ?, 'user', 1, NOW())`,
      [name, email, hashedPassword]
    )

    res.status(201).json({ message: 'Bruger oprettet' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server fejl' })
  }
})

// Get current user
router.get('/me', async (req, res) => {
  try {
    // Tjek token fra cookie
    const token = req.cookies.token
    
    if (!token) {
      return res.status(401).json({ message: 'Ikke logget ind' })
    }

    try {
      // Verificer token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Hent bruger fra database
      const [users] = await pool.query(
        'SELECT id, name, email, role FROM users WHERE id = ? AND active = 1',
        [decoded.userId]
      )
      
      if (users.length === 0) {
        return res.status(404).json({ message: 'Bruger ikke fundet' })
      }

      res.json({ user: users[0] })
    } catch (err) {
      console.log('Token verification failed:', err.message)
      return res.status(401).json({ message: 'Ugyldig token' })
    }
  } catch (err) {
    console.error('Get current user error:', err)
    res.status(500).json({ message: 'Server fejl' })
  }
})

// Logout
router.post('/logout', auth, (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logget ud' })
})

export default router 