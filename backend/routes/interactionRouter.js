import express from 'express'
import interactionController from '../controllers/interactionController.js'
const interactionRouter = express.Router()

interactionRouter.get('/likes', interactionController.getAllInteractions)
interactionRouter.post('/', interactionController.createInteraction)
interactionRouter.post('/likes', interactionController.addLikeInteraction)
interactionRouter.delete('/likes', interactionController.removeLikeInteraction)


export default interactionRouter