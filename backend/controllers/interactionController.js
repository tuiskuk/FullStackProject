import { Recipe } from '../models/recipe.js'

const createInteraction = async (request, response) => {
  try {
    const { recipeId, likes, dislikes, comments } = request.body

    const reciepe = new Recipe({ recipeId, likes, dislikes, comments })

    const savedRecipe = await reciepe.save()

    response.status(201).json(savedRecipe)
  } catch (error) {
    console.log('creating interaction failed')
  }
}

export default { createInteraction }
