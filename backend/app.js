import express from 'express'
import cors from 'cors'
import recipesRouter from './routes/recipesRouter.js'
import userRouter from './routes/userRouter.js'
import loginRouter from './routes/loginRouter.js'
import confirmEmailRouter from './routes/confirmEmailRouter.js'
import interactionRouter from './routes/interactionRouter.js'
import commentRouter from './routes/commentRouter.js'
import pictureRouter from './routes/pictureRouter.js'
import resetDataBaseRouter from './routes/resetDataBaseRouter.js'
import config from './utils/config.js'
import middleware from './utils/middleware.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
mongoose.set('strictQuery', false)


const app = express()


//little manipulation to avoid harcoded path to images folder
//in order to make it possible for everybody to use this
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
}

app.use(cors(corsOptions))

//allow requests under images folder to return picctures
app.use('/images', express.static(join(__dirname, 'images')))



const url = config.MONGODB_URI

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


app.use(express.json())
app.use(cookieParser())
app.use(middleware.requestLogger)
app.use('/api/register',confirmEmailRouter)
app.use('/api/recipes', recipesRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/interactions', interactionRouter)
app.use('/api/comments', commentRouter)
app.use('/api',pictureRouter)
app.use('/api/reset',resetDataBaseRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)



export default app
