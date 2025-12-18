import express from 'express'


import authRoutes from './router/authRouter.js'
import path from 'path';
import collectionRoutes from './router/collectionRouter.js'


const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())

app.use('/users', authRoutes)

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'src/public', 'index.html'));
});

app.use('/collections', collectionRoutes)

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})