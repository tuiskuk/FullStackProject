import RecipeCard from '../components/RecipeCard'
import { useState, useEffect } from 'react'
import { useGetAllRecipesQuery, useGetNextPageQuery } from '../services/apiSlice'
import { healthFilterOptions, nutrients, mealTypes, cuisineOptions, dishOptions } from '../data'
import { Button, FormControl, Select, MenuItem, Checkbox, ListItemText, CircularProgress,
  OutlinedInput, Box, Chip, Typography, InputAdornment, Grid, Paper, IconButton, AppBar, Toolbar, Autocomplete, TextField,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CancelIcon from '@mui/icons-material/Cancel'
import './Search.css'
import RangeInputComponent from '../components/RangeInputComponent'
import NutrientDialog from '../dialogs/NutrientDialog'

const SearchPage = () => {
  localStorage.clear()
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

  const [cuisineTypes, setCuisineTypes] = useState(JSON.parse(localStorage.getItem('cuisineTypes')) || [])
  const [cuisineTypeTerms, setCuisineTypeTerms] = useState([])

  const [dishTypes, setDishTypes] = useState(JSON.parse(localStorage.getItem('dishTypes')) || [])
  const [dishTypeTerms, setDishTypeTerms] = useState([])

  const [nutrientInputs, setNutrientInputs] = useState(JSON.parse(localStorage.getItem('nutrientInputs')) || [])
  const [nutrientInputsTerms, setNutrientInputsTerms] = useState([])

  const [ingridientsNumber, setIngridientsNumber] = useState(localStorage.getItem('ingridientsNumber') || '')
  const [ingridientsNumberTerm, setIngridienstNumberTerm] = useState('')

  const [mealTypeOptions, setMealTypeOptions] = useState(JSON.parse(localStorage.getItem('mealTypeOptions')) || [])
  const [mealTypeOptionTerms, setMealTypeOptionTerms] = useState([])

  const [clear, setClear] = useState(false)

  const [selectedNutrient, setSelectedNutrient] = useState({})
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: allRecipesData, isLoading, isFetching
  } = useGetAllRecipesQuery({
    searchTerm: searchTerm || '',
    filterOptionTerms: filterOptionTerms || [],
    cuisineTypeTerms: cuisineTypeTerms || [],
    dishTypeTerms: dishTypeTerms || [],
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
    localStorage.setItem('cuisineTypes', JSON.stringify(cuisineTypes))
    localStorage.setItem('dishTypes', JSON.stringify(dishTypes))
    localStorage.setItem('search', search)
    localStorage.setItem('nutrientInputs', JSON.stringify(nutrientInputs))
    localStorage.setItem('ingridientsNumber', ingridientsNumber)
    localStorage.setItem('mealTypeOptions', JSON.stringify(mealTypeOptions))
    setExcludedChipArrayTerms(excludedChipArray)
    setSearchTerm(search)
    setFilterOptionTerms(filterOptions)
    setCuisineTypeTerms(cuisineTypes)
    setDishTypeTerms(dishTypes)
    setTimeTerm(time)
    setCaloriesTerm(calories)
    setNutrientInputsTerms(nutrientInputs)
    setIngridienstNumberTerm(ingridientsNumber)
    setMealTypeOptionTerms(mealTypeOptions)
    setNextPageLink('')
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
    setCuisineTypes([])
    setDishTypes([])
    setTime('')
    setCalories('')
    setNutrientInputs([])
    setIngridientsNumber('')
    setMealTypeOptions([])
    setClear(!clear)
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

  const handleDeleteMealTypeChip = (index) => {
    const updatedMealOptions = [...mealTypeOptions]
    updatedMealOptions.splice(index, 1)
    setMealTypeOptions(updatedMealOptions)
  }

  const handleDeleteAllergyChip = (index) => {
    const updatedAllergies = [...filterOptions]
    updatedAllergies.splice(index, 1)
    setFilterOptions(updatedAllergies)
  }

  const handleDeleteCuisineChip = (index) => {
    const updatedCuisines = [...cuisineTypes]
    updatedCuisines.splice(index, 1)
    setCuisineTypes(updatedCuisines)
  }
  const handleDeleteDishChip = (index) => {
    const updatedDishes = [...dishTypes]
    updatedDishes.splice(index, 1)
    setDishTypes(updatedDishes)
  }
  const handleOptionClick = (option) => {
    console.log(option)
    setSelectedNutrient(option)
    setDialogOpen(true)
    console.log(selectedNutrient)
  }

  return (
    <Grid container spacing={1} paddingTop={1}>
      <Grid item xs={12}>
        <Paper className='image-container' >
          <img
            src='/images/searchBanner.png'
            className='search-banner'
          />
          <div className='image-items' >
            <Typography variant="h4" fontWeight="bold" color="white">
                Search Recipes!
            </Typography>
            <FormControl fullWidth variant="outlined">
              <OutlinedInput
                className='input'
                placeholder='Search recipes'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    searchRecipes()
                  }
                }}
                endAdornment={
                  <InputAdornment position="end" className='search-end-adorment'>
                    <IconButton
                      onClick={searchRecipes}
                    >
                      <img
                        src="/vectors/magnifyingGlass.svg"
                        alt="Search"
                      />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Box className='chip-box'>
              {mealTypeOptions.map((value, index) => (
                <Chip
                  className='chip-meal'
                  key={value}
                  label={value}
                  onDelete={() => handleDeleteMealTypeChip(index)}
                />
              ))}
              {filterOptions.map((value, index) => (
                <Chip
                  className='chip-allergy'
                  key={value}
                  label={value}
                  onDelete={() => handleDeleteAllergyChip(index)}
                />
              ))}
              {cuisineTypes.map((value, index) => (
                <Chip
                  className='chip-cuisine'
                  key={value}
                  label={value}
                  onDelete={() => handleDeleteCuisineChip(index)}
                />
              ))}
              {dishTypes.map((value, index) => (
                <Chip
                  className='chip-dish'
                  key={value}
                  label={value}
                  onDelete={() => handleDeleteDishChip(index)}
                />
              ))}
              {excludedChipArray.map((value, index) => (
                <Chip
                  className='chip-excluded'
                  key={value}
                  label={value}
                  onDelete={() => handleDeleteChip(index)}
                />
              ))}
            </Box>
          </div>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <AppBar position="static" >
          <Toolbar className='toolbar-container' >
            <Select
              variant="outlined"
              sx={{
                boxShadow: 'none',
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                backgroundColor: 'transparent',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
              multiple
              displayEmpty
              value={mealTypeOptions}
              onChange={(event) => setMealTypeOptions(event.target.value)}
              renderValue={(selected) => {
                if (selected) {
                  return <Typography>Meal Types</Typography>
                } else {
                  return <Typography>Meal Types</Typography>
                }
              }}
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
                <MenuItem key={option} value={option} >
                  <Checkbox size='small' checked={mealTypeOptions.includes(option)} />
                  <ListItemText primary={option}/>
                </MenuItem>
              ))}
            </Select>
            <Select
              sx={{
                boxShadow: 'none',
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                backgroundColor: 'transparent',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
              multiple
              displayEmpty
              value={filterOptions}
              onChange={(event) => setFilterOptions(event.target.value)}
              renderValue={(selected) => {
                if (selected) {
                  return <Typography >Allergies/Diets</Typography>
                }else {
                  return <Typography>Allergies/Diets</Typography>
                }

              }}
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
                <MenuItem key={option} value={option}>
                  <Checkbox size='small' checked={filterOptions.includes(option)} />
                  <ListItemText primary={option}/>
                </MenuItem>
              ))}
            </Select>
            <Select
              sx={{
                boxShadow: 'none',
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                backgroundColor: 'transparent',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
              multiple
              displayEmpty
              value={cuisineTypes}
              onChange={(event) => setCuisineTypes(event.target.value)}
              renderValue={(selected) => {
                if (selected) {
                  return <Typography>Cuisine</Typography>
                } else {
                  return <Typography>Cuisine</Typography>
                }

              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400,
                    width: 200
                  }
                }
              }}
            >
              {cuisineOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox size='small' checked={cuisineTypes.includes(option)} />
                  <ListItemText primary={option}/>
                </MenuItem>
              ))}
            </Select>
            <Select
              sx={{
                boxShadow: 'none',
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                backgroundColor: 'transparent',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
              multiple
              displayEmpty
              value={dishTypes}
              onChange={(event) => setDishTypes(event.target.value)}
              renderValue={(selected) => {
                if (selected) {
                  return <Typography>Dish</Typography>
                } else {
                  return <Typography>Dish</Typography>
                }

              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400,
                    width: 200
                  }
                }
              }}
            >
              {dishOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox size='small' checked={dishTypes.includes(option)} />
                  <ListItemText primary={option}/>
                </MenuItem>
              ))}
            </Select>
            <FormControl variant="outlined" sx={{ m: 0.5, width: 250 }}>
              <OutlinedInput
                placeholder="Set excluded foods"
                value={excludedChip}
                onChange={(event) => setExcludedChip(event.target.value)}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    handleAddExcludedFood()
                  }
                }}
                sx={{
                  backgroundColor: 'white',
                  paddingRight: 1
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleAddExcludedFood}
                    >
                      <AddIcon/>
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Autocomplete
              multiple
              options={nutrients}
              disableCloseOnSelect
              sx={{
                backgroundColor: 'white',
                '& .MuiChip-root': {
                  display: 'none',
                },
                m: 0.5,
                width: 250,
                borderRadius: '4px'
              }}
              getOptionLabel={(option) => option.user}
              renderOption={(props, option) => (
                <li
                  {...props}
                  onClick={() => {
                    handleOptionClick(option)
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {nutrientInputs[option.backend] ? (
                    <IconButton
                      size="small"
                      style={{ marginRight: 8 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNutrientInputChange(option.backend, '') // Clear the nutrient value
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      size="small"
                      style={{ marginRight: 8 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOptionClick(option)
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  )}
                  {option.user}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} placeholder="Filter spesific nutrient" />
              )}
            />
          </Toolbar>
        </AppBar>
      </Grid>

      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', overflowX: 'auto' }}>
        <FormControl  sx={{ m: 0.5, minWidth: 200 }}>
          <RangeInputComponent
            value={time || ''}
            nameUser={'Time'}
            unit={'min'}
            onChange={setTime}
            clear={clear}
            updateUi={true}
          />
        </FormControl>

        <FormControl sx={{ m: 0.5, minWidth: 200 }}>
          <RangeInputComponent
            value={calories || ''}
            nameUser={'Calories'}
            unit={'kcal'}
            onChange={setCalories}
            clear={clear}
            updateUi={true}
          />
        </FormControl>

        <FormControl sx={{ m: 0.5, minWidth: 200 }}>
          <RangeInputComponent
            value={ingridientsNumber || ''}
            nameUser={'Number of incridients'}
            unit={'pcs'}
            onChange={setIngridientsNumber}
            clear={clear}
            updateUi={true}
          />
        </FormControl>
      </Grid>

      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', overflowX: 'auto' }}>
        {nutrients.map((nutrient) => (
          nutrientInputs[nutrient.backend] && (
            <FormControl key={nutrient.backend} sx={{ m: 0.5, minWidth: 200 }}>
              <RangeInputComponent
                value={nutrientInputs[nutrient.backend]}
                nameBackend={nutrient.backend}
                nameUser={nutrient.user}
                unit={nutrient.unit}
                onChange={handleNutrientInputChange}
                clear={clear}
                updateUi={true}
                deleted={true}
              />
            </FormControl>)
        ))}
      </Grid>

      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={searchRecipes} sx={{ m: 0.5, minWidth: 200 }}>
          Search
        </Button>

        <Button variant="contained" onClick={clearFilters} sx={{ m: 0.5, minWidth: 200 }}>
          Clear Options
        </Button>
      </Grid>

      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h5" fontWeight="bold">
          Check recommended recipes or feel free to search recipes yourself
        </Typography>
        {isLoading || isFetching ? (
          <CircularProgress /> // Render the loading spinner when loading is true
        ) : recipes.length !== 0 ? (
          <Grid container spacing={2} marginTop={1} justifyContent="space-around" >
            {recipes.map((recipe, index) => (
              <Grid item key={index}  >
                <RecipeCard key={recipe.uri} recipe={recipe} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <h3>No recipes found</h3>
        )}
      </Grid>
      <Grid item xs={12} sx={{ textAlign: 'center' }} >
        {nextPageLink && (
          <Button variant="contained" onClick={goToNextPage} sx={{ m: 0.5, width: 200 }}>
            Load more
          </Button>
        )}
      </Grid>
      {( dialogOpen && selectedNutrient ) &&
        <NutrientDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          nutrient={selectedNutrient}
          nutrientInputs={nutrientInputs}
          handleNutrientInputChange={handleNutrientInputChange}
          clear={clear}
        />}
    </Grid>
  )
}

export default SearchPage