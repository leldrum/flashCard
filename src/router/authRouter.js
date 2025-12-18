import express from 'express'
import {
  register,
  login,
  getProfile
} from '../controllers/authController.js'
import { authenticateToken } from '../middlewares/auth.js'
import { validateBody } from '../middlewares/validation.js'
import { registerSchema, loginSchema } from '../validations/auth.js'

const router = express.Router()

// Routes publiques
router.post('/register', validateBody(registerSchema), register)
router.post('/login', validateBody(loginSchema), login)

// Routes protégées
router.get('/profile', authenticateToken, getProfile)

export default router
