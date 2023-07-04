import express from 'express'
import cors from 'cors'
import recipesRouter from './routes/recipesRouter.js'

const app = express()
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
}

app.use(cors(corsOptions))
app.use('/api/recipes', recipesRouter)

export default app
