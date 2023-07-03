import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/recipes'

const getAll = async (searchTerm) => {
  const response = await axios.get(baseUrl, { params: { search: searchTerm } })
  return response.data
}

export default { getAll }