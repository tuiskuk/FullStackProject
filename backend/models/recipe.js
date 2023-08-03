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
    default: null,
  },
  images: {
    type: Array,
    default: [],
  },
  yield: {
    type: Number,
    default: 4,
  },
  ingredients: {
    type: Array,
    default: [],
  },
  totalNutrients: {
    type: Object,
    default: null,
  },
  instructions: {
    type: String,
  },
  url: {           //has to be saved since we want these from main page to be clickable
    type: String,
    default: null  //(there coulb be possibility to get these from api in home page as well)
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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