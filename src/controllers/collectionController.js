import { eq } from "drizzle-orm"
import { db } from "../db/database.js"

import { collectionTable } from '../db/schema.js'
import {request, response} from 'express'

export const getPublicCollections = async (req, res) => {
   try {
    const result = await db.select().from(collectionTable).orderBy('createdAt','desc')
   
    res.status(200).json(result)
   } catch (error) {
    res.status(500).send({
        error : "failed to fetch collections"
    })
   }
}

export const createCollection = async (req, res) => {
    try {
        const result = await db.insert(collectionTable).values(req.body).returning()
        res.status(201).json(result)
       } catch (error) {
        res.status(500).send({
            error : "failed to insert collections"
        })
    } 
}