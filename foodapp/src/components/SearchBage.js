import recipeService from '../services/recipes'
import Recipe from './Recipe'
import { TextField, Button } from '@mui/material'
import { useEffect, useState } from 'react'

//when swiching page localStorage.clear();
const SearchBage = () => {
  const [recipes, setRecipes] = useState([])
  const [search, setSearch] = useState('')
  const [nextPageLink, setNextPageLink] = useState('')

  useEffect(() => {
    handleSearch()
  }, [])

  const handleSearch = () => {
    let searchTerm = search || localStorage.getItem('search') || 'recommended'
    recipeService.getAll(searchTerm).then((response) => {
      setRecipes(response.hits.map((hit) => hit.recipe))
      setNextPageLink(response._links.next.href)
    })

    localStorage.setItem('search', searchTerm)
    setSearch('')
  }

  const goToNextPage = () => {
    if (nextPageLink) {
      recipeService.getRecipesByLink(nextPageLink).then((response) => {
        setRecipes((prevRecipes) => [...prevRecipes, ...response.hits.map((hit) => hit.recipe)])
        setNextPageLink(response._links.next.href)
      })
    }
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
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {recipes.map((recipe) => (
          <Recipe key={recipe.uri} recipe={recipe} />
        ))}
      </div>
      {nextPageLink && (
        <Button variant="outlined" onClick={goToNextPage}>
          Load more
        </Button>
      )}
    </div>
  )
}

export default SearchBage