import { eq, desc, like, and, inArray, not } from "drizzle-orm"
import { db } from "../db/db.js"

import { collectionTable, userTable, cardTable, revisionTable } from '../db/schema.js'
import {request, response} from 'express'

export const getCollectionsByTitle = async (req, res) => {
   try {
        const { title } = req.params;
        const result = await db
            .select()
            .from(collectionTable)
            .where(and(
                eq(collectionTable.isPrivate, false),
                like(collectionTable.title, `%${title}%`)
            ))
            .orderBy(desc(collectionTable.createdAt));

        if (result.length === 0) {
            return res.status(404).json({ error: "no public collections match this title" });
        }
        res.status(200).json(result);
        
    } catch (error) {
        res.status(500).send({
            error : "failed to fetch collections"
        });
    }
}

export const createCollection = async (req, res) => {
    try {
        const { title, description, isPrivate } = req.body;
        const userId = req.user.idUser;
    
        const collectionData = {
            title,
            description: description || "",
            isPrivate: isPrivate ?? false,
            idUser: userId
        };
        
        const [result] = await db.insert(collectionTable).values(collectionData).returning();
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating collection:", error);
        res.status(500).send({
            error: "failed to insert collection"
        });
    } 
}

export const getCollectionById = async (req = request, res = response) => {
    try {
        const { id } = req.params;
      

        const [result] = await db.select().from(collectionTable).where(
            eq(collectionTable.idCollection, id)
        );
        
        if (!result) {
            return res.status(404).json({ error: "collection not found" });
        }

        const collection = result;
        
        if (collection.isPrivate) {
            const userId = req.user.idUser;
            const isAdmin = req.user.isAdmin;
            
            if (collection.idUser !== userId && !isAdmin) {
                return res.status(403).json({ error: "access denied: private collection" });
            }
        }
        res.status(200).json(collection);
    } catch (error) {
        res.status(500).send({
            error: "failed to fetch collection"
        });
    }
};

export const getMineCollections = async (req, res) => {
    try {
        const userId = req.user.idUser;

        const result = await db.select().from(collectionTable).where(
            eq(collectionTable.idUser, userId)
        );
        
        if (result.length === 0) {
            return res.status(200).json({ message: "You have no collection" });
        }
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send({
            error: "failed to fetch user's collections"
        });
    }   
}


export const updateCollection = async (req, res) => {
    try {
        const { id } = req.params;
    

        const [collection] = await db.select().from(collectionTable).where(
            eq(collectionTable.idCollection, id)
        );
        
        if (!collection) {
            return res.status(404).json({ error: "collection not found" });
        }
        

        const isAdmin = req.user.isAdmin;
        const userId = req.user.idUser;

        if (collection.idUser !== userId && !isAdmin) {
            return res.status(403).json({ error: "access denied: you can only update your own collections" });
        }

        const updateData = {};
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.description !== undefined) updateData.description = req.body.description;
        if (req.body.isPrivate !== undefined) updateData.isPrivate = req.body.isPrivate;
        
        //si la collection passe de publique à privée, supprimer les révisions des non-propriétaires/non-admins
        if (req.body.isPrivate === true && collection.isPrivate === false) {
            //récupérer toutes les cartes de cette collection
            const cards = await db.select().from(cardTable).where(
                eq(cardTable.idCollection, id)
            );
            
            if (cards.length > 0) {
                const cardIds = cards.map(card => card.idCard);
                
                //récupérer tous les utilisateurs admins
                const admins = await db.select().from(userTable).where(
                    eq(userTable.isAdmin, true)
                );
                const adminIds = admins.map(admin => admin.idUser);
                
                // Créer la liste des utilisateurs à exclure (propriétaire + admins)
                const excludedUserIds = [collection.idUser, ...adminIds];
                
                //supprimer les révisions pour les utilisateurs qui ne sont ni le propriétaire ni admin
                await db.delete(revisionTable).where(
                    and(
                        inArray(revisionTable.idCard, cardIds),
                        not(inArray(revisionTable.idUser, excludedUserIds))
                    )
                );
            }
        }
        
        const result = await db.update(collectionTable).set(updateData).where(
            eq(collectionTable.idCollection, id)                

        ).returning();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send({
            error: "failed to update the collection"
        });
    }
}

export const deleteCollection = async (req, res) => {   
    try {
        const { id } = req.params;
        const userId = req.user.idUser;

        const [collection] = await db.select().from(collectionTable).where(
            eq(collectionTable.idCollection, id)
        );
        
        if (!collection) {
            return res.status(404).json({ error: "collection not found" });
        }
        
       
        const isAdmin = req.user.isAdmin;
        
        if (collection.idUser !== userId && !isAdmin) {
            return res.status(403).json({ error: "access denied: you can only delete your own collections" });
        }
        
        await db.delete(collectionTable).where(
            eq(collectionTable.idCollection, id)
        );
         res.status(200).json({ message: "Collection deleted successfully" });
    }
    catch (error) {
        res.status(500).send({
            error: "failed to delete the collection"
        });
    }
}



