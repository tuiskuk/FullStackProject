import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'


const nameValidator = (name) => {
  const pattern = /^[A-Za-z]+ [A-Za-z]+$/
  //checks that name is form ${firstname} + ' ' + ${lastName}
  return pattern.test(name)
}

const emailValidator = (email) => {
  const pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  //something@something.{something without numbers with min lenght of 2}
  return pattern.test(email)
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 5,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator: nameValidator,
      message: 'Invalid name format',
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: emailValidator,
      message: 'Invalid email format',
    }
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: null
  },
  profileText: {
    type: String,
    default: null
  },
  passwordHash: String,
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      default: null
    }
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      default: null
    }
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      default: null
    }
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id?.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

export const User = mongoose.model('User', userSchema)
