import jwt from "jsonwebtoken"
import "dotenv/config"
import { db } from "../db/db.js"
import { userTable } from "../db/schema.js"
import { eq } from "drizzle-orm"

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        return res.status(403).json({error: "Access token required, please login"})
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        
        const [user] = await db.select().from(userTable).where(eq(userTable.idUser, decodedToken.userId)).limit(1)
        
        if (!user) {
            return res.status(401).json({error: "User no longer exists, please register again"})
        }
        
        req.user = { 
            idUser: user.idUser,
            isAdmin: user.isAdmin
        }
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({error: "invalid or expired access token, please login again"})
    }

}