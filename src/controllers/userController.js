import { eq, desc } from "drizzle-orm"
import { db } from "../db/db.js"
import { userTable } from '../db/schema.js'
import {request, response} from 'express'

/**
 * @param {request} req
 * @param {response} res
 **/
export const getAllUsers = async (req, res) => {
    try {
        const result = await db.select({
            id: userTable.idUser,
            firstName: userTable.firstName,
            name: userTable.name,
            email: userTable.email,
            isAdmin: userTable.isAdmin,
            createdAt: userTable.createdAt
        }).from(userTable).orderBy(desc(userTable.createdAt))
        
        res.status(200).json(result)
    } catch (error) {
        console.error('Get all users error:', error)
        res.status(500).json({
            error: "Failed to fetch users"
        })
    }
}

/**
 * @param {request} req
 * @param {response} res
 **/
export const getUserById = async (req, res) => {
    const { id } = req.params
    try {
        const result = await db.select({
            id: userTable.idUser,
            firstName: userTable.firstName,
            name: userTable.name,
            email: userTable.email,
            isAdmin: userTable.isAdmin,
            createdAt: userTable.createdAt
        }).from(userTable).where(eq(userTable.idUser, id)).limit(1)
        
        if (result.length === 0) {
            return res.status(404).json({
                error: "User not found"
            })
        }
        
        res.status(200).json(result[0])
    } catch (error) {
        console.error('Get user by id error:', error)
        res.status(500).json({
            error: "Failed to fetch user"
        })
    }
}

/**
 * @param {request} req
 * @param {response} res
 **/
export const deleteUserById = async (req, res) => {
    const { id } = req.params
    try {
    
        const user = await db.select().from(userTable).where(eq(userTable.idUser, id)).limit(1)
        
        if (user.length === 0) {
            return res.status(404).json({
                error: "User not found"
            })
        }
        await db.delete(userTable).where(eq(userTable.idUser, id))
        
        res.status(200).json({
            message: "User deleted successfully"
        })
    } catch (error) {
        console.error('Delete user error:', error)
        res.status(500).json({
            error: "Failed to delete user"
        })
    }
}