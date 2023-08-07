import RecipeCard from '../components/RecipeCard'
import { useState, useEffect } from 'react'
import { useGetAllRecipesQuery, useGetNextPageQuery } from '../services/apiSlice'
import { healthFilterOptions, nutrients, mealTypes, cuisineOptions } from '../data'
import { Button, FormControl, Select, MenuItem, Checkbox, ListItemText, CircularProgress,
  OutlinedInput, Box, Chip, Typography, InputAdornment, Grid, Paper, IconButton, AppBar, Toolbar, Autocomplete, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CancelIcon from '@mui/icons-material/Cancel'

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

  const [cuisineTypes, setCuisineTypes] = useState(JSON.parse(localStorage.getItem('cuisineTypes')) || [])
  const [cuisineTypeTerms, setCuisineTypeTerms] = useState([])

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
    searchTerm: searchTerm || 'recommended',
    filterOptionTerms: filterOptionTerms || [],
    cuisineTypeTerms: cuisineTypeTerms || [],
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
    localStorage.setItem('search', search)
    localStorage.setItem('nutrientInputs', JSON.stringify(nutrientInputs))
    localStorage.setItem('ingridientsNumber', ingridientsNumber)
    localStorage.setItem('mealTypeOptions', JSON.stringify(mealTypeOptions))
    setExcludedChipArrayTerms(excludedChipArray)
    setSearchTerm(search)
    setFilterOptionTerms(filterOptions)
    setCuisineTypeTerms(cuisineTypes)
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
    setCuisineTypes([])
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

  const handleOptionClick = (option) => {
    console.log(option)
    setSelectedNutrient(option)
    setDialogOpen(true)
    console.log(selectedNutrient)
  }

  return (
    <Grid container spacing={1} paddingTop={1}>
      <Grid item xs={12}>
        <Paper sx={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
        }}>
          <img
            src='/images/searchBanner.png'
            style={{
              width: '100%',
              height: 'auto',
              minHeight: '280px',
              objectFit: 'cover'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '20%',
              bottom: 'auto',
              left: '10%',
              right: '10%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h4" fontWeight="bold" color="white">
                Search Recipes!
            </Typography>
            <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px' }}>
              <OutlinedInput
                placeholder='Search recipes'
                value={search}
                style={{ backgroundColor: 'white' }}
                onChange={(event) => setSearch(event.target.value)}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    searchRecipes()
                  }
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={searchRecipes}
                    >
                      <img
                        src="/vectors/magnifyingGlass.svg"
                        alt="Search"
                        style={{
                          cursor: 'pointer',
                          width: '30px',
                          height: '30px',
                        }}
                      />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', maxHeight: '105px', overflowY: 'auto' }}>
              {mealTypeOptions.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  onDelete={() => handleDeleteMealTypeChip(value)}
                  sx={{
                    backgroundColor: '#c8e6c9',
                    '&:hover': {
                      backgroundColor: '#a5d6a7',
                    },
                  }}/>
              ))}
              {filterOptions.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  onDelete={() => handleDeleteAllergyChip(value)}
                  sx={{
                    backgroundColor: '#90caf9',
                    '&:hover': {
                      backgroundColor: '#64b5f6',
                    },
                  }}/>
              ))}
              {cuisineTypes.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  onDelete={() => handleDeleteCuisineChip(value)}
                  sx={{
                    backgroundColor: '#f9cb9c',
                    '&:hover': {
                      backgroundColor: '#f9b24e',
                    },
                  }}/>
              ))}
              {excludedChipArray.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  onDelete={() => handleDeleteChip(value)}
                  sx={{
                    backgroundColor: '#ef9a9a',
                    '&:hover': {
                      backgroundColor: '#e57373',
                    },
                  }}/>
              ))}
            </Box>
          </div>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <AppBar position="static" >
          <Toolbar style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Select
              sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
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
                <MenuItem key={option} value={option} sx={{ backgroundColor: 'white' }}>
                  <Checkbox size='small' checked={mealTypeOptions.includes(option)} />
                  <ListItemText primary={option}/>
                </MenuItem>
              ))}
            </Select>
            <Select
              sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
              multiple
              displayEmpty
              value={filterOptions}
              onChange={(event) => setFilterOptions(event.target.value)}
              renderValue={(selected) => {
                if (selected) {
                  return <Typography>Allergies/Diets</Typography>
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
                <MenuItem key={option} value={option} sx={{ backgroundColor: 'white' }}>
                  <Checkbox size='small' checked={filterOptions.includes(option)} />
                  <ListItemText primary={option}/>
                </MenuItem>
              ))}
            </Select>
            <Select
              sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
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
                <MenuItem key={option} value={option} sx={{ backgroundColor: 'white' }}>
                  <Checkbox size='small' checked={cuisineTypes.includes(option)} />
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
              style={{ width: 500 }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Filter spesific nutrient" />
              )}
            />
          </Toolbar>
        </AppBar>
      </Grid>

      <Grid item xs={12}>
        <FormControl variant="outlined" sx={{ m: 0.5, width: 250 }}>
          <RangeInputComponent
            value={time || ''}
            nameUser={'Time'}
            unit={'min'}
            onChange={setTime}
            clear={clear}
            updateUi={true}
          />
        </FormControl>

        <FormControl variant="outlined" sx={{ m: 0.5, width: 250 }}>
          <RangeInputComponent
            value={calories || ''}
            nameUser={'Calories'}
            unit={'kcal'}
            onChange={setCalories}
            clear={clear}
            updateUi={true}
          />
        </FormControl>

        <FormControl variant="outlined" sx={{ m: 0.5, width: 250 }}>
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

      <Grid item xs={12}>
        {nutrients.map((nutrient) => (
          nutrientInputs[nutrient.backend] && (
            <FormControl key={nutrient.backend} sx={{ m: 0.5, width: 250 }} variant="outlined">
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

      <Grid item xs={12}>
        <Button variant="contained" onClick={searchRecipes} sx={{ m: 0.5, width: 250 }}>
          Search
        </Button>

        <Button variant="contained" onClick={clearFilters} sx={{ m: 0.5, width: 250 }}>
          Clear Options
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" fontWeight="bold" paddingLeft={1}>
          Check recommended recipes or feel free to search recipes yourself
        </Typography>
        {isLoading || isFetching ? (
          <CircularProgress /> // Render the loading spinner when loading is true
        ) : recipes.length !== 0 ? (
          <Grid container spacing={2} marginTop={1} justifyContent="space-around" >
            {recipes.map((recipe, index) => (
              <Grid item key={index}>
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
          <Button variant="contained" onClick={goToNextPage} sx={{ m: 0.5, width: 250 }}>
            Load more
          </Button>
        )}
      </Grid>
      {( dialogOpen && selectedNutrient ) && <NutrientDialog
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

const RangeInputComponent = ({ value, nameBackend, nameUser, unit, onChange, clear, update, updateUi, deleted }) => {
  //If updateUi is true can set min and max to empty, just one of them and other will leave 1
  const [minValue, setMinValue] = useState('')
  const [maxValue, setMaxValue] = useState('')

  useEffect(() => {
    console.log(value)
    if(value){
      analyze()
    }
  }, [])

  useEffect(() => {
    analyze()
  }, [clear])

  useEffect(() => {
    if (updateUi && value) {
      analyze()
    }
  }, [value])

  useEffect(() => {
    if (update) {
      console.log('update')
      handleParse()
    }
  }, [minValue, maxValue, update])

  useEffect(() => {
    console.log(minValue, maxValue)
    if(updateUi && (minValue || maxValue)) {
      console.log('moi')
      handleParse()
    }
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {deleted && (
            <IconButton
              onClick={() => onChange(nameBackend, '')}
              size="small"
            >
              <CancelIcon />
            </IconButton>)}
          <Typography variant="body1">{unit}</Typography>
        </div>
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

const NutrientDialog = ({ open, onClose, nutrient, nutrientInputs, handleNutrientInputChange, clear }) => {
  const [update, setUpdate] = useState(false)
  console.log(nutrient)

  useEffect(() => {
    if (update && open) {
      onClose()
      setUpdate(false) // Reset the update state after closing
    }
  }, [update, onClose, open])

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Set Nutrient Details</DialogTitle>
      <DialogContent>
        <RangeInputComponent
          value={nutrientInputs[nutrient.backend] || ''}
          nameBackend={nutrient.backend}
          nameUser={nutrient.user}
          unit={nutrient.unit}
          onChange={handleNutrientInputChange}
          clear={clear}
          update={update}/>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => {
          setUpdate(true)
        }} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SearchPage