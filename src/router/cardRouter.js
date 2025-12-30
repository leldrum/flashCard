import {Router} from "express"

import { validateBody } from "../middleware/validation.js"
import { createCardSchema, updateCardSchema } from "../models/card.js"
import { createCard, getCardById, getCardsByCollection, getCardsToReview, deleteCard, updateCard } from "../controllers/cardController.js"
import { authenticateToken } from "../middleware/authenticateToken.js"

const router = Router()
router.use(authenticateToken)

router.post('/', validateBody(createCardSchema), createCard)
router.get('/collection/:id/review', getCardsToReview)
router.get('/collection/:id', getCardsByCollection)
router.get('/:id', getCardById)
router.patch('/:id', validateBody(updateCardSchema), updateCard)
router.delete('/:id', deleteCard)

export default router