import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  try {
    const token = req.cookies.token
    
    if (!token) {
      console.log('No token found')
      return res.status(401).json({ message: 'Ingen token fundet' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.userId = decoded.userId
      next()
    } catch (err) {
      console.log('Token verification failed:', err.message)
      return res.status(401).json({ message: 'Ugyldig token' })
    }
  } catch (err) {
    console.error('Auth middleware error:', err)
    res.status(500).json({ message: 'Server fejl' })
  }
} 