import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d'

export const generateToken = (userId, isAdmin = false) => {
  return jwt.sign(
    { userId, isAdmin },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  )
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Token invalide ou expiré')
  }
}
