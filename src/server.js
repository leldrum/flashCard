import express from 'express'

import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'

dotenv.config()
import path from 'path';


const PORT = process.env.PORT || 3000
const app = express()

// Middlewares
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API FlashCards' })
})

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' })
})


app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'src/public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})