import express from 'express'
import userCreatedrecipesController from '../controllers/userCreatedrecipesController.js'
const userCreatedrecipesRouter = express.Router()


userCreatedrecipesRouter.get('/', userCreatedrecipesController.getrecipes)
userCreatedrecipesRouter.get('/:recipeId', userCreatedrecipesController.getRecipe)
userCreatedrecipesRouter.delete('/:recipeId',userCreatedrecipesController.deleteRecipe)
userCreatedrecipesRouter.post('/',userCreatedrecipesController.createRecipe)


export default userCreatedrecipesRouter