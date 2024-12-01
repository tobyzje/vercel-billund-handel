import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = Router()

// Tilføj denne test route øverst i filen
router.get('/test', async (req, res) => {
  try {
    // Test database forbindelse
    const count = await User.countDocuments()
    res.json({ 
      message: 'API forbindelse OK', 
      databaseStatus: 'Forbundet',
      userCount: count 
    })
  } catch (error) {
    console.error('Test route fejl:', error)
    res.status(500).json({ 
      message: 'Database fejl', 
      error: error.message 
    })
  }
})

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Ugyldig email eller adgangskode' })
    }

    if (!user.active) {
      return res.status(401).json({ message: 'Konto er deaktiveret' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Ugyldig email eller adgangskode' })
    }

    await user.updateLastLogin()

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    })

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin
    }

    res.json({ user: userResponse })
  } catch (error) {
    console.error('Login fejl:', error)
    res.status(500).json({ message: 'Server fejl ved login' })
  }
})

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check om bruger eksisterer
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'Bruger eksisterer allerede' })
    }

    // Opret ny bruger
    user = new User({
      name,
      email,
      password
    })

    await user.save()

    // Generer token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Send token som cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    })

    // Send bruger data
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }

    res.status(201).json({ user: userResponse })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Server fejl' })
  }
})

// Logout route
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  })
  res.json({ message: 'Logget ud' })
})

// Check auth status
router.get('/check', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      
    if (!user) {
      return res.status(401).json({ message: 'Bruger ikke fundet' })
    }

    if (!user.active) {
      return res.status(401).json({ message: 'Konto er deaktiveret' })
    }

    await user.updateLastLogin()

    res.json({ user })
  } catch (error) {
    console.error('Auth check fejl:', error)
    res.status(500).json({ message: 'Server fejl ved auth check' })
  }
})

// Webmaster oprettelse (kun til initial setup - bør fjernes i produktion)
router.post('/create-webmaster', async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    // Check om der allerede findes en webmaster
    const existingWebmaster = await User.findOne({ role: 'webmaster' })
    if (existingWebmaster) {
      return res.status(400).json({ message: 'Der findes allerede en webmaster' })
    }

    // Opret webmaster
    const user = await User.createWebmaster({
      name,
      email,
      password
    })

    res.status(201).json({ 
      message: 'Webmaster bruger oprettet',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Webmaster oprettelse fejl:', error)
    res.status(500).json({ message: 'Server fejl' })
  }
})

// Opdater admin oprettelse til kun at være tilgængelig for webmaster
router.post('/create-admin', auth, async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    // Check om den aktuelle bruger er webmaster
    const currentUser = await User.findById(req.userId)
    if (!currentUser || currentUser.role !== 'webmaster') {
      return res.status(403).json({ message: 'Kun webmaster kan oprette admin-brugere' })
    }

    // Check om bruger eksisterer
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'Bruger eksisterer allerede' })
    }

    // Opret admin bruger
    user = await User.createAdmin({
      name,
      email,
      password
    }, currentUser._id)

    res.status(201).json({ 
      message: 'Admin bruger oprettet',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdBy: currentUser._id
      }
    })
  } catch (error) {
    console.error('Admin oprettelse fejl:', error)
    res.status(500).json({ message: 'Server fejl' })
  }
})

// Opdater eksisterende bruger til webmaster (kun til initial setup - bør fjernes i produktion)
router.post('/upgrade-to-webmaster', async (req, res) => {
  try {
    const { email } = req.body
    
    // Find bruger
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'Bruger ikke fundet' })
    }

    // Opdater til webmaster
    user.role = 'webmaster'
    await user.save()

    res.json({ 
      message: 'Bruger opgraderet til webmaster',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Webmaster opgradering fejl:', error)
    res.status(500).json({ message: 'Server fejl' })
  }
})

export default router 