import { eq } from "drizzle-orm"
import { db } from "../db/db.js"
import { cardTable, collectionTable, revisionTable } from '../db/schema.js'

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
                .select( {idCollection: collectionTable.idCollection})
                .from(collectionTable)
                .where(eq(collectionTable.title, titleCollection))

        
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

export const getCardById = async (req, res) => {

    try {
        const { id } = req.params;
        const [result] = await db
            .select({ card: cardTable, collection: collectionTable })
            .from(cardTable)
            .leftJoin(collectionTable, eq(cardTable.idCollection, collectionTable.idCollection))
            .where(eq(cardTable.idCard, id))
            .limit(1);

        if (!result) {
            return res.status(404).json({ error: "Card not found" });
        }

        const { card, collection } = result;

        if (collection?.isPrivate) {
            const isOwner = req.user && req.user.idUser === collection.idUser;
            const isAdmin = req.user && req.user.isAdmin === true;
            
            if (!isOwner && !isAdmin) {
                return res.status(403).json({ error: "access denied: private collection" });
            }
        }

        res.status(200).json(card);
    } catch (error) {
        console.error("Error fetching card:", error);
        res.status(500).send({
            error: "failed to fetch card"
        });
    }
}

export const getCardsByCollection = async (req, res) => {
    try {
        const { id } = req.params; 

        if (!id) {
            return res.status(400).json({ error: "idCollection is required" });
        }

        const [collection] = await db
            .select()
            .from(collectionTable)
            .where(eq(collectionTable.idCollection, id))
            .limit(1);

        if (!collection) {
            return res.status(404).json({ error: "Collection not found" });
        }

        if (collection.isPrivate) {
            const isOwner = req.user && req.user.idUser === collection.idUser;
            const isAdmin = req.user && req.user.isAdmin === true;

            if (!isOwner && !isAdmin) {
                return res.status(403).json({ error: "access denied: private collection" });
            }
        }

        const cards = await db
            .select()
            .from(cardTable)
            .where(eq(cardTable.idCollection, id));

        return res.status(200).json(cards);
    } catch (error) {
        console.error("Error fetching cards:", error);
        res.status(500).send({
            error: "failed to fetch cards"
        });
    }
}

export const getCardsToReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.idUser;

        if (!id) {
            return res.status(400).json({ error: "idCollection is required" });
        }

        const [collection] = await db
            .select()
            .from(collectionTable)
            .where(eq(collectionTable.idCollection, id))
            .limit(1);

        if (!collection) {
            return res.status(404).json({ error: "Collection not found" });
        }

         if (collection.isPrivate) {
            const isOwner = req.user && req.user.idUser === collection.idUser;
            const isAdmin = req.user && req.user.isAdmin === true;

            if (!isOwner && !isAdmin) {  
                return res.status(403).json({ error: "access denied: private collection" });
            }
        }

       
        const cards = await db
            .select()
            .from(cardTable)
            .where(eq(cardTable.idCollection, id));

      
        const revisions = await db
            .select()
            .from(revisionTable)
            .where(eq(revisionTable.idUser, userId));

    } catch (error) {
        console.error("Error fetching cards to review:", error);
        res.status(500).send({
            error: "failed to fetch cards to review"
        });
    }
}

export const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "idCard is required" });
        }


        const [cardData] = await db
            .select({ card: cardTable, collection: collectionTable })
            .from(cardTable)
            .leftJoin(collectionTable, eq(cardTable.idCollection, collectionTable.idCollection))
            .where(eq(cardTable.idCard, id))
            .limit(1);

        if (!cardData) {
            return res.status(404).json({ error: "Card not found" });
        }

        const { collection } = cardData;

        const isOwner = req.user && req.user.idUser === collection.idUser;
        const isAdmin = req.user && req.user.isAdmin === true;

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: "access denied: only the collection owner can delete cards" });
        }

        await db
            .delete(cardTable)
            .where(eq(cardTable.idCard, id));

        res.status(200).json({ message: "Card deleted successfully" });
    } catch (error) {
        console.error("Error deleting card:", error);
        res.status(500).send({
            error: "failed to delete card"
        });
    }
}

export const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { frontText, backText, frontUrl, backUrl } = req.body;

        if (!id) {
            return res.status(400).json({ error: "idCard is required" });
        }

        const [cardData] = await db
            .select({ card: cardTable, collection: collectionTable })
            .from(cardTable)
            .leftJoin(collectionTable, eq(cardTable.idCollection, collectionTable.idCollection))
            .where(eq(cardTable.idCard, id))
            .limit(1);

        if (!cardData) {
            return res.status(404).json({ error: "Card not found" });
        }

        const { collection } = cardData;

        const isOwner = req.user && req.user.idUser === collection.idUser;
        const isAdmin = req.user && req.user.isAdmin === true;

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: "access denied: only the collection owner can update cards" });
        }

        const updateData = {};
        if (frontText !== undefined) updateData.frontText = frontText;
        if (backText !== undefined) updateData.backText = backText;
        if (frontUrl !== undefined) updateData.frontUrl = frontUrl || null;
        if (backUrl !== undefined) updateData.backUrl = backUrl || null;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "At least one field is required to update" });
        }

        const result = await db
            .update(cardTable)
            .set(updateData)
            .where(eq(cardTable.idCard, id))
            .returning();

        res.status(200).json(result[0]);
        
    } catch (error) {
        console.error("Error updating card:", error);
        res.status(500).send({
            error: "failed to update card"
        });
    }
}