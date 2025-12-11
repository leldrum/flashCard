import express from 'express'
import {
  register,
  login,
  getProfile
} from '../controllers/auth.js'
import { authMiddleware } from '../middlewares/auth.js'
import { registerSchema, loginSchema } from '../validations/auth.js'

const router = express.Router()

// Middleware de validation
const validateRequest = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse(req.body)
    req.body = validated
    next()
  } catch (error) {
    res.status(400).json({
      error: 'Données invalides',
      details: error.errors
    })
  }
}

// Routes publiques
router.post('/register', validateRequest(registerSchema), register)
router.post('/login', validateRequest(loginSchema), login)

// Routes protégées
router.get('/profile', authMiddleware, getProfile)

export default router
