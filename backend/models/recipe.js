import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

const recipeSchema = new mongoose.Schema({
  recipeId: {
    type: String,
    //required: true, cannot be required here since user created recipes
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
  totalTime: {
    type: Number,
    default: null
  },
  ingredients: {
    type: Array,
    default: [],
  },
  instructions: {
    type: String,
  },
  mealType: {
    type: Array,
    default: [],
  },
  dishType: {
    type: Array,
    default: [],
  },
  cuisineType: {
    type: Array,
    default: [],
  },
  healthLabels: {
    type: Array,
    default: [],
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
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