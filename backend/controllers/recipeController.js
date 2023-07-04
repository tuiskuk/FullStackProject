import config from '../utils/config.js'
import axios from 'axios'


const getRecipes = async (request, response) => {
  console.log('you are in getrecipes')
  console.log(request.query)
  try {
    const searchTerm = request.query.search
    const apiResponse = await axios.get(
      'https://api.edamam.com/api/recipes/v2',
      {
        params: {
          type: 'public',
          q: searchTerm,
          app_id: config.EDAMAM_ID,
          app_key: config.EDAMAM_APPLICATION_KEY,
        },
      }
    )
    const recipes = apiResponse.data
    response.status(200).json(recipes)
  } catch (error) {
    console.error(error)
  }
}

const getLink = async (request, response) => {
    try {
      const searchTerm = request.query.link
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