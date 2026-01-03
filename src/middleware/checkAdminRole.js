import { db } from "../db/db.js"
import { userTable } from "../db/schema.js"
import { eq } from "drizzle-orm"

export const checkAdminRole = async (req, res, next) => {
    try {
        const userId = req.user.idUser
        const user = await db.select().from(userTable).where(eq(userTable.idUser, userId)).limit(1)
        
        if (user.length === 0) {
            return res.status(404).json({ error: "User not found" })
        }
        
        if (!user[0].isAdmin) {
            return res.status(403).json({ error: "Admin access required" })
        }
        
        next()
    } catch (error) {
        console.error('Admin role check error:', error)
        res.status(500).json({ error: "Internal server error" })
    }
}