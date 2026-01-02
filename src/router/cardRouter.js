import {Router} from "express"

import { validateBody, validateParams } from "../middleware/validation.js"
import { createCardSchema, updateCardSchema, idCardSchema } from "../models/card.js"
import { createCard, getCardById, getCardsByCollection, getCardsToReview, deleteCard, updateCard, reviseCard } from "../controllers/cardController.js"
import { authenticateToken } from "../middleware/authenticateToken.js"

const router = Router()
router.use(authenticateToken)

router.post('/', validateBody(createCardSchema), createCard)
router.post('/:id/revise', validateParams(idCardSchema), reviseCard)
router.get('/collection/:id/review', validateParams(idCardSchema), getCardsToReview)
router.get('/collection/:id', validateParams(idCardSchema), getCardsByCollection)
router.get('/:id', validateParams(idCardSchema), getCardById)
router.patch('/:id', validateBody(updateCardSchema), updateCard)
router.delete('/:id', validateParams(idCardSchema), deleteCard)

export default router