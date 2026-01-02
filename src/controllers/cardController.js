import { eq, and } from "drizzle-orm"
import { db } from "../db/db.js"
import { cardTable, collectionTable, revisionTable, levelTable} from '../db/schema.js'

export const createCard = async (req, res) => {
    try {
        const { frontText, backText, frontUrl, backUrl, idCollection } = req.body;

        if (!idCollection) {
            return res.status(400).json({ error: "idCollection is required" });
        }

        const [collection] = await db
            .select()
            .from(collectionTable)
            .where(eq(collectionTable.idCollection, idCollection))
            .limit(1);

        if (!collection) {
            return res.status(404).json({ error: "Collection not found" });
        }

        const isOwner = req.user && req.user.idUser === collection.idUser;
        const isAdmin = req.user && req.user.isAdmin === true;

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: "access denied: you must be the owner of the collection" });
        }
    
        const cardData = {
            frontText: frontText,
            backText: backText,
            frontUrl: frontUrl || null,
            backUrl: backUrl || null,
            idCollection: idCollection
        };

        const [result] = await db.insert(cardTable).values(cardData).returning();
        res.status(201).json(result);

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

        if (collection.isPrivate) {
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


        const cardsToReview = [];
        const now = Date.now();

        for (const card of cards) {
            const [revisionData] = await db
                .select({
                    revision: revisionTable,
                    level: levelTable
                })
                .from(revisionTable)
                .leftJoin(levelTable, eq(revisionTable.idLevel, levelTable.idLevel))
                .where(and(eq(revisionTable.idCard, card.idCard), eq(revisionTable.idUser, userId)))
                .limit(1);

           if (revisionData) {
                const delayInDays = parseInt(revisionData.level.delay);
                const delayInMs = delayInDays * 24 * 60 * 60 * 1000;
                const nextRevisionDate = revisionData.revision.lastRevision + delayInMs;

                if (nextRevisionDate <= now) {
                    cardsToReview.push(card);
                }
            }
        }
        if (cardsToReview.length === 0) {
            return res.status(200).json({message: "No cards to review for this collection at the moment"});
        }

        res.status(200).json(cardsToReview);

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

        const [cardData] = await db
            .select({collection: collectionTable })
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


        const [cardData] = await db
            .select({collection: collectionTable })
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

        const [result] = await db
            .update(cardTable)
            .set(updateData)
            .where(eq(cardTable.idCard, id))
            .returning();

        res.status(200).json(result);
        
    } catch (error) {
        console.error("Error updating card:", error);
        res.status(500).send({
            error: "failed to update card"
        });
    }
}

export const reviseCard = async (req, res) => {
    try {
        const { id: cardId } = req.params;
        const userId = req.user.idUser;

        const [card] = await db
            .select()
            .from(cardTable)
            .where(eq(cardTable.idCard, cardId))
            .limit(1);

        if (!card) {
            return res.status(404).json({ error: "Card not found" });
        }

        const [existingRevision] = await db
            .select( { revision: revisionTable, level: levelTable } )
            .from(revisionTable)
            .leftJoin(levelTable, eq(revisionTable.idLevel, levelTable.idLevel))
            .where(and(eq(revisionTable.idCard, cardId), eq(revisionTable.idUser, userId)))
            .limit(1);

        const now = new Date();

        if (existingRevision) {
            const delayInDays = parseInt(existingRevision.level.delay);
            const delayInMs = delayInDays * 24 * 60 * 60 * 1000;
            const nextRevisionDate = new Date(existingRevision.revision.lastRevision).getTime() + delayInMs;

            if (nextRevisionDate > now.getTime()) {
                return res.status(400).json({ 
                    error: "Card is not ready for review yet",
                    nextRevisionDate: new Date(nextRevisionDate)
                });
            }

            const currentLevelNum = parseInt(existingRevision.level.level);
            const nextLevelNum = Math.min(currentLevelNum + 1, 5);
            
            const [nextLevel] = await db
                .select()
                .from(levelTable)
                .where(eq(levelTable.level, nextLevelNum.toString()))
                .limit(1);

            const [updatedRevision] = await db
                .update(revisionTable)
                .set({
                    idLevel: nextLevel.idLevel,
                    lastRevision: now
                })
                .where(eq(revisionTable.idRevision, existingRevision.revision.idRevision))
                .returning();

            return res.status(200).json({
                message: "Card revision updated successfully",
                revision: updatedRevision
            });
        } else {
            const [firstLevel] = await db
                .select()
                .from(levelTable)
                .where(eq(levelTable.level, "1"))
                .limit(1);

            if (!firstLevel) {
                return res.status(404).json({ error: "Level 1 not found in database" });
            }

            const revisionData = {
                idCard: cardId,
                idLevel: firstLevel.idLevel,
                idUser: userId,
                lastRevision: now
            };

            const [newRevision] = await db
                .insert(revisionTable)
                .values(revisionData)
                .returning();

            return res.status(201).json({
                message: "Card revision created successfully",
                revision: newRevision
            });
        }

    } catch (error) {
        console.error("Error revising card:", error);
        res.status(500).send({
            error: "failed to revise card"
        });
    }
}