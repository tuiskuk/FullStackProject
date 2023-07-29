import express from 'express'
import interactionController from '../controllers/interactionController.js'
const interactionRouter = express.Router()

interactionRouter.get('/all', interactionController.getAllInteractionRecipes)
interactionRouter.get('/', interactionController.getAllInteractions)
interactionRouter.get('/userCreated',interactionController.getUserCreatedInteractions)
interactionRouter.post('/', interactionController.createInteraction)
interactionRouter.post('/likes', interactionController.addLikeInteraction)
interactionRouter.delete('/likes', interactionController.removeLikeInteraction)
interactionRouter.post('/dislikes', interactionController.addDislikeInteraction)
interactionRouter.delete('/dislikes', interactionController.removeDislikeInteraction)

export default interactionRouter