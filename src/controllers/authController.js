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
      return res.status(409).json({ error: 'This email is already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const [newUser] = await db
      .insert(userTable)
      .values({
        firstName: firstName,
        name: name,
        email: email,
        password: hashedPassword
      })
      .returning()

    if (!newUser) {
      return res.status(500).json({ error: 'Error during account creation' })
    }

    const token = jwt.sign({
      userId: newUser.idUser,
      isAdmin: newUser.isAdmin
      }, process.env.JWT_SECRET,
      {expiresIn: "24h"}
    )

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
      token: token
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Server error' })
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
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if(!isValidPassword){
        return res.status(401).json({error: 'Invalid email or password'})
    }

    const token = jwt.sign({
      userId: user.idUser,
      isAdmin: user.isAdmin
    }, process.env.JWT_SECRET, {expiresIn: '24h'})

    res.json({
      message: 'Login successful',
      userData: {
        idUser: user.idUser,
        firstName: user.firstName,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.idUser

    const [user] = await db
      .select({
        idUser: userTable.idUser,
        firstName: userTable.firstName,
        name: userTable.name,
        email: userTable.email,
        isAdmin: userTable.isAdmin,
        createdAt: userTable.createdAt
      })
      .from(userTable)
      .where(eq(userTable.idUser, userId))
      .limit(1)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}
