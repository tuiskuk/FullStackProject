import Recipe from './Recipe'
import { useState, useEffect } from 'react'
import { useGetAllRecipesQuery, useGetNextPageQuery } from '../services/apiSlice'
import { healthFilterOptions, nutrients, mealTypes } from '../data'
import { Container, Button, FormControl, Select, MenuItem,
  InputLabel, Checkbox, ListItemText, CircularProgress, InputAdornment,
  OutlinedInput, Box, Chip, Typography } from '@mui/material'

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

  const [showNutrients, setShowNutrients] = useState(false)


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

  const toggelShow = () => {
    setShowNutrients(!showNutrients)
  }

  return (
    <Container>
      <FormControl fullWidth variant="outlined" sx={{ m: 0.5 }} >
        <h2>Search page</h2>
        <OutlinedInput
          placeholder='Search recipes'
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </FormControl>

      <div>
        <h3>Spesifications</h3>

        <FormControl sx={{ m: 0.5, width: 250 }}>
          <InputLabel>Meal type</InputLabel>
          <Select
            multiple
            value={mealTypeOptions}
            onChange={(event) => setMealTypeOptions(event.target.value)}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value}/>
                ))}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 500,
                  width: 200
                }
              }
            }}
          >
            {mealTypes.map((option) => (
              <MenuItem key={option} value={option} sx={{ backgroundColor: 'white' }}>
                <Checkbox size='small' checked={mealTypeOptions.includes(option)} />
                <ListItemText primary={option}/>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 0.5, width: 250 }}>
          <InputLabel>Filter allergies/diets</InputLabel>
          <Select
            multiple
            value={filterOptions}
            onChange={(event) => setFilterOptions(event.target.value)}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value}/>
                ))}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 500,
                }
              }
            }}
          >
            {healthFilterOptions.map((option) => (
              <MenuItem key={option} value={option} sx={{ backgroundColor: 'white' }}>
                <Checkbox size='small' checked={filterOptions.includes(option)} />
                <ListItemText primary={option}/>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ m: 0.5, width: 250 }}>
          <OutlinedInput
            placeholder="Set excluded foods"
            value={excluded}
            onChange={(event) => setExcluded(event.target.value)}
          />
        </FormControl>
      </div>

      <div>
        <FormControl variant="outlined" sx={{ m: 0.5, width: 250 }}>
          <OutlinedInput
            placeholder="Time"
            value={time}
            endAdornment={<InputAdornment position="end">h</InputAdornment>}
            onChange={(event) => setTime(event.target.value)}
          />
        </FormControl>

        <FormControl variant="outlined" sx={{ m: 0.5, width: 250 }}>
          <OutlinedInput
            placeholder="Calories"
            value={calories}
            endAdornment={<InputAdornment position="end">kcal</InputAdornment>}
            onChange={(event) => setCalories(event.target.value)}
          />
        </FormControl>

        <FormControl variant="outlined" sx={{ m: 0.5, width: 250 }}>
          <OutlinedInput
            placeholder="Number of incridients (MIN+, MIN-MAX, MAX)"
            value={ingridientsNumber}
            onChange={(event) => setIngridientsNumber(event.target.value)}
          />
        </FormControl>
      </div>

      <div>
        <FormControl variant="outlined" sx={{ m: 0.5, width: 250 }}>
          <Button variant="contained" onClick={toggelShow} >
            {showNutrients ? 'Hide Nutrient Filters' : 'Show Nutrients Filters'}
          </Button>
        </FormControl>

        {showNutrients && (
          nutrients.map((nutrient) => (
            <FormControl key={nutrient.backend} sx={{ m: 0.5, width: 250 }} variant="outlined">
              <RangeInputComponent
                nutrientBackend={nutrient.backend}
                nutrientUser={nutrient.user}
                nutrientUnit={nutrient.unit}
                onChange={handleNutrientInputChange}
              />
            </FormControl>
          ))
        )}

        <Button variant="contained" onClick={searchRecipes} sx={{ m: 0.5, width: 250 }}>
          Search
        </Button>

        <Button variant="contained" onClick={clearFilters} sx={{ m: 0.5, width: 250 }}>
          Clear
        </Button>
      </div>

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
      )}

      <div>
        <br />
        {nextPageLink && (
          <Button variant="contained" onClick={goToNextPage} sx={{ m: 0.5, width: 250 }}>
            Load more
          </Button>
        )}
      </div>
    </Container>
  )
}

/*
<OutlinedInput
  placeholder={nutrient.user}
  value={nutrientInputs[nutrient.backend] || ''}
  endAdornment={<InputAdornment position="end">{nutrient.unit}</InputAdornment>}
  onChange={(event) => {
    handleNutrientInputChange(nutrient.backend, event.target.value)
  }}
/>
*/

const RangeInputComponent = ({ nutrientBackend, nutrientUser, nutrientUnit, onChange }) => {
  const [minValue, setMinValue] = useState('')
  const [maxValue, setMaxValue] = useState('')

  useEffect(() => {
    handleParse()
  }, [minValue, maxValue])

  const handleMinValueChange = (event) => {
    const value = event.target.value
    if (value === '0'){
      setMinValue('')
    }else {
      setMinValue(value)
    }
  }

  const handleMaxValueChange = (event) => {
    const value = event.target.value
    if (value === '0'){
      setMaxValue('')
    }else {
      setMaxValue(value)
    }
  }

  const handleParse = () => {
    let string = ''
    if(minValue && maxValue) {
      string = `${minValue}-${maxValue}`
    } else if (minValue && !maxValue) {
      string = `${minValue}+`
    } else if (!minValue && maxValue){
      string = `${maxValue}`
    } else {
      string = ''
    }
    onChange(nutrientBackend, string)
  }

  return (
    <Box border={1}
      borderColor="grey.400"
      borderRadius="4px"
      p={1}
      mb={1}
      alignItems="center"
      bgcolor="white"
      boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)">
      <Box
        display="flex"
        alignItems="center"
        p={1}
        borderRadius="4px"
        mb={1}
        justifyContent="space-between"
      >
        <Typography variant="body1">{nutrientUser}</Typography>
        <Typography variant="body1">{nutrientUnit}</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <FormControl variant="outlined">
          <OutlinedInput
            placeholder="MIN"
            type="number"
            inputProps={{ min: '0' }}
            value={minValue}
            onChange={handleMinValueChange}
          />
        </FormControl>
        <Typography variant="body1" sx={{ mx: 1 }}>-</Typography>
        <FormControl variant="outlined">
          <OutlinedInput
            placeholder="MAX"
            type="number"
            inputProps={{ min: '0' }}
            value={maxValue}
            onChange={handleMaxValueChange}
          />
        </FormControl>
      </Box>
    </Box>
  )
}

export default SearchPage