import config from '../utils/config.js'
import axios from 'axios'


const getRecipes = async (request, response) => {
  console.log('you are in getrecipes')

  try {
    const searchTerm = request.query.search
    // calories, time, same with every nutrien,... MIN+, MIN-MAX, MAX (string)
    const calories = request.query.calories
    const time = request.query.time
    const ingr = request.query.ingr

    let nutrients = []
    const payload = JSON.parse(request.query.nutrients)
    console.log(payload)
    if(payload){
      nutrients = Object.entries(payload).reduce((acc, [key, value]) => {
        if (value !== ''){
          acc[key] = value
        }
        return acc
      }, {})
    }

    //['vegetarian', 'kosher']
    let healthFilters = request.query.healthFilters || []
    let mealTypeOptions = request.query.mealTypes || []

    //['bread', 'beef']
    let excludedFilters = request.query.excludedFilters || []

    if (typeof excludedFilters === 'string') {
      excludedFilters = excludedFilters.split(',').map((filter) => filter.trim())
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
    if (nutrients) {
      if (Object.keys(nutrients).length > 0) {
        nutrientString = Object.keys(nutrients)
          .map((key) => `&${encodeURIComponent('nutrients[' + key + ']')}=${encodeURIComponent(nutrients[key])}`)
          .join('')
      }
    }

    if (excludedFilters.length > 0) {
      params.excluded = excludedFilters.join(' ')
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

    const url = `https://api.edamam.com/api/recipes/v2?${new URLSearchParams(params)}${filterString}${mealTypesString}${nutrientString}`.trim('')
    console.log(url)
    const apiResponse = await axios.get(url)

    const recipes = apiResponse.data
    response.status(200).json(recipes)
  } catch (error) {
    console.error(error)
  }
}

const getLink = async (request, response) => {
  try {
    const searchTerm = request.query.link
    console.log(searchTerm)
    const apiResponse = await axios.get(searchTerm)

    const recipes = apiResponse.data
    response.status(200).json(recipes)
  } catch (error) {
    console.error(error)
  }
}

export default {
  getRecipes, getLink
}