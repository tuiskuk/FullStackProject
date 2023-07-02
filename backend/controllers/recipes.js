const config = require('../utils/config')
const recipesRouter = require('express').Router()
const axios = require('axios');

recipesRouter.get('/recipes', async (request, response) => {
  const options = {
    method: 'GET',
    url: 'https://edamam-recipe-search.p.rapidapi.com/search',
    params: {q: 'chicken'},
    headers: {
      'X-RapidAPI-Key': config.EDAMAM_APPLICATION_KEY,
      'X-RapidAPI-Host': config.EDAMAM_ID,
    }
  }
  
  try {
    const recipes = await axios.request(options)
    console.log(recipes.data)
    response.json(recipes.data)
  } catch (error) {
    console.error(error);
  }

  const optionss = {
    method: 'GET',
    url: 'https://edamam-recipe-search.p.rapidapi.com/search',
    params: {q: 'chicken'},
    headers: {
      'X-RapidAPI-Key': config.EDAMAM_APPLICATION_KEY,
      'X-RapidAPI-Host': config.EDAMAM_ID,
    }
  }
  
  try {
    const recipes = await axios.request(optionss)
    console.log(recipes.data)
    response.json(recipes.data)
  } catch (error) {
    console.error(error);
  }
})

module.exports = recipesRouter