import { eq, desc } from "drizzle-orm"
import { db } from "../db/db.js"

import { collectionTable } from '../db/schema.js'
import {request, response} from 'express'

export const getPublicCollections = async (req, res) => {
   try {
     const { title } = req.params;
     if (!title) {
        return res.status(400).json({ error: "title param is required" });
     }
     const result = await db
        .select()
        .from(collectionTable)
        .where(eq(collectionTable.isPrivate, false))
        .orderBy(desc(collectionTable.createdAt));

    const filtered = title
        ? result.filter((c) => c.title?.toLowerCase().includes(title.toLowerCase()))
        : result;
    if (!filtered.length) {
        return res.status(404).json({ error: "no public collections match this title" });
    }
    res.status(200).json(filtered)
    
   } catch (error) {
    res.status(500).send({
        error : "failed to fetch collections"
    })
   }
}

export const createCollection = async (req, res) => {
    try {
        const { title, description, isPrivate, idUser } = req.body;
        if (!title) {
            return res.status(400).json({ error: "title is required" });
        }
        
        if (!idUser) {
            return res.status(400).json({ error: "idUser is required" });
        }
        
        const collectionData = {
            title,
            description: description || "",
            isPrivate: isPrivate,
            idUser: idUser
        };
        
        const result = await db.insert(collectionTable).values(collectionData).returning();
        res.status(201).json(result[0]);
    } catch (error) {
        console.error("Error creating collection:", error);
        res.status(500).send({
            error: "failed to insert collection"
        });
    } 
}

export const getCollection = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const result = await db.select().from(collectionTable).where(
            eq(collectionTable.idCollection, id)
        );
        
        if (!result.length) {
            return res.status(404).json({ error: "collection not found" });
        }

        const collection = result[0];
        
        if (collection.isPrivate) {
            const userId = req.user?.idUser;
            const isAdmin = req.user?.isAdmin;
            
            if (!userId || (collection.idUser !== userId && !isAdmin)) {
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

export const getPrivateCollections = async (req, res) => {
    try {
        const userId = req.user.idUser;
        const result = await db.select().from(collectionTable).where(
            eq(collectionTable.idUser, userId)
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send({
            error: "failed to fetch user's collections"
        });
    }   
}


export const updateCollection = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.update(collectionTable).set(req.body).where(
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
    const { id } = req.params;
    try {
        await db.delete(collectionTable).where(
            eq(collectionTable.idCollection, id)
        );
        res.status(204).send();
    }
    catch (error) {
        res.status(500).send({
            error: "failed to delete the collection"
        });
    }
}



