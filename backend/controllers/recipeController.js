import config from '../utils/config.js';
import axios from 'axios';


const getRecipes = async (request, response) => {
  try {
    const searchTerm = request.query.search;
    let healthFilters = request.query.healthFilters || [];
    
    console.log(healthFilters)

    if (typeof healthFilters === 'string') {
      healthFilters = healthFilters.split(',').map((filter) => filter.trim());
    }

    console.log(healthFilters)
    
    const params = {
      type: 'public',
      q: searchTerm,
      app_id: config.EDAMAM_ID,
      app_key: config.EDAMAM_APPLICATION_KEY,
    };
    
    let filterString = '';
    if (healthFilters.length > 0) {
      const lowercaseFilters = healthFilters.map((filter) => filter.toLowerCase());
      filterString = `&health=${lowercaseFilters.join('&health=')}`;
    }

    const url = `https://api.edamam.com/api/recipes/v2?${new URLSearchParams(params)}${filterString}`;
    console.log(url);
    const apiResponse = await axios.get(url);

    const recipes = apiResponse.data;
    response.status(200).json(recipes);
  } catch (error) {
    console.error(error);
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