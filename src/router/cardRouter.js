import {Router} from "express"

import { validateBody } from "../middleware/validation.js"
import { createCardSchema } from "../models/card.js"
import { createCard } from "../controllers/cardController.js"

const router = Router()

router.post('/', validateBody(createCardSchema), createCard)

export default router