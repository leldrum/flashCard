import bcrypt from 'bcrypt'
import { db } from '../db/db.js'
import { userTable } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import "dotenv/config"

export const register = async (req, res) => {
  try {
    const { firstName, name, email, password } = req.body

    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = await db
      .insert(userTable)
      .values({
        firstName: firstName,
        name: name,
        email: email,
        password: hashedPassword,
        role: 'user'
      })
      .returning()

    if (newUser.length === 0) {
      return res.status(500).json({ error: 'Erreur lors de la création' })
    }

    const token = jwt.sign({
      userId: newUser.id,
      }, process.env.JWT_SECRET,
      {expiresIn: "24h"}
    )

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: newUser,
      token: token
    })
  } catch (error) {
    console.error('Erreur register:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1)

    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if(!isValidPassword){
        return res.status(401).json({error: 'Invalid email or password'})
    }

    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})

    res.json({
      message: 'Connexion réussie',
      userData: {
        id: user.id,
        firstName: user.firstName,
        name: user.name,
        email: user.email
      },
      token
    })
  } catch (error) {
    console.error('Erreur login:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}
