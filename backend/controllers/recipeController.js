import { Recipe } from '../models/recipe.js'
import config from '../utils/config.js'
import axios from 'axios'

//get recipes by params
const getRecipes = async (request, response, next) => {
  console.log('you are in getrecipes')

  try {
    const { search: searchTerm, calories, time, ingr, nutrients,
      healthFilters = [], mealTypeOptions = [], excludedFilters = [],
      cuisineTypeOptions = [], dishOptions = []  } = request.query

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
      q: searchTerm.trim(),
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

    let cuisineString = ''
    if (cuisineTypeOptions.length > 0) {
      const filters = cuisineTypeOptions.split(',').map((filter) => filter.trim())
      const formattedCuisineTypes = filters.map((cuisineType) =>
        encodeURIComponent(cuisineType)
      )
      cuisineString = `&cuisineType=${formattedCuisineTypes.join('&cuisineType=')}`
    }

    let dishString = ''
    if (dishOptions.length > 0) {
      const filters = dishOptions.split(',').map((filter) => filter.trim())
      const formattedDishTypes = filters.map((dishType) =>
        encodeURIComponent(dishType)
      )
      dishString = `&dishType=${formattedDishTypes.join('&dishType=')}`
    }

    let mealTypesString = ''
    if (mealTypeOptions.length > 0) {
      const options = mealTypeOptions.split(',').map((filter) => filter.trim())
      mealTypesString = `&mealType=${options.join('&mealType=')}`
    }

    const url = `https://api.edamam.com/api/recipes/v2?${new URLSearchParams(params)}${filterString}${mealTypesString}${nutrientString}${excludedString}${cuisineString}${dishString}`.trim('')
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
    const foundRecipe = await Recipe.findById(id)


    if (!foundRecipe || foundRecipe.creator !== null) {
      return response.status(404).json({ error: 'API Recipe not found' })
    }
    console.log(foundRecipe)
    const recipeId = foundRecipe.recipeId
    const url = `https://api.edamam.com/api/recipes/v2/${recipeId}?type=public&app_id=${config.EDAMAM_ID}&app_key=${config.EDAMAM_APPLICATION_KEY}`
    const apiResponse = await axios.get(url)
    const recipe = apiResponse.data
    response.status(200).json(recipe)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export default {
  getRecipes, getLink, getRecipe
}