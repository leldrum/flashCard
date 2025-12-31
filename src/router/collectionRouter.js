import {Router} from "express"
import {getCollectionsByTitle, getCollectionById, createCollection, updateCollection, deleteCollection, getMineCollections} from "../controllers/collectionController.js"
import { validateBody } from "../middleware/validation.js"
import { createCollectionSchema , updateCollectionSchema} from "../models/collection.js"
import { authenticateToken } from "../middleware/authenticateToken.js"

const router = Router()
router.use(authenticateToken)

router.get('/search/:title', getCollectionsByTitle)
router.get('/mine', getMineCollections)

router.get('/:id', getCollectionById)

router.post('/', validateBody(createCollectionSchema), createCollection)
router.patch('/:id', validateBody(updateCollectionSchema), updateCollection)
router.delete('/:id', deleteCollection)


export default router