import express from 'express'
import resetDatabase from '../controllers/resetDatabaseController.js'

const resetDataBaseRouter = express.Router()


resetDataBaseRouter.get('/', resetDatabase)


export default resetDataBaseRouter