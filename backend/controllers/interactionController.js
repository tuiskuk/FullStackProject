import { Recipe } from '../models/recipe.js'
import { User } from '../models/user.js'
import mongoose from 'mongoose'
import { recipePictureDeleter } from '../utils/helperFunctions.js'

const createInteraction = async (request, response, next) => {
  try {
    //yield is handled like it is because yield is illegal name
    const { recipeId, label, image, images, recipeYield, url,
      ingredients, creator , instructions, totalTime, mealType,
      dishType, cuisineType, healthLabels
    }  = request.body

    console.log(recipeId)

    //Check that recipe do not already exist
    const searchRecipe = await Recipe.findOne({ recipeId })
    if(searchRecipe && recipeId) {
      return response.status(400).json({ error: 'Recipe already exist' })
    }

    const recipe = new Recipe({ recipeId, label, image, images, yield: recipeYield, url, totalTime,
      ingredients, creator, instructions,  mealType,
      dishType, cuisineType, healthLabels, likes: [], dislikes: [], comments: [] })

    //
    if(creator){
      recipe.recipeId = recipe._id
    }

    const savedRecipe = await recipe.save()

    response.status(201).json({ message: 'Recipe created successfully', savedRecipe })
  } catch (error) {
    next(error)
  }
}

const addLikeInteraction = async (request, response, next) => {
  try {
    const { recipeId, userId } = request.body
    const userIdObject = new mongoose.Types.ObjectId(userId)

    const [currentUser, recipe] = await Promise.all([
      User.findById(userIdObject),
      Recipe.findOne({ recipeId }),
    ])
    console.log(recipe)

    if (!currentUser) {
      return response.status(404).json({ error: 'UserId not found' })
    }

    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    // Check if the user already liked the recipe
    const existingLike = recipe.likes.includes(userIdObject)
    if (existingLike) {
      return response.status(400).json({ error: 'Recipe already liked' })
    }

    // Add the new like to the recipe's likes array
    recipe.likes.push(userIdObject)
    currentUser.likes.push(recipe._id)

    // Save the updated recipe document
    await recipe.save()
    await currentUser.save()

    response.status(201).json({ message: 'Like added' })
  } catch (error) {
    next(error)
  }
}

const removeLikeInteraction = async (request, response, next) => {
  try {
    const { recipeId, userId } = request.body
    const userIdObject = new mongoose.Types.ObjectId(userId)

    const [currentUser, recipe] = await Promise.all([
      User.findById(userIdObject),
      Recipe.findOne({ recipeId }),
    ])

    if (!currentUser) {
      return response.status(404).json({ error: 'UserId not found' })
    }

    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    // Check if the user hasn't liked the recipe
    const existingLike = recipe.likes.includes(userId)
    if (!existingLike) {
      return response.status(400).json({ error: 'Recipe has not been liked' })
    }

    recipe.likes = recipe.likes.filter((user) => !user.equals(userIdObject))
    currentUser.likes = currentUser.likes.filter((like) => !like.equals(recipe._id))

    await recipe.save()
    await currentUser.save()

    response.status(201).json({ message: 'Like removed' })
  } catch (error) {
    next(error)
  }
}

const addDislikeInteraction = async (request, response, next) => {
  try {
    const { recipeId, userId } = request.body
    const userIdObject = new mongoose.Types.ObjectId(userId)

    const [currentUser, recipe] = await Promise.all([
      User.findById(userIdObject),
      Recipe.findOne({ recipeId }),
    ])

    if (!currentUser) {
      return response.status(404).json({ error: 'UserId not found' })
    }

    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    // Check if the user already disliked the recipe
    const existingDislike = recipe.dislikes.includes(userIdObject)
    if (existingDislike) {
      return response.status(400).json({ error: 'Recipe already disliked' })
    }

    // Add the new dislike to the recipe's dislikes array
    recipe.dislikes.push(userIdObject)
    currentUser.dislikes.push(recipe._id)

    // Save the updated recipe document
    await recipe.save()
    await currentUser.save()

    response.status(201).json({ message: 'Dislike added' })
  } catch (error) {
    next(error)
  }
}

const removeDislikeInteraction = async (request, response, next) => {
  try {
    const { recipeId, userId } = request.body
    const userIdObject = new mongoose.Types.ObjectId(userId)

    const [currentUser, recipe] = await Promise.all([
      User.findById(userIdObject),
      Recipe.findOne({ recipeId }),
    ])

    if (!currentUser) {
      return response.status(404).json({ error: 'UserId not found' })
    }

    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    // Check if the user hasn't disliked the recipe
    const existingDislike = recipe.dislikes.includes(userId)
    if (!existingDislike) {
      return response.status(400).json({ error: 'Recipe hasn not been disliked' })
    }

    recipe.dislikes = recipe.dislikes.filter((user) => !user.equals(userIdObject))
    currentUser.dislikes = currentUser.dislikes.filter((dis) => !dis.equals(recipe._id))

    await recipe.save()
    await currentUser.save()

    response.status(201).json({ message: 'Dislike removed' })
  } catch (error) {
    next(error)
  }
}

const getAllInteractions = async (request, response, next) => {
  try {
    const { recipeId } = request.query

    const recipe = await Recipe.findOne({ recipeId })


    // If recipe is not found, return empty
    if (!recipe) {
      return response.status(204).json({ recipe })
    }

    response.status(200).json({ recipe })
  } catch (error) {
    next(error)
  }
}

const getAllInteractionRecipes = async (request, response, next) => {
  try {
    const recipes = await Recipe.find().populate('creator')
    // If no recipes found, return empty
    if (!recipes) {
      return response.status(204).json()
    }

    response.status(200).json(recipes)
  } catch (error) {
    next(error)
  }
}

const getAllUserCreatedInteractions = async (request, response, next) => {
  try {
    const { search: searchTerm, time, ingr,
      healthFilters = [], mealTypeOptions = [], excludedFilters = [],
      cuisineTypeOptions = [], dishOptions = []  } = request.query

    console.log( searchTerm, time, ingr, healthFilters, cuisineTypeOptions, mealTypeOptions, excludedFilters, cuisineTypeOptions, dishOptions)

    //only user created recipes
    let conditions = [{ creator: { $ne: null } }]

    //filter by search term
    if (searchTerm) {
      conditions.push({ label: { $regex: searchTerm.trim(), $options: 'i' } })
    }

    //filter by amount of ingredients
    if (ingr.includes('-')) {
      conditions.push({
        $expr: {
          $and: [
            { $gte: [{ $size: '$ingredients' }, parseInt(ingr.split('-')[0], 10)] },
            { $lte: [{ $size: '$ingredients' }, parseInt(ingr.split('-')[1], 10)] }
          ]
        }
      })
    } else if (ingr.includes('+')) {
      conditions.push({
        $expr: {
          $gte: [{ $size: '$ingredients' }, parseInt(ingr.split('+')[0], 10)]
        }
      })
    } else if (ingr) {
      conditions.push({
        $expr: {
          $lte: [{ $size: '$ingredients' }, parseInt(ingr, 10)],
        }
      })
    }

    //filter by time
    if (time.includes('-')) {
      conditions.push({
        totalTime: {
          $gte: parseInt(time.split('-')[0], 10),
          $lte: parseInt(time.split('-')[1], 10)
        }
      })
    } else if (time.includes('+')) {
      conditions.push({
        totalTime: {
          $gte: parseInt(time.split('+')[0], 10)
        }
      })
    } else if (time) {
      conditions.push({
        totalTime: {
          $lte: parseInt(time, 10)
        }
      })
    }

    //filter by mealtypes
    if (mealTypeOptions) {
      const optionsArray = mealTypeOptions.split(',').map((filter) => filter.trim())
      conditions.push({
        mealType: { $in: optionsArray }
      })
    }

    //filter by cuisine types
    if (cuisineTypeOptions) {
      const cuisinesArray = cuisineTypeOptions.split(',').map((filter) => filter.trim())
      conditions.push({
        cuisineType: { $in: cuisinesArray }
      })
    }

    //filter by dish type
    if (dishOptions) {
      const dishOptionsArray = dishOptions.split(',').map((filter) => filter.trim())
      conditions.push({
        dishType: { $in: dishOptionsArray }
      })
    }

    //filter by health/allergies
    if (healthFilters) {
      const healthFiltersArray = healthFilters.split(',').map((filter) => filter.trim())
      conditions.push({
        healthLabels: { $all: healthFiltersArray }
      })
    }

    // Filter out recipes based on excluded filters
    console.log(excludedFilters, typeof(excludedFilters))
    if (excludedFilters) {
      const excludedFiltersRegex = excludedFilters.split(',').map(filter => new RegExp(filter.trim(), 'i'))

      //filter out by label
      conditions.push({
        label: {
          $not: {
            $in: excludedFiltersRegex
          }
        }
      })

      //filter out by text of ingredients
      conditions.push({
        'ingredients.text': {
          $not: {
            $in: excludedFiltersRegex
          }
        }
      })
    }

    console.log(conditions)
    const recipes = await Recipe.find({ $and: conditions }).populate('creator')
    console.log(recipes)
    // If no recipes found, return empty
    if (!recipes) {
      return response.status(204).json()
    }

    response.status(200).json(recipes)
    console.log('success')
  } catch (error) {
    next(error)
  }
}

const getAllSpecificUserCreatedRecipes = async (request, response, next) => {
  try {
    const { userId } = request.query
    console.log(userId)
    const recipes = await Recipe.find({ creator: userId }).populate('creator')
    // If no recipes found, return empty
    if (!recipes) {
      return response.status(204).json()
    }

    response.status(200).json(recipes)
  } catch (error) {
    next(error)
  }
}
const deleteSpecificUserCreatedRecipe = async (request, response, next) => {
  try {
    const { userId, recipeId } = request.query
    // Find the specific recipe by creator and recipeId
    const recipeTodelete = await Recipe.findOne({ creator: userId, recipeId })

    // Check if a recipe exists
    if (!recipeTodelete) {
      return response.status(404).json({ message: 'Recipe not found' })
    }

    //delete recipe and its pictures from image folder
    recipePictureDeleter(recipeTodelete?.images)
    await recipeTodelete.deleteOne()
    console.log('recipe deleted')

    response.status(200).json({ message: 'Recipe deleted successfully' })
  } catch (error) {
    next(error)
  }
}

const updateSpecificUserCreatedRecipe = async (request, response, next) => {
  const { recipeId, ...updateFields } = request.body // Assuming recipeId is passed as a URL parameter
  console.log('inside update', updateFields)

  try {
    // Check if the recipe exists
    const existingRecipe = await Recipe.findById(recipeId)
    if (!existingRecipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    // Update the recipe fields
    Object.assign(existingRecipe, updateFields)

    // Save the updated recipe
    const savedRecipe = await existingRecipe.save()

    response.json(savedRecipe) // Respond with the updated recipe
  } catch (error) {
    next(error) // Pass the error to the error handling middleware
  }
}



export default { createInteraction, addLikeInteraction, removeLikeInteraction, addDislikeInteraction, removeDislikeInteraction, getAllInteractions, getAllInteractionRecipes, getAllUserCreatedInteractions, getAllSpecificUserCreatedRecipes, deleteSpecificUserCreatedRecipe, updateSpecificUserCreatedRecipe }
