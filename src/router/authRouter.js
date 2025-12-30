import Router from 'express'
import {
  register,
  login,
} from '../controllers/authController.js'
import { validateBody } from '../middleware/validation.js'
import { loginSchema, registerSchema } from "../models/auth.js"

const router = Router()


router.post('/register', validateBody(registerSchema), register)
router.post('/login', validateBody(loginSchema), login)



export default router
