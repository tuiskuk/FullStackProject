import { Recipe } from '../models/recipe.js'
import config from '../utils/config.js'
import axios from 'axios'

//get recipes by params
const getRecipes = async (request, response, next) => {
  console.log('you are in getrecipes')

  try {
    const { search: searchTerm, calories, time, ingr, nutrients,
      healthFilters = [], mealTypeOptions = [], excludedFilters = [] } = request.query

    // parseing nutrients to return format MIN+, MIN-MAX, MAX (string)
    let nutrientsData = []
    if(nutrients){
      nutrientsData = Object.entries(JSON.parse(nutrients)).reduce((acc, [key, value]) => {
        if (value !== ''){
          acc[key] = value
        }
        return acc
      }, {})
    }

    const params = {
      type: 'public',
      q: searchTerm,
      app_id: config.EDAMAM_ID,
      app_key: config.EDAMAM_APPLICATION_KEY,
    }

    if (calories) {
      params.calories = calories
    }

    if (time) {
      params.time = time
    }

    if (ingr) {
      params.ingr = ingr
    }

    let nutrientString = ''
    if (nutrientsData && Object.keys(nutrientsData).length > 0) {
      nutrientString = Object.keys(nutrientsData)
        .map((key) => `&${encodeURIComponent('nutrients[' + key + ']')}=${encodeURIComponent(nutrientsData[key])}`)
        .join('')
    }

    let excludedString = ''
    if (excludedFilters.length > 0) {
      const excluded = excludedFilters.split(',').map((filter) => filter.trim())
      excludedString = `&excluded=${excluded.join('&excluded=')}`
    }

    let filterString = ''
    if (healthFilters.length > 0) {
      const filters = healthFilters.split(',').map((filter) => filter.trim())
      filterString = `&health=${filters.join('&health=')}`
    }

    let mealTypesString = ''
    if (mealTypeOptions.length > 0) {
      const options = mealTypeOptions.split(',').map((filter) => filter.trim())
      mealTypesString = `&mealType=${options.join('&mealType=')}`
    }

    const url = `https://api.edamam.com/api/recipes/v2?${new URLSearchParams(params)}${filterString}${mealTypesString}${nutrientString}${excludedString}`.trim('')
    console.log(url)
    const apiResponse = await axios.get(url)

    const recipes = apiResponse.data
    response.status(200).json(recipes)
  } catch (error) {
    next(error)
  }
}

//get data from link
const getLink = async (request, response, next) => {
  try {
    const searchTerm = request.query.link
    console.log(searchTerm)
    const apiResponse = await axios.get(searchTerm)

    const recipes = apiResponse.data
    response.status(200).json(recipes)
  } catch (error) {
    next(error)
  }
}

//Get recipe by id
const getRecipe = async (request, response, next) => {
  try {
    const { id } = request.query
    console.log(id)

    const foundRecipe = await Recipe.findById(id)

    if (!foundRecipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }
    const recipeId = foundRecipe.recipeId
    console.log(recipeId)

    const url = `https://api.edamam.com/api/recipes/v2/${recipeId}?type=public&app_id=${config.EDAMAM_ID}&app_key=${config.EDAMAM_APPLICATION_KEY}`
    console.log(url)

    const apiResponse = await axios.get(url)
    const recipe = apiResponse.data
    response.status(200).json(recipe)
  } catch (error) {
    next(error)
  }
}

export default {
  getRecipes, getLink, getRecipe
}