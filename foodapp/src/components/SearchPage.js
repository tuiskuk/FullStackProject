import Recipe from './Recipe'
import { useState, useEffect } from 'react'
import { useGetAllRecipesQuery, useGetNextPageQuery } from '../services/apiSlice'
import healthFilterOptions from '../data'
import { TextField, Button, FormControl, Select, MenuItem, InputLabel, Checkbox, ListItemText, CircularProgress } from '@mui/material'

//when swiching page localStorage.clear();

const SearchBage = () => {
  const [recipes, setRecipes] = useState([])
  const [search, setSearch] = useState('')
  const [excluded, setExcluded] = useState([])
  const [nextPageLink, setNextPageLink] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [excludedTerms, setExcludedTerms] = useState([])
  const [filterOptions, setFilterOptions] = useState([])
  const { data: allRecipesData, isLoading } = useGetAllRecipesQuery({ searchTerm, filterOptions, excludedTerms })
  const { data: NextPageData } = useGetNextPageQuery(nextPageLink)

  useEffect(() => {
    setSearchTerm(searchTerm || localStorage.getItem('search') || 'recommended')
  }, [])


  useEffect(() => {
    if (allRecipesData) {
      setRecipes(allRecipesData.hits.map((hit) => hit.recipe))
      localStorage.setItem('search', searchTerm)
      if(allRecipesData._links.next && allRecipesData._links.next.href ) {
        setNextPageLink(allRecipesData._links.next.href)
      }
    }
    setSearch('')
    setExcluded('')
  }, [allRecipesData])

  const handleClickSearch = async () => {
    setExcludedTerms(excluded)
    setSearchTerm(search)
  }

  const fetchNextPage = async () => {
    if (nextPageLink) {

      setRecipes((prevRecipes) => [...prevRecipes, ...NextPageData.hits.map((hit) => hit.recipe)])
      if (NextPageData._links.next && NextPageData._links.next.href) {
        setNextPageLink(NextPageData._links.next.href)
      } else {
        setNextPageLink('')
      }
    }
  }

  const goToNextPage = () => {
    if (nextPageLink) {
      fetchNextPage()
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

        <Button variant="contained" onClick={handleClickSearch}>
          Search
        </Button>
      </FormControl>

      <FormControl variant="outlined">
        <TextField
          label="Set excluded foods"
          value={excluded}
          onChange={(event) => setExcluded(event.target.value)}
        />
      </FormControl>

      <FormControl variant="outlined">
        <InputLabel>Filter by diet</InputLabel>
        <Select
          multiple
          value={filterOptions}
          onChange={(event) => setFilterOptions(event.target.value)
          }
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
      {isLoading ? (
        <CircularProgress /> // Render the loading spinner when loading is true
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {recipes.map((recipe) => (
            <Recipe key={recipe.uri} recipe={recipe} />
          ))}
        </div>
      )}

      {nextPageLink && (
        <Button variant="outlined" onClick={goToNextPage}>
          Load more
        </Button>
      )}
    </div>
  )
}

export default SearchBage