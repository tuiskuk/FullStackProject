import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

const userRecipeSchema = new mongoose.Schema({
  creator: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    default: null,
  },
  cautions: {
    type: Array,
    default: [],
  },
  cuisineType: {
    type: Array,
    default: null,
  },
  dietLabels: {
    type: Array,
    default: null,
  },
  dishType: {
    type: Array,
    default: null,
  },
  healthLabels: {
    type: Array,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  images: {
    type: Array,
    default: [],
  },
  ingredientLines: {
    type: Array,
    required: true,
  },
  ingredients: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  mealType: {
    type: Array,
    default: null,
  },
  totalNutrients: {
    type: Object,
    default: {},
  },
  totalTime: {
    type: Number,
    required: true,
  },
  likes: { // { userID }
    type: Array,
    default: [],
  },
  dislikes: { // { userID }
    type: Array,
    default: [],
  },
  comments: { // { userId, text}
    type: Array,
    default: [],
  },
})


userRecipeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})



export const UserRecipe = mongoose.model('UserRecipe', userRecipeSchema)
