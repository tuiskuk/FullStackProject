import Recipe from './Recipe'
import { useState, useEffect } from 'react'
import { useGetAllRecipesQuery, useGetNextPageQuery } from '../services/apiSlice'
import { healthFilterOptions, nutrients, mealTypes } from '../data'
import { Container, TextField, Button, FormControl, Select, MenuItem, InputLabel, Checkbox, ListItemText, CircularProgress } from '@mui/material'

const SearchPage = () => {
  const [recipes, setRecipes] = useState([])
  const [nextPageLink, setNextPageLink] = useState('')

  const [search, setSearch] = useState(localStorage.getItem('search') ||'')
  const [searchTerm, setSearchTerm] = useState('')

  const [excluded, setExcluded] = useState(localStorage.getItem('exluded') || [])
  const [excludedTerms, setExcludedTerms] = useState([])

  const [time, setTime] = useState(localStorage.getItem('time') || '')
  const [timeTerm, setTimeTerm] = useState('')

  const [calories, setCalories] = useState(localStorage.getItem('calories') || '')
  const [caloriesTerm, setCaloriesTerm] = useState('')

  const [filterOptions, setFilterOptions] = useState(localStorage.getItem('filterOptions') || [])
  const [filterOptionTerms, setFilterOptionTerms] = useState([])

  const [nutrientInputs, setNutrientInputs] = useState(JSON.parse(localStorage.getItem('nutrientInputs')) || [])
  const [nutrientInputsTerms, setNutrientInputsTerms] = useState([])

  const [ingridientsNumber, setIngridientsNumber] = useState(localStorage.getItem('ingridientsNumber') || '')
  const [ingridientsNumberTerm, setIngridienstNumberTerm] = useState('')

  const [mealTypeOptions, setMealTypeOptions] = useState(localStorage.getItem('mealTypeOptions') || [])
  const [mealTypeOptionTerms, setMealTypeOptionTerms] = useState([])

  localStorage.clear()
  const { data: allRecipesData, isLoading, isFetching
  } = useGetAllRecipesQuery({
    searchTerm: searchTerm || localStorage.getItem('search') || 'recommended',
    filterOptionTerms: filterOptionTerms || localStorage.getItem('filterOptions') || [],
    excludedTerms: excludedTerms || localStorage.getItem('exluded') || [],
    timeTerm: timeTerm || localStorage.getItem('time') || '',
    caloriesTerm: caloriesTerm || localStorage.getItem('calories') || '',
    nutrientInputsTerms: nutrientInputsTerms || localStorage.getItem('nutrientInputs') || [],
    ingridientsNumberTerm: ingridientsNumberTerm || localStorage.getItem('ingridientsNumber') || '',
    mealTypeOptionTerms: mealTypeOptionTerms || localStorage.getItem('mealtypeOptions') || []
  })
  const { data: NextPageData } = useGetNextPageQuery(nextPageLink)

  useEffect(() => {
    searchRecipes()
  }, [allRecipesData])

  const searchRecipes = async () => {
    localStorage.setItem('time', time)
    localStorage.setItem('calories', calories)
    localStorage.setItem('excluded', excluded)
    localStorage.setItem('filterOptions', filterOptions)
    localStorage.setItem('search', search)
    localStorage.setItem('nutrienInputs', nutrientInputs)
    localStorage.setItem('ingridientsNumber', ingridientsNumber)
    localStorage.setItem('mealTypeOptions', mealTypeOptions)
    setExcludedTerms(excluded)
    setSearchTerm(search)
    setFilterOptionTerms(filterOptions)
    setTimeTerm(time)
    setCaloriesTerm(calories)
    setNutrientInputsTerms(nutrientInputs)
    setIngridienstNumberTerm(ingridientsNumber)
    setMealTypeOptionTerms(mealTypeOptions)
    if (allRecipesData) {
      setRecipes(allRecipesData.hits.map((hit) => hit.recipe))
      if (allRecipesData._links.next && allRecipesData._links.next.href) {
        setNextPageLink(allRecipesData._links.next.href)
      }
    }
  }

  const clearFilters = async () => {
    setSearch('')
    setExcluded([])
    setFilterOptions([])
    setTime('')
    setCalories('')
    setNutrientInputs([])
    setIngridientsNumber('')
    setMealTypeOptions([])

    searchRecipes()
  }

  const handleNutrientInputChange = (nutrientBackend, value) => {
    setNutrientInputs((prevInputs) => ({
      ...prevInputs,
      [nutrientBackend]: value
    }))
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
    <Container>
      <FormControl variant="outlined">
        <TextField
          label="Search recipes"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
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
          sx={{ minWidth: '200px' }}
        >
          {healthFilterOptions.map((option) => (
            <MenuItem key={option} value={option} sx={{ minWidth: '200px', backgroundColor: 'white' }}>
              <Checkbox checked={filterOptions.includes(option)} />
              <ListItemText primary={option}/>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined">
        <InputLabel>Filter by type of meal</InputLabel>
        <Select
          multiple
          value={mealTypeOptions}
          onChange={(event) => setMealTypeOptions(event.target.value)

          }
          renderValue={(selected) => selected.join(', ')}
          sx={{ minWidth: '200px' }}
        >
          {mealTypes.map((option) => (
            <MenuItem key={option} value={option} sx={{ minWidth: '200px', backgroundColor: 'white' }}>
              <Checkbox checked={mealTypeOptions.includes(option)} />
              <ListItemText primary={option}/>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined">
        <TextField
          label="Calories"
          value={calories}
          onChange={(event) => setCalories(event.target.value)}
        />
      </FormControl>

      <FormControl variant="outlined">
        <TextField
          label="Time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
        />
      </FormControl>

      <FormControl variant="outlined">
        <TextField
          label="Number of incridients"
          value={ingridientsNumber}
          onChange={(event) => setIngridientsNumber(event.target.value)}
        />
      </FormControl>

      {nutrients.map((nutrient) => (
        <FormControl key={nutrient.backend} variant="outlined">
          <TextField
            label={nutrient.user}
            value={nutrientInputs[nutrient.backend] || ''}
            onChange={(event) => {
              handleNutrientInputChange(nutrient.backend, event.target.value)
            }}
          />
        </FormControl>
      ))}

      <Button variant="contained" onClick={searchRecipes}>
          Search
      </Button>

      <Button variant="contained" onClick={clearFilters}>
          Clear
      </Button>

      <h2>Check recommended recipes or feel free to search recipes yourself</h2>
      {isLoading || isFetching ? (
        <CircularProgress /> // Render the loading spinner when loading is true
      ) : recipes.length !== 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {recipes.map((recipe) => (
            <Recipe key={recipe.uri} recipe={recipe} />
          ))}
        </div>
      ) : (
        <h3>No recipes found</h3>
      )
      }

      {nextPageLink && (
        <Button variant="outlined" onClick={goToNextPage}>
          Load more
        </Button>
      )}
    </Container>
  )
}

export default SearchPage