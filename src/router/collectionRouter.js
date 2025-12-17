import {Router} from "express"
import {getPublicCollections, getPrivateCollections, getCollection, createCollection, updateCollection, deleteCollection} from "../controllers/collectionController.js"
import { validateBody } from "../middleware/validation.js"
import { createCollectionSchema } from "../models/collection.js"

const router = Router()

router.get('/:title', getPublicCollections)

router.get('/:id', getCollection)
router.get('/user', getPrivateCollections)

router.post('/', validateBody(createCollectionSchema), createCollection)
router.put('/:id', updateCollection)
router.delete('/:id', deleteCollection)

export default router