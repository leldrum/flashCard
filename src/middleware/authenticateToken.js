import jwt from "jsonwebtoken"
import "dotenv/config"

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        return res.status(403).json({error: "Access token required"})
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decodedToken.userId
        req.user = { userId}
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({error: "invalid or expired acces token"})
    }

}