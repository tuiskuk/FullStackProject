import express from 'express'
import userCreatedrecipesController from '../controllers/userCreatedrecipesController.js'
const userCreatedrecipesRouter = express.Router()

userCreatedrecipesRouter.post('/in',userCreatedrecipesController.addIngredient)
userCreatedrecipesRouter.post('/like',userCreatedrecipesController.addLike)
userCreatedrecipesRouter.post('/dislike',userCreatedrecipesController.addDislike)
userCreatedrecipesRouter.delete('/dislike',userCreatedrecipesController.deleteDislike)
userCreatedrecipesRouter.delete('/like',userCreatedrecipesController.deleteLike)
userCreatedrecipesRouter.get('/', userCreatedrecipesController.getrecipes)
userCreatedrecipesRouter.get('/:recipeId', userCreatedrecipesController.getRecipe)
userCreatedrecipesRouter.delete('/:recipeId',userCreatedrecipesController.deleteRecipe)
userCreatedrecipesRouter.post('/',userCreatedrecipesController.createRecipe)

export default userCreatedrecipesRouter