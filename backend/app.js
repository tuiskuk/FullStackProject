import express from 'express'
import cors from 'cors'
import recipesRouter from './routes/recipesRouter.js'
import userRouter from './routes/userRouter.js'
import config from './utils/config.js'
import middleware from './utils/middleware.js'
import mongoose from 'mongoose';
mongoose.set('strictQuery', false)


const app = express()
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
}

const url = config.MONGODB_URI

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(express.json())
app.use(middleware.requestLogger)
app.use(cors(corsOptions))
app.use('/api/recipes', recipesRouter)
app.use('/api/users', userRouter)

app.use(middleware.unknownEndpoint)

export default app
