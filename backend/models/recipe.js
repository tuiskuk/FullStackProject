import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

const recipeSchema = new mongoose.Schema({
  recipeId: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
  ],
})

recipeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const Recipe = mongoose.model('Recipe', recipeSchema)