import { User } from '../models/user.js'
import bcrypt from 'bcrypt'
import { sendUserConfirmationEmail, errorCreator } from '../utils/helperFunctions.js'
import mongoose from 'mongoose'
import { Recipe } from '../models/recipe.js'
//import { UserRecipe } from '../models/useCreatedreceipe.js'

const getUser = async (request, response, next) => {
  try {
    const { userId } = request.params
    const user = await User.findById(userId)
      .populate({
        path: 'favorites',
        model: 'Recipe', // Assuming 'favorites' refers to the 'Recipe' model
        populate: {
          path: 'creator',
          model: 'User', // Assuming 'creator' refers to the 'User' model
        },
      })
      .populate({
        path: 'likes',
        model: 'Recipe', // Assuming 'likes' refers to the 'Recipe' model
        populate: {
          path: 'creator',
          model: 'User', // Assuming 'creator' refers to the 'User' model
        },
      })
      .populate({
        path: 'dislikes',
        model: 'Recipe', // Assuming 'dislikes' refers to the 'Recipe' model
        populate: {
          path: 'creator',
          model: 'User', // Assuming 'creator' refers to the 'User' model
        },
      })
      .populate('comments')

    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }
    response.json(user)
  } catch (error) {
    next(error)
  }
}

const getUsers = async (request, response, next) => {
  try {
    const users = await User.find({})
    response.json(users)
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (request, response, next) => {
  try {
    const { userId } = request.params
    const deletedUser = await User.findByIdAndDelete(userId)

    if (!deletedUser) {
      return response.status(404).json({ error: 'User not found' })
    }

    response.json({ message: 'User deleted successfully' })
  } catch (error) {
    next(error)
  }
}

const createUser = async (request, response, next) => {
  try {
    const { username, name, email, profileText, password, isEmailConfirmed } = request.body
    const profileimage = request.file ? request.file.path : null

    if(!password) {
      throw errorCreator('Path `password` is required.' , 'ValidationError' )
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      email,
      isEmailConfirmed,
      profileimage,
      profileText,
      passwordHash,
      favorites: [],
      likes: [],
      dislikes: [],
    })


    const savedUser = await user.save()
    console.log('user saved')
    sendUserConfirmationEmail(email, user)

    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
}

const updateUser = async (request, response, next) => {
  try {
    const { userId } = request.params
    const { password, profileText, profileImage, favorites, likes, dislikes, isEmailConfirmed, username } = request.body

    if (!isEmailConfirmed && !password && !profileText && !profileImage && !favorites && !likes && !dislikes && !username) {
      return response.status(400).json({ error: 'something to modify must be provided' })
    }

    // Create an update object based on the provided fields
    const updateObject = {}
    if (isEmailConfirmed) {
      updateObject.isEmailConfirmed = true
    }
    if (profileText) {
      updateObject.profileText = profileText
    }
    if (profileText) {
      updateObject.username = username
    }
    if (profileImage) {
      updateObject.profileImage = profileImage
    }

    if (password) {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)
      updateObject.passwordHash = passwordHash
    }

    // Find the user by ID and update the fields
    const updatedUser = await User.findByIdAndUpdate(userId, updateObject, { new: true, timeout: 20000 })


    if (!updatedUser) {
      return response.status(404).json({ error: 'User not found' })
    }

    response.json(updatedUser)
  } catch (error) {
    next(error)
  }
}

const addFavorite = async (request, response, next) => {
  try {
    const { userId, recipeId } = request.body

    const [user, recipe] = await Promise.all([
      User.findById(userId),
      Recipe.findOne({ recipeId }),
    ])

    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    // Check if the recipe is already in the user's favorites
    const existingFavorite = user.favorites.includes(recipe._id)
    if (existingFavorite) {
      return response.status(400).json({ error: 'Recipe already favorited' })
    }

    // Add the new favorite to the user's favorites array
    user.favorites.push( recipe._id )

    // Save the updated user document
    const updatedUser = await user.save()

    response.status(201).json(updatedUser)
  } catch (error) {
    next(error)
  }
}

const removeFavorite = async (request, response, next) => {
  try {
    const { userId, recipeId } = request.body

    const [user, recipe] = await Promise.all([
      User.findById(userId),
      Recipe.findOne({ recipeId }),
    ])

    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    const existingFavorite = user.favorites.includes(recipe._id)
    if (!existingFavorite) {
      return response.status(400).json({ error: 'Recipe has not been favorited' })
    }

    // Remove the favorite from the user's favorites array
    user.favorites = user.favorites.filter((fav) => !fav.equals(recipe._id))

    // Save the updated user document
    const updatedUser = await user.save()

    response.status(200).json(updatedUser)
  } catch (error) {
    next(error)
  }
}

const getAllFavorites = async (request, response, next) => {
  try {
    const { userId } = request.query
    const user = await User.findById(userId).populate('favorites')

    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    // Return the user's favorites array
    response.status(200).json({ favorites: user.favorites })
  } catch (error) {
    next(error)
  }
}

const getAllFollowers = async (request, response, next) => {
  try {
    const { userId } = request.query

    // Find the user by userId and populate the 'followers' field with User objects
    const user = await User.findById(userId).populate('followers')
    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    // Return the followers array with user objects
    response.status(200).json({ followers: user.followers })
  } catch (error) {
    next(error)
  }
}

const getAllFollowing = async (request, response, next) => {
  try {
    const { userId } = request.query

    // Find the user by userId and populate the 'followers' field with User objects
    const user = await User.findById(userId).populate('following')

    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    // Return the followers array with user objects
    response.status(200).json({ following: user.following })
  } catch (error) {
    next(error)
  }
}

const addFollow = async (request, response, next) => {
  try {
    const { currentUserId, targetUserId } = request.body

    const currentUserIdObj = new mongoose.Types.ObjectId(currentUserId)
    const targetUserIdObj = new mongoose.Types.ObjectId(targetUserId)

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserIdObj),
      User.findById(targetUserIdObj),
    ])

    if (!currentUser || !targetUser) {
      return response.status(404).json({ error: 'User not found' })
    }

    // Check if the target user is already being followed by the current user
    const isAlreadyFollowing = currentUser.following.includes(targetUserId)
    if (isAlreadyFollowing) {
      return response.status(400).json({ error: 'User already being followed' })
    }

    // Update the current user's 'following' array with the target user's ObjectId
    currentUser.following.push(targetUserIdObj)
    await currentUser.save()

    // Update the target user's 'followers' array with the current user's ObjectId
    targetUser.followers.push(currentUserIdObj)
    await targetUser.save()

    response.status(200).json(currentUser)
  } catch (error) {
    next(error)
  }
}

const removeFollow = async (request, response, next) => {
  try {
    const { currentUserId, targetUserId } = request.body

    const currentUserIdObj = new mongoose.Types.ObjectId(currentUserId)
    const targetUserIdObj = new mongoose.Types.ObjectId(targetUserId)

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserIdObj),
      User.findById(targetUserIdObj),
    ])

    if (!currentUser || !targetUser) {
      return response.status(404).json({ error: 'User not found' })
    }

    // Check if the target user is being followed by the current user
    const isFollowing = currentUser.following.includes(targetUserId)
    if (!isFollowing) {
      return response.status(400).json({ error: 'User is not being followed' })
    }

    // Update the current user's 'following' array by removing the target user's ObjectId
    currentUser.following = currentUser.following.filter(
      (userId) => userId.toString() !== targetUserId
    )
    await currentUser.save()

    // Update the target user's 'followers' array by removing the current user's ObjectId
    targetUser.followers = targetUser.followers.filter(
      (userId) => userId.toString() !== currentUserId
    )
    await targetUser.save()

    response.status(200).json(currentUser)
  } catch (error) {
    next(error)
  }
}

export default {
  getUser, getUsers, createUser, updateUser, deleteUser, addFavorite, removeFavorite, getAllFavorites, getAllFollowers, getAllFollowing, addFollow, removeFollow
}