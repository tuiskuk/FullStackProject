import { User } from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../utils/config.js'
import nodemailer from 'nodemailer'
import mongoose from 'mongoose'

const getUser = async (request, response) => {
  try {
    console.log(request.params)
    const { userId } = request.params
    const user = await User.findById(userId)

    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    response.json(user)
  } catch (error) {
    console.log(error)
    response.status(500).json({ error: 'Something went wrong' })
  }
}

const getUsers = async (request, response) => {

  try {
    const users = await User.find({})
    response.json(users)
  } catch (error) {
    // Handle the error
    response.status(500).json({ error: 'Something went wrong' })
  }
}

const deleteUser = async (request, response) => {
  try {
    const { userId } = request.params
    const deletedUser = await User.findByIdAndDelete(userId)

    if (!deletedUser) {
      return response.status(404).json({ error: 'User not found' })
    }

    response.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.log(error)
    response.status(500).json({ error: 'Something went wrong' })
  }
}

const createUser = async (request, response) => {
  try {
    const { username, name, email, profileimage, profileText, password, isEmailConfirmed } = request.body

    console.log(password)
    if(!password) {
      return response.status(400).json({ error: 'password is already exists' })
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
      favourites: []
    })

    const savedUser = await user.save()

    const emailToken = jwt.sign( { id: user._id,
    } , config.EMAIL_SECRET , { expiresIn: '1d' } )

    const url = `http://localhost:3001/api/register/${emailToken}`
    console.log(url)
    console.log(config.MY_GMAIL)
    console.log(config.MY_GMAIL_PASSWORD)
    console.log(email)

    const transporter = nodemailer.createTransport({
      host: 'smtp.elasticemail.com',
      port: 2525,
      auth: {
        user: `${config.MY_GMAIL}`,
        pass: `${config.MY_GMAIL_PASSWORD}`
      }
    })


    const mailOptions = {
      from: `${config.MY_GMAIL}`, // Replace with your email address
      to: `${email}`, // Replace with the recipient's email address
      subject: 'Confirmation of your foodapp user',
      html: `<p>Please click on the following link to confirm your FoodApp account:</p><a href="${url}">Confirm your foodapp account</a>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error:', error)
      } else {
        console.log('Email sent:', info.response)
      }
    })



    response.status(201).json(savedUser)
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      // Duplicate value error (e.g., duplicate username or email)
      const duplicateField = Object.keys(error.keyPattern)[0]
      return response.status(400).json({ error: `${duplicateField} already exists` })
    } else if (error.name === 'ValidationError') {
      // Handle validation errors
      const validationErrors = Object.values(error.errors).map((err) => err.message)
      return response.status(400).json({ error: validationErrors })
    }
    response.status(500).json({ error: 'Something went wrong' })
  }
}

const updateUser = async (request, response) => {
  try {
    const { userId } = request.params
    const { password, profileText, profileImage, favorites, isEmailConfirmed, followers, following } = request.body
    console.log(userId)

    if (!isEmailConfirmed && !password && !profileText && !profileImage && !favorites) {
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
    if (favorites) {
      updateObject.$push = { favorites: favorites }
    }
    if (password) {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)
      updateObject.passwordHash = passwordHash
    }
    if (followers) {
      updateObject.$push = { followers: followers }
    }
    if (following) {
      updateObject.$push = { following: following }
    }

    // Find the user by ID and update the fields
    const updatedUser = await User.findByIdAndUpdate(userId, updateObject, { new: true, timeout: 20000 })


    if (!updatedUser) {
      return response.status(404).json({ error: 'User not found' })
    }

    response.json(updatedUser)
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      // Duplicate value error (e.g., duplicate username or email)
      const duplicateField = Object.keys(error.keyPattern)[0]
      return response.status(400).json({ error: `${duplicateField} already exists` })
    } else if (error.name === 'ValidationError') {
      // Handle validation errors
      const validationErrors = Object.values(error.errors).map((err) => err.message)
      return response.status(400).json({ error: validationErrors })
    }
    response.status(500).json({ error: 'Something went wrong' })
  }
}

const addFavorite = async (req, res) => {
  const { userId, recipeId, label, image } = req.body
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
    user.favorites.push({ recipeId, label, image })

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

const getAllFavorites = async (req, res) => {
  try {
    const { userId } = req.query
    console.log(userId)

    // Find the user by userId
    const user = await User.findById(userId)

    // If user is not found, return a 404 response with an error message
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Return the user's favorites array
    res.status(200).json({ favorites: user.favorites })
  } catch (error) {
    // If any error occurs during the process, handle it and return a 500 response with an error message
    console.log(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const getAllFollowers = async (req, res) => {
  try {
    const { userId } = req.query

    // Find the user by userId and populate the 'followers' field with User objects
    const user = await User.findById(userId).populate('followers')

    // If user is not found, return a 404 response with an error message
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Return the followers array with user objects
    res.status(200).json({ followers: user.followers })
  } catch (error) {
    // If any error occurs during the process, handle it and return a 500 response with an error message
    console.log(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const getAllFollowing = async (req, res) => {
  try {
    const { userId } = req.query

    // Find the user by userId and populate the 'followers' field with User objects
    const user = await User.findById(userId).populate('following')

    // If user is not found, return a 404 response with an error message
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Return the followers array with user objects
    res.status(200).json({ following: user.following })
  } catch (error) {
    // If any error occurs during the process, handle it and return a 500 response with an error message
    console.log(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const addFollow = async (req, res) => {
  try {
    const { currentUserId, targetUserId } = req.body

    // Find the current user and the target user
    const currentUserIdObj = new mongoose.Types.ObjectId(currentUserId)
    const targetUserIdObj = new mongoose.Types.ObjectId(targetUserId)
    const currentUser = await User.findById(currentUserIdObj)
    const targetUser = await User.findById(targetUserIdObj)

    // If either user is not found, return a 404 response with an error message
    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if the target user is already being followed by the current user
    const isAlreadyFollowing = currentUser.following.includes(targetUserId)

    if (isAlreadyFollowing) {
      return res.status(400).json({ error: 'User already being followed' })
    }

    // Update the current user's 'following' array with the target user's ObjectId
    currentUser.following.push(targetUserIdObj)
    await currentUser.save()

    // Update the target user's 'followers' array with the current user's ObjectId
    targetUser.followers.push(currentUserIdObj)
    await targetUser.save()

    res.status(200).json({ message: 'Successfully added follow' })
  } catch (error) {
    // If any error occurs during the process, handle it and return a 500 response with an error message
    console.log(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const removeFollow = async (req, res) => {
  try {
    const { currentUserId, targetUserId } = req.body

    // Find the current user and the target user
    const currentUserIdObj = new mongoose.Types.ObjectId(currentUserId)
    const targetUserIdObj = new mongoose.Types.ObjectId(targetUserId)
    const currentUser = await User.findById(currentUserIdObj)
    const targetUser = await User.findById(targetUserIdObj)

    // If either user is not found, return a 404 response with an error message
    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if the target user is being followed by the current user
    const isFollowing = currentUser.following.includes(targetUserId)

    if (!isFollowing) {
      return res.status(400).json({ error: 'User is not being followed' })
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

    res.status(200).json({ message: 'Successfully removed follow' })
  } catch (error) {
    // If any error occurs during the process, handle it and return a 500 response with an error message
    console.log(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}



export default {
  getUser, getUsers, createUser, updateUser, deleteUser, addFavorite, removeFavorite, getFavorite, getAllFavorites, getAllFollowers, getAllFollowing, addFollow, removeFollow
}