import { eq, desc } from "drizzle-orm"
import { db } from "../db/db.js"
import { cardTable, collectionTable } from '../db/schema.js'
import {request, response} from 'express'

export const createCard = async (req, res) => {
    try {
        const { frontText, backText, frontUrl, backUrl, titleCollection } = req.body;

        if (!frontText) {
            return res.status(400).json({ error: "frontText is required" });
        }
        if (!backText) {
            return res.status(400).json({ error: "backText is required" });
        }
        if (!titleCollection) {
            return res.status(400).json({ error: "titleCollection is required" });
        }

        const idCollect = await db
                .select(collectionTable.idCollection)
                .from(collectionTable)
                .where(eq(collectionTable.title, titleCollection))
                .limit(1);
        
        if (idCollect.length === 0) {
            return res.status(404).json({ error: "Collection not found" });
        }
    
        const cardData = {
            frontText:frontText,
            backText: backText ,
            frontUrl: frontUrl || null,
            backUrl: backUrl || null,
            idCollection: idCollect[0].idCollection
        };
        
        const result = await db.insert(cardTable).values(cardData).returning();
        res.status(201).json(result[0]);
    } catch (error) {
        console.error("Error creating card:", error);
        res.status(500).send({
            error: "failed to insert card"
        });
    } 
}