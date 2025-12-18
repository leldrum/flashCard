import bcrypt from 'bcrypt'
import { db } from '../db/index.js'
import { usersTable } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Vérifier si l'email existe déjà
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' })
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur
    const userId = randomUUID()
    const newUser = await db
      .insert(usersTable)
      .values({
        id: userId,
        username,
        email,
        password: hashedPassword,
        role: 'user'
      })
      .returning()

    if (newUser.length === 0) {
      return res.status(500).json({ error: 'Erreur lors de la création' })
    }

    // Générer le token
    const token = jwt.sign(
      { userId: newUser[0].id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: newUser[0].id,
        username: newUser[0].username,
        email: newUser[0].email
      },
      token
    })
  } catch (error) {
    console.error('Erreur register:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Récupérer l'utilisateur
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1)

    if (user.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user[0].password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
    }

    // Générer le token
    const token = jwt.sign(
      { userId: user[0].id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    res.json({
      message: 'Connexion réussie',
      userData: {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email
      },
      token
    })
  } catch (error) {
    console.error('Erreur login:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1)

    if (user.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    res.json({
      user: {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        role: user[0].role,
        createdAt: user[0].createdAt
      }
    })
  } catch (error) {
    console.error('Erreur getProfile:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}
