import {Router} from "express"
import {getCollectionsByTitle, getCollectionById, createCollection, updateCollection, deleteCollection, getMineCollections} from "../controllers/collectionController.js"
import { validateBody, validateParams, validateCollectionTitle } from "../middleware/validation.js"
import { createCollectionSchema , updateCollectionSchema, idCollectionSchema, titleCollectionSchema} from "../models/collection.js"
import { authenticateToken } from "../middleware/authenticateToken.js"

const router = Router()



router.use(authenticateToken)
router.get('/mine', getMineCollections)
router.get('/:id', validateParams(idCollectionSchema), getCollectionById)
router.get('/search/:title',validateCollectionTitle(titleCollectionSchema), getCollectionsByTitle)
router.post('/', validateBody(createCollectionSchema), createCollection)
router.put('/:id',validateBody(updateCollectionSchema), updateCollection)
router.delete('/:id', validateParams(idCollectionSchema),deleteCollection)


export default router