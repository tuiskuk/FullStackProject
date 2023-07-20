import { Recipe } from '../models/recipe.js'
import { User } from '../models/user.js'
import mongoose from 'mongoose'

const createInteraction = async (request, response) => {
  try {
    const { recipeId } = request.query

    //check that recipe do not already exist
    if(await Recipe.findOne({ recipeId })) {
      return response.status(400).json({ error: 'Recipe already exist' })
    }

    const recipe = new Recipe({ recipeId, likes: [], dislikes: [], comments: [] })

    const savedRecipe = await recipe.save()

    response.status(201).json({ savedRecipe })
  } catch (error) {
    console.log('creating interaction failed')
  }
}

const addLikeInteraction = async (request, response) => {
  try {
    const { recipeId, userId } = request.query
    const userIdObject = new mongoose.Types.ObjectId(userId)
    const currentUser = await User.findById(userIdObject)

    // If either user is not found, return a 404 response with an error message
    if (!currentUser) {
      return response.status(404).json({ error: 'UserId not found' })
    }

    const recipe = await Recipe.findOne({ recipeId })

    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    // Check if the user already liked the recipe
    const existingLike = recipe.likes.includes(userId)

    if (existingLike) {
      return response.status(400).json({ error: 'Recipe already liked' })
    }

    // Add the new like to the recipe's likes array
    recipe.likes.push(userIdObject)

    // Save the updated recipe document
    await recipe.save()

    response.status(201).json({ message: 'Like added' })
  } catch (error) {
    console.log('Liking interaction failed')
    response.status(500).json({ error: 'Internal Server Error' })
  }
}

const removeLikeInteraction = async (request, response) => {
  try {
    const { recipeId, userId } = request.query
    const userIdObject = new mongoose.Types.ObjectId(userId)
    const currentUser = await User.findById(userIdObject)

    // If either user is not found, return a 404 response with an error message
    if (!currentUser) {
      return response.status(404).json({ error: 'UserId not found' })
    }

    const recipe = await Recipe.findOne({ recipeId })

    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    // Check if the user hasn't liked the recipe
    const existingLike = recipe.likes.includes(userId)

    if (!existingLike) {
      return response.status(400).json({ error: 'Recipe hasn not been liked' })
    }

    // Update the current user's 'following' array by removing the target user's ObjectId
    recipe.likes = recipe.likes.filter((like) => !like.equals(userIdObject))

    await recipe.save()

    response.status(201).json({ message: 'Like removed' })
  } catch (error) {
    console.log('Removing like interaction failed')
    response.status(500).json({ error: 'Internal Server Error' })
  }
}

const addDislikeInteraction = async (request, response) => {
  try {
    const { recipeId, userId } = request.query
    const userIdObject = new mongoose.Types.ObjectId(userId)
    const currentUser = await User.findById(userIdObject)

    // If either user is not found, return a 404 response with an error message
    if (!currentUser) {
      return response.status(404).json({ error: 'UserId not found' })
    }

    const recipe = await Recipe.findOne({ recipeId })

    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    // Check if the user already disliked the recipe
    const existingDislike = recipe.dislikes.includes(userId)

    if (existingDislike) {
      return response.status(400).json({ error: 'Recipe already disliked' })
    }

    // Add the new dislike to the recipe's dislikes array
    recipe.dislikes.push(userIdObject)

    // Save the updated recipe document
    await recipe.save()

    response.status(201).json({ message: 'Dislike added' })
  } catch (error) {
    console.log('Liking interaction failed')
    response.status(500).json({ error: 'Internal Server Error' })
  }
}

const removeDislikeInteraction = async (request, response) => {
  try {
    const { recipeId, userId } = request.query
    const userIdObject = new mongoose.Types.ObjectId(userId)
    const currentUser = await User.findById(userIdObject)

    // If either user is not found, return a 404 response with an error message
    if (!currentUser) {
      return response.status(404).json({ error: 'UserId not found' })
    }

    const recipe = await Recipe.findOne({ recipeId })

    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    // Check if the user hasn't disliked the recipe
    const existingDislike = recipe.dislikes.includes(userId)

    if (!existingDislike) {
      return response.status(400).json({ error: 'Recipe hasn not been disliked' })
    }

    // Update the current user's 'following' array by removing the target user's ObjectId
    recipe.dislikes = recipe.dislikes.filter((dislike) => !dislike.equals(userIdObject))

    await recipe.save()

    response.status(201).json({ message: 'Dislike removed' })
  } catch (error) {
    console.log('Removing dislike interaction failed')
    response.status(500).json({ error: 'Internal Server Error' })
  }
}

const getAllInteractions = async (request, response) => {
  try {
    const recipeId = request.query.recipeId
    console.log(recipeId)

    // Find the recipe by recipeId
    const recipe = await Recipe.findOne({ recipeId })
    console.log(recipe)
    // If recipe is not found, return empty
    if (!recipe) {
      return response.status(204).json({ recipe })
    }

    // Return the recipes's like array
    response.status(200).json({ recipe })
  } catch (error) {
    // If any error occurs during the process, handle it and return a 500 response with an error message
    console.log(error)
    response.status(500).json({ error: 'Something went wrong' })
  }
}

export default { createInteraction, addLikeInteraction, removeLikeInteraction, addDislikeInteraction, removeDislikeInteraction, getAllInteractions }
