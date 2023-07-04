import recipeService from '../services/recipes'
import Recipe from './Recipe'
import healthFilterOptions from '../data'
import { TextField, Button, FormControl, Select, MenuItem, InputLabel, Checkbox, ListItemText } from '@mui/material'
import { useEffect, useState } from 'react'

//when swiching page localStorage.clear();
const SearchBage = () => {
  const [recipes, setRecipes] = useState([])
  const [search, setSearch] = useState('')
  const [nextPageLink, setNextPageLink] = useState('')
  const [filterOptions, setFilterOptions] = useState([])

  useEffect(() => {
    handleSearch()
  }, [])

  const handleSearch = () => {
    let searchTerm = search || localStorage.getItem('search') || 'recommended'
    recipeService.getAll(searchTerm, filterOptions).then((response) => {
      console.log(response)
      setRecipes(response.hits.map((hit) => hit.recipe))
      setNextPageLink(response._links.next.href)
    })

    localStorage.setItem('search', searchTerm)
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
      <FormControl variant="outlined">
        <TextField
          label="Search recipes"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </FormControl>
      <FormControl variant="outlined">
        <InputLabel>Filter by diet</InputLabel>
        <Select
          multiple
          value={filterOptions}
          onChange={(event) => setFilterOptions(event.target.value)}
          renderValue={(selected) => selected.join(', ')}
          style={{ minWidth: '200px' }}
        >
          {healthFilterOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={filterOptions.includes(option)} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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