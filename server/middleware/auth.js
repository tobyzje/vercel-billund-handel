import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ 
        message: 'Ingen token fundet',
        code: 'NO_TOKEN'
      })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.userId = decoded.userId
      next()
    } catch (err) {
      // Token er invalid eller udløbet
      res.clearCookie('token')
      return res.status(401).json({ 
        message: 'Invalid eller udløbet token',
        code: 'INVALID_TOKEN'
      })
    }
  } catch (error) {
    console.error('Auth middleware fejl:', error)
    res.status(500).json({ message: 'Server fejl i auth' })
  }
} 