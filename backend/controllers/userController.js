import { User } from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../utils/config.js'
import nodemailer from 'nodemailer'

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
    const { password, profileText, profileImage, favourites, isEmailConfirmed } = request.body
    console.log(userId)

    if (!isEmailConfirmed && !password && !profileText && !profileImage && !favourites) {
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