import express from 'express'
import path from 'path';

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())


app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'src/public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})