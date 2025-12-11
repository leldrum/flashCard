import {Router} from "express"
import {getPublicCollections, getUserCollections, getCollection, createCollection} from "../controllers/collectionController.js"
import { createCollectionSchema } from "../models/collection.js"

const router = Router()

router.get('/:id', getCollection)
router.get('/', getPublicCollections)
router.get('/user', getUserCollections)
router.post('/', validateBody(createCollectionSchema), createCollection)

export default router