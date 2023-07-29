import { Recipe } from '../models/recipe.js'
import { User } from '../models/user.js'
import mongoose from 'mongoose'

const createInteraction = async (request, response, next) => {
  console.log('create interaction')
  try {
    const {
      recipeId,
      label,
      image,
      images,
      healthLabels,
      ingredients,
      creator,
      instructions,
      totalTime } = request.body

    console.log(recipeId)

    //Check that recipe do not already exist
    const searchRecipe = await Recipe.findOne({ recipeId })
    if(searchRecipe) {
      return response.status(400).json({ error: 'Recipe already exist' })
    }

    const recipe = new Recipe({ recipeId, label, image, ingredients, creator, images, healthLabels, instructions, totalTime, likes: [], dislikes: [], comments: [] })
    if(!recipe.recipeId){
      recipe.recipeId = recipe._id
    }

    console.log(recipe)

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

    response.status(201).json(recipe)
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

    response.status(201).json(recipe)
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

    response.status(201).json(recipe)
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

    console.log(recipe)
    response.status(201).json(recipe)
  } catch (error) {
    next(error)
  }
}

const getAllInteractions = async (request, response, next) => {
  try {
    const recipeId = request.query.recipeId
    console.log(recipeId)
    const recipe = await Recipe.findOne({ recipeId })
    console.log(recipe)

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
    const recipes = await Recipe.find()
    // If no recipes found, return empty
    if (!recipes) {
      return response.status(204).json()
    }

    response.status(200).json(recipes)
  } catch (error) {
    next(error)
  }
}


const getUserCreatedInteractions = async (request, response, next) => {
  try {
    const recipesCreatedByUsrs = await Recipe.find({ creator: { $ne: null } })

    response.status(200).json({ recipesCreatedByUsrs })
  } catch (error) {
    next(error)
  }
}

const addImageToRecipe = async (recipeId, imageUrl, next) => {
  try {
    const recipe = await Recipe.findById(recipeId)
    if (!recipe) {
      throw new Error('Recipe not found')
    }

    // Add the new image URL to the images array
    recipe.images.push(imageUrl)

    // Save the updated recipe
    const updatedRecipe = await recipe.save()

    return updatedRecipe
  } catch (error) {
    next(error)
  }
}

export default { createInteraction, addLikeInteraction, removeLikeInteraction, addDislikeInteraction, removeDislikeInteraction, getAllInteractions, getAllInteractionRecipes, getUserCreatedInteractions, addImageToRecipe }
