import {Router} from "express"

import { validateBody } from "../middleware/validation.js"
import { createCardSchema } from "../models/card.js"
import { createCard, getCardById, getCardsByCollection } from "../controllers/cardController.js"
import { authenticateToken } from "../middleware/authenticateToken.js"

const router = Router()
router.use(authenticateToken)

router.post('/', validateBody(createCardSchema), createCard)
router.get('/collection/:id', getCardsByCollection)
router.get('/:id', getCardById)

export default router