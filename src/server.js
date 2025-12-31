import express from 'express'


import authRoutes from './router/authRouter.js'
import path from 'path';
import collectionRoutes from './router/collectionRouter.js'
import cardRoutes from './router/cardRouter.js'
import logger from './middleware/logger.js'


const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(logger)

app.use('/users', authRoutes)

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'src/public', 'index.html'));
});

app.use('/collections', collectionRoutes)
app.use('/cards', cardRoutes)



app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})