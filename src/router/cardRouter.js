import {Router} from "express"

import { validateBody } from "../middleware/validation.js"
import { createCardSchema } from "../models/card.js"
import { createCard, getCardById } from "../controllers/cardController.js"

const router = Router()

router.post('/', validateBody(createCardSchema), createCard)
router.get('/:id', getCardById)

export default router