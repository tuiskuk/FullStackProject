import express from 'express'
import cors from 'cors'
import recipesRouter from './routes/recipesRouter.js'

const app = express()

app.use(cors())
app.use('/api/recipes', recipesRouter)

export default app;
