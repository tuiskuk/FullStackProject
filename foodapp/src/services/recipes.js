import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/recipes'

const getAll = async (searchTerm) => {
  const response = await axios.get(baseUrl, { params: { search: searchTerm } })
  return response.data
}

const getRecipesByLink = async (link) => {
  const response = await axios.get(`${baseUrl}/link`, { params: { link: link } })
  return response.data
}

export default { getAll, getRecipesByLink }