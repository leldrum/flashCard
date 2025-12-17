import jwt from 'jsonwebtoken'
import { db } from '../db/index.js'
import { usersTable } from '../db/schema.js'
import { eq } from 'drizzle-orm'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(403).json({ error: 'Access token required' })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    const userId = decodedToken.userId
    req.user = { userId }
    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({ error: 'Invalid or expired access token' })
  }
}

export const checkAdminRole = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1)

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (user[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    next()
  } catch (error) {
    console.error('Admin role check error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
