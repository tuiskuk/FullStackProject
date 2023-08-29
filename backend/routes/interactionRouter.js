import express from 'express'
import interactionController from '../controllers/interactionController.js'
const interactionRouter = express.Router()

interactionRouter.get('/all', interactionController.getAllInteractionRecipes)
interactionRouter.get('/all/userCreated',interactionController.getAllUserCreatedInteractions)
interactionRouter.get('/all/specificUserCreated',interactionController.getAllSpecificUserCreatedRecipes)
interactionRouter.put('/all/specificUserCreated',interactionController.updateSpecificUserCreatedRecipe)
interactionRouter.get('/', interactionController.getAllInteractions)
interactionRouter.post('/', interactionController.createInteraction)
interactionRouter.post('/likes', interactionController.addLikeInteraction)
interactionRouter.delete('/likes', interactionController.removeLikeInteraction)
interactionRouter.post('/dislikes', interactionController.addDislikeInteraction)
interactionRouter.delete('/dislikes', interactionController.removeDislikeInteraction)
interactionRouter.delete('/all/specificUserCreated',interactionController.deleteSpecificUserCreatedRecipe)

export default interactionRouter