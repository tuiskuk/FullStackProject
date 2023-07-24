import RecipeCard from './RecipeCard'
import { useState, useEffect } from 'react'
import { useGetAllRecipesQuery, useGetNextPageQuery } from '../services/apiSlice'
import { healthFilterOptions, nutrients, mealTypes } from '../data'
import { Container, Button, FormControl, Select, MenuItem,
  InputLabel, Checkbox, ListItemText, CircularProgress,
  OutlinedInput, Box, Chip, Typography, InputAdornment } from '@mui/material'

const SearchPage = () => {
  const [recipes, setRecipes] = useState([])
  const [nextPageLink, setNextPageLink] = useState('')

  const [search, setSearch] = useState(localStorage.getItem('search') ||'')
  const [searchTerm, setSearchTerm] = useState('')

  const [excludedChip, setExcludedChip] = useState('')
  const [excludedChipArray, setExcludedChipArray] = useState(JSON.parse(localStorage.getItem('excludedChips')) || [])
  const [excludedChipArrayTerms, setExcludedChipArrayTerms] = useState([])

  const [time, setTime] = useState(localStorage.getItem('time') || '')
  const [timeTerm, setTimeTerm] = useState('')

  const [calories, setCalories] = useState(localStorage.getItem('calories') || '')
  const [caloriesTerm, setCaloriesTerm] = useState('')

  const [filterOptions, setFilterOptions] = useState(JSON.parse(localStorage.getItem('filterOptions')) || [])
  const [filterOptionTerms, setFilterOptionTerms] = useState([])

  const [nutrientInputs, setNutrientInputs] = useState(JSON.parse(localStorage.getItem('nutrientInputs')) || [])
  const [nutrientInputsTerms, setNutrientInputsTerms] = useState([])

  const [ingridientsNumber, setIngridientsNumber] = useState(localStorage.getItem('ingridientsNumber') || '')
  const [ingridientsNumberTerm, setIngridienstNumberTerm] = useState('')

  const [mealTypeOptions, setMealTypeOptions] = useState(JSON.parse(localStorage.getItem('mealTypeOptions')) || [])
  const [mealTypeOptionTerms, setMealTypeOptionTerms] = useState([])

  const [showNutrients, setShowNutrients] = useState(false)

  const { data: allRecipesData, isLoading, isFetching
  } = useGetAllRecipesQuery({
    searchTerm: searchTerm || 'recommended',
    filterOptionTerms: filterOptionTerms || [],
    timeTerm: timeTerm || '',
    caloriesTerm: caloriesTerm || '',
    nutrientInputsTerms: nutrientInputsTerms || [],
    ingridientsNumberTerm: ingridientsNumberTerm || '',
    mealTypeOptionTerms: mealTypeOptionTerms || [],
    excludedChipArrayTerms: excludedChipArrayTerms || []
  })
  const { data: NextPageData } = useGetNextPageQuery(
    nextPageLink, { skip: !nextPageLink, refetchOnMountOrArgChange: true })

  useEffect(() => {
    searchRecipes()
  }, [allRecipesData])

  const searchRecipes = async () => {
    localStorage.setItem('time', time)
    localStorage.setItem('calories', calories)
    localStorage.setItem('excludedChips', JSON.stringify(excludedChipArray))
    localStorage.setItem('filterOptions', JSON.stringify(filterOptions))
    localStorage.setItem('search', search)
    localStorage.setItem('nutrientInputs', JSON.stringify(nutrientInputs))
    localStorage.setItem('ingridientsNumber', ingridientsNumber)
    localStorage.setItem('mealTypeOptions', JSON.stringify(mealTypeOptions))
    setExcludedChipArrayTerms(excludedChipArray)
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
    setExcludedChipArray([])
    setFilterOptions([])
    setTime('')
    setCalories('')
    setNutrientInputs([])
    setIngridientsNumber('')
    setMealTypeOptions([])

    await searchRecipes()
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

  const handleAddExcludedFood = () => {
    if (excludedChip.trim()) {
      setExcludedChipArray([...excludedChipArray, excludedChip.trim()])
      setExcludedChip('')
    }
  }

  const handleDeleteChip = (index) => {
    const updatedExcludedArray = [...excludedChipArray]
    updatedExcludedArray.splice(index, 1)
    setExcludedChipArray(updatedExcludedArray)
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
                  maxHeight: 400,
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
                  maxHeight: 400,
                  width: 200
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
      </div>

      <div>
        <FormControl variant="outlined" sx={{ m: 0.5, width: 250 }}>
          <RangeInputComponent
            value={time || ''}
            nameUser={'Time'}
            unit={'min'}
            onChange={setTime}
          />
        </FormControl>

        <FormControl variant="outlined" sx={{ m: 0.5, width: 250 }}>
          <Box display='flex' flexWrap='wrap' gap={0.5}>
            {excludedChipArray.map((value, index) => (
              <Chip key={index} label={value} onDelete={() => handleDeleteChip(index)}/>
            ))}
            <OutlinedInput
              placeholder="Set excluded foods"
              value={excludedChip}
              onChange={(event) => setExcludedChip(event.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddExcludedFood}
                  >
                    Add
                  </Button>
                </InputAdornment>
              }
            />
          </Box>
        </FormControl>

        <FormControl variant="outlined" sx={{ m: 0.5, width: 250 }}>

          <RangeInputComponent
            value={calories || ''}
            nameUser={'Calories'}
            unit={'kcal'}
            onChange={setCalories}
          />
        </FormControl>

        <FormControl variant="outlined" sx={{ m: 0.5, width: 250 }}>
          <RangeInputComponent
            value={ingridientsNumber || ''}
            nameUser={'Number of incridients'}
            unit={'pcs'}
            onChange={setIngridientsNumber}
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
          <div>
            {nutrients.map((nutrient) => {
              return (
                <FormControl key={nutrient.backend} sx={{ m: 0.5, width: 250 }} variant="outlined">
                  <RangeInputComponent
                    value={nutrientInputs[nutrient.backend] || ''}
                    nameBackend={nutrient.backend}
                    nameUser={nutrient.user}
                    unit={nutrient.unit}
                    onChange={handleNutrientInputChange}
                  />
                </FormControl>
              )
            })}
          </div>
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
            <RecipeCard key={recipe.uri} recipe={recipe} />
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

const RangeInputComponent = ({ value, nameBackend, nameUser, unit, onChange }) => {
  const [minValue, setMinValue] = useState('')
  const [maxValue, setMaxValue] = useState('')

  useEffect(() => {
    analyze()
  }, [])

  useEffect(() => {
    handleParse()
  }, [minValue, maxValue])

  const handleMinValueChange = (event) => {
    const valueMin = event.target.value
    const newValue = parseInt(valueMin)
    if (valueMin === '0'){
      setMinValue('')
    } else {
      if (newValue <= maxValue || !maxValue) {
        setMinValue(valueMin)
      } else {
        if (newValue >= minValue) {
          setMaxValue(valueMin)
          setMinValue(valueMin)
        } else {
          setMinValue('')
        }
      }
    }
  }

  const handleMaxValueChange = (event) => {
    const valueMax = event.target.value
    const newValue = parseInt(valueMax)

    if (valueMax === '0'){
      setMaxValue('')
    } else {
      if (newValue >= minValue || !minValue) {
        setMaxValue(valueMax)
      } else {
        if (newValue < maxValue) {
          setMaxValue('')
        } else {
          setMaxValue(minValue)
        }
      }
    }
  }

  const analyze = () => {
    if (value.includes('-')) {
      setMinValue(value.split('-')[0])
      setMaxValue(value.split('-')[1])
    } else if (value.includes('+')) {
      setMinValue(value.split('+')[0])
      setMaxValue('')
    } else if (value) {
      setMinValue('')
      setMaxValue(value)
    } else {
      setMinValue('')
      setMaxValue('')
    }
  }

  const handleParse = () => {
    let string = ''
    if (minValue && maxValue) {
      string = `${minValue}-${maxValue}`
    } else if (minValue && !maxValue) {
      string = `${minValue}+`
    } else if (!minValue && maxValue) {
      string = `${maxValue}`
    } else {
      string = ''
    }

    if (nameBackend) {
      onChange(nameBackend, string)
    } else {
      onChange(string)
    }
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
        p={0.5}
        borderRadius="4px"
        mb={0.5}
        justifyContent="space-between"
      >
        <Typography variant="body1">{nameUser}</Typography>
        <Typography variant="body1">{unit}</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <FormControl variant="outlined" >
          <OutlinedInput
            placeholder="MIN"
            type="number"
            inputProps={{ min: '0' }}
            value={minValue}
            onChange={handleMinValueChange}
            size="small"
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
            size="small"
          />
        </FormControl>
      </Box>
    </Box>
  )
}

export default SearchPage