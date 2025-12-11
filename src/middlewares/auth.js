import { verifyToken } from '../utils/jwt.js'

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Token manquant' })
    }

    const payload = verifyToken(token)
    req.userId = payload.userId
    req.isAdmin = payload.isAdmin

    next()
  } catch (error) {
    res.status(401).json({ error: error.message || 'Token invalide' })
  }
}

export const adminMiddleware = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' })
  }
  next()
}
