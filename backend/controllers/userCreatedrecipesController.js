import { UserRecipe } from '../models/useCreatedreceipe.js'


const getrecipes = async (request, response, next) => {
  try {
    const recipes = await UserRecipe.find({})
    response.json(recipes)
  } catch (error) {
    next(error)
  }
}

const getRecipe = async (request, response, next) => {
  try {
    console.log(request.params)
    const { recipeId } = request.params
    const recipe = await UserRecipe.findById(recipeId)

    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    response.json(recipe)
  } catch (error) {
    next(error)
  }
}

const deleteRecipe = async (request, response, next) => {
  try {
    const { recipeId } = request.params
    const deletedUser = await UserRecipe.findByIdAndDelete(recipeId)

    if (!deletedUser) {
      return response.status(404).json({ error: 'recipe not found' })
    }

    response.json({ message: 'recipe deleted successfully' })
  } catch (error) {
    next(error)
  }
}

const createRecipe = async (request, response, next) => {
  console.log('create enered')
  try {
    const {
      creator,
      label,
      instructions,
      ingredientLines,
      totalTime,
      mealType,
      cuisineType,
      dishType,
      calories,
      cautions,
      healthLabels,
      image,
      images,
      ingredients,
      dietLabels,
      totalNutrients,
      likes,
      dislikes,
      comments
    } = request.body



    console.log('request body success')

    const reciepe = new UserRecipe({
      creator,
      instructions,
      calories,
      cautions,
      cuisineType,
      dietLabels,
      dishType,
      healthLabels,
      image,
      images,
      ingredientLines,
      ingredients,
      label,
      mealType,
      totalNutrients,
      totalTime,
      likes,
      dislikes,
      comments
    })

    console.log('recipe Created')

    const savedRecipe = await reciepe.save()
    console.log('recipe saved')

    response.status(201).json(savedRecipe)
  } catch (error) {
    next(error)
  }
}

export default {
  getRecipe, getrecipes, deleteRecipe, createRecipe
}
