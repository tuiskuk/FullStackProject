import express from 'express'
import cors from 'cors'
import recipesRouter from './routes/recipesRouter.js'
import userRouter from './routes/userRouter.js'
import loginRouter from './routes/loginRouter.js'
import confirmEmailRouter from './routes/confirmEmailRouter.js'
import userCreatedrecipesRouter from './routes/userCreatedrecipesRouter.js'
import interactionRouter from './routes/interactionRouter.js'
import commentRouter from './routes/commentRouter.js'
import config from './utils/config.js'
import middleware from './utils/middleware.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
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

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(middleware.requestLogger)
app.use('/api/register',confirmEmailRouter)
app.use('/api/recipes', recipesRouter)
app.use('/api/userrecipes', userCreatedrecipesRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/interactions', interactionRouter)
app.use('/api/comments', commentRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)



export default app
