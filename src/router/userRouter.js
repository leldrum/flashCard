import { Router } from "express"
import { getAllUsers, getUserById, deleteUserById } from "../controllers/userController.js"
import { validateParams } from "../middleware/validation.js"
import { userIdSchema } from "../models/user.js"
import { authenticateToken } from "../middleware/authenticateToken.js"
import { checkAdminRole } from "../middleware/checkAdminRole.js"

const router = Router()


router.use(authenticateToken)
router.use(checkAdminRole)


router.get('/', getAllUsers)
router.get('/:id', validateParams(userIdSchema), getUserById)
router.delete('/:id', validateParams(userIdSchema), deleteUserById)


export default router