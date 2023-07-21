import { UserRecipe } from '../models/useCreatedreceipe.js'


const getrecipes = async (request, response, next) => {
  try {
    const recipes = await UserRecipe.find({}).populate('creator')
    response.json(recipes)
  } catch (error) {
    next(error)
  }
}

const getRecipe = async (request, response, next) => {
  try {
    console.log(request.params)
    const { recipeId } = request.params
    const recipe = await UserRecipe.findById(recipeId).populate('creator')

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

  const addImageToRecipe = async (recipeId, imageUrl, next) => {
    try {
        const recipe = await UserRecipe.findById(recipeId);
        if (!recipe) {
        throw new Error('Recipe not found');
        }

        // Add the new image URL to the images array
        recipe.images.push(imageUrl);

        // Save the updated recipe
        const updatedRecipe = await recipe.save();

        return updatedRecipe;
    } catch (error) {
        next(error)
    }
  };

// Function to add a like
const addLike = async (request, response, next) => {
  try {
    const { userId, recipeId } = request.body
    const recipe = await UserRecipe.findById(recipeId).populate('creator')
    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    if (!recipe.likes.includes(userId)) {
      recipe.likes.push(userId)
      await recipe.save()
    }

    return response.status(200).json(recipe)
  } catch (error) {
    next(error)
  }
}

// Function to delete a like
const deleteLike = async (request, response, next) => {
  try {
    console.log('delete funktion entered')
    const { userId, recipeId } = request.body
    const recipe = await UserRecipe.findById(recipeId).populate('creator')
    console.log(recipeId + ' . ' + userId)
    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    console.log('index reached')
    const index = recipe.likes.indexOf(userId)
    if (index !== -1) {
      recipe.likes.splice(index, 1)
      await recipe.save()
    }

    return response.status(200).json(recipe)
  } catch (error) {
    next(error)
  }
}

// Function to add a dislike
const addDislike = async (request, response, next) => {
  try {
    const { userId, recipeId  } = request.body
    console.log(recipeId + ' . ' + userId)
    const recipe = await UserRecipe.findById(recipeId).populate('creator')
    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    if (!recipe.dislikes.includes(userId)) {
      recipe.dislikes.push(userId)
      await recipe.save()
    }

    return response.status(200).json(recipe)
  } catch (error) {
    next(error)
  }
}

// Function to delete a dislike
const deleteDislike = async (request, response, next) => {
  try {
    const { userId, recipeId } = request.body
    const recipe = await UserRecipe.findById(recipeId).populate('creator')
    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    const index = recipe.dislikes.indexOf(userId)
    if (index !== -1) {
      recipe.dislikes.splice(index, 1)
      await recipe.save()
    }

    return response.status(200).json(recipe)
  } catch (error) {
    next(error)
  }
}

const addIngredient = async (request, response, next) => {
  try {
    const { recipeId, dataToInsert } = request.body
    const recipe = await UserRecipe.findById(recipeId)
    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    for (let i = 0; i < dataToInsert.length; i++) {
      const ingredient = dataToInsert[i]
      recipe.ingredients.push(ingredient)
    }
    await recipe.save()

    return response.status(200).json(recipe)
  } catch (error) {
    next(error)
  }
}




export default {
  getRecipe, getrecipes, deleteRecipe,
  createRecipe, addImageToRecipe, addLike,
  addDislike, deleteDislike, deleteLike, addIngredient
}
