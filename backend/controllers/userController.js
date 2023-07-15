import { User } from '../models/user.js'
import bcrypt from 'bcrypt'
import { sendUserConfirmationEmail, errorCreator } from '../utils/helperFunctions.js'

const getUser = async (request, response, next) => {
  try {
    console.log(request.params)
    const { userId } = request.params
    const user = await User.findById(userId)

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
    const { username, name, email, profileimage, profileText, password, isEmailConfirmed } = request.body

    console.log(password)
    if(!password) {
      throw errorCreator('Path `password` is required.' , 'ValidationError' );
    }

    console.log('are we alive')

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
      favourites: []
    })
    console.log('user created')

    const savedUser = await user.save()
    console.log('user saved')
    sendUserConfirmationEmail(email, user)
    console.log('email send yee')

    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
}

const updateUser = async (request, response, next) => {
  try {
    const { userId } = request.params
    const { password, profileText, profileImage, favourites, isEmailConfirmed, deletefavourite } = request.body
    console.log(userId)

    if (!isEmailConfirmed && !password && !profileText && !profileImage && !favourites && ! deletefavourite) {
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
    if (profileImage) {
      updateObject.profileImage = profileImage
    }
    if (favourites) {
      updateObject.$push = { favourites: favourites }
    }
    if (deletefavourite) {
      updateObject.$pull = { favourites: deletefavourite }
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

const addFavorite = async (req, res) => {
  const { userId, recipeId } = req.body
  console.log('adding favorite')

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if the recipe is already in the user's favorites
    const existingFavorite = user.favorites.find(favorite => favorite.recipeId === recipeId)
    if (existingFavorite) {
      return res.status(400).json({ error: 'Recipe already favorited' })
    }

    // Add the new favorite to the user's favorites array
    user.favorites.push({ recipeId })

    // Save the updated user document
    await user.save()

    res.status(201).json({ message: 'Favorite added' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const removeFavorite = async (req, res) => {
  const { userId, recipeId } = req.body

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Find the index of the favorite in the user's favorites array
    const favoriteIndex = user.favorites.findIndex(favorite => favorite.recipeId === recipeId)

    if (favoriteIndex === -1) {
      return res.status(404).json({ error: 'Favorite not found' })
    }

    // Remove the favorite from the user's favorites array
    user.favorites.splice(favoriteIndex, 1)

    // Save the updated user document
    await user.save()

    res.status(200).json({ message: 'Favorite removed' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const getFavorite = async (req, res) => {
  try {
    const { userId, recipeId } = req.query
    console.log(req.query, userId, recipeId)
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const favorite = user.favorites.find((fav) => fav.recipeId === recipeId)

    if (!favorite) {
      return res.status(204).json({ favorite })
    }

    res.status(200).json({ favorite })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}



export default {
  getUser, getUsers, createUser, updateUser, deleteUser, addFavorite, removeFavorite, getFavorite
}