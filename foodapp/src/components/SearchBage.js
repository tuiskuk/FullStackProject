import recipeService from '../services/recipes'
import Recipe from './Recipe'
import { TextField, Button } from '@mui/material'
import { useEffect, useState } from 'react'

//when swiching page localStorage.clear();
const SearchBage = () => {
  const [recipes, setRecipes] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    handleSearch()
  }, [])

  const handleSearch = () => {
    let searchTerm = search || localStorage.getItem('search') || 'recommended'
    recipeService.getAll(searchTerm).then((response) =>
      setRecipes(response.hits.map((hit) => hit.recipe))
    )
    localStorage.setItem('search', searchTerm)
    setSearch('')
  }

  return (
    <div>
      <TextField
        label="Search recipes"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>
      <h2>Check recommended recipes or feel free to search recipes yourself</h2>
      {recipes.map((recipe) => (
        <Recipe
          key={recipe.uri}
          recipe={recipe}
        />
      ))}
    </div>
  )
}

export default SearchBage