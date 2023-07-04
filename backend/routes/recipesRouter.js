import express from 'express';
import recipeController from '../controllers/recipeController.js';
const recipesRouter = express.Router();


recipesRouter.get('/', recipeController.getRecipes)

recipesRouter.get('/link', recipeController.getLink)

export default recipesRouter;