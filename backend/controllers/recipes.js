const config = require('../utils/config')
const recipesRouter = require('express').Router()
const axios = require('axios')

recipesRouter.get('/', async (request, response) => {
  try {
    const apiResponse = await axios.get(
      'https://api.edamam.com/api/recipes/v2',
      {
        params: {
          type: 'public',
          q: 'pizza',
          app_id: config.EDAMAM_ID,
          app_key: config.EDAMAM_APPLICATION_KEY,
        },
      }
    )
    const recipes = apiResponse.data
    response.json(recipes)
  } catch (error) {
    console.error(error)
  }
})

module.exports = recipesRouter