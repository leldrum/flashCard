import express from 'express'
import path from 'path';
import collectionRoutes from './router/collectionRouter.js'

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())


app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'src/public', 'index.html'));
});

app.use('/collections', collectionRoutes)

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})