import { useCreateInteractionMutation, useUpdateInteractionMutation } from '../services/interactionSlice'
import { useUploadRecipePictureMutation } from '../services/pictureHandlerApiSlice'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { selectCurrentUser } from '../services/loginSlice'
import { useSelector } from 'react-redux'
import { useMediaQuery, TextField, Container,  Grid, Tooltip, Box, ImageListItem, ImageListItemBar, IconButton, Button, Snackbar, Alert, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { cuisineOptions, dishOptions, healthFilterOptions, mealTypes } from '../data'
import WarningDialog from '../dialogs/WarningDialog'
import OptionsDialog from '../dialogs/SelectOptionsForRecipeDialog'
import { useLocation, useNavigate } from 'react-router-dom'
import './CreateRecipes.css'


const CreateRecipePage = () => {
  const [recipe, setRecipe] = useState({})
  const location = useLocation()
  const navigate = useNavigate()
  const pathName = location.pathname
  const isEditing = pathName === '/editRecipe' ? true : false
  const isScreenSmall = useMediaQuery('(max-width: 800px)')



  //hooks related to recipe pictures
  const fileInputRef = useRef(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [imageIndex, setImageIndex] = useState(-1)
  const [recipeId, setRecipeId] = useState('')

  //user and show varnig dialog variable
  const user = useSelector(selectCurrentUser)
  const [showWarningDialog, setShowWarningDialog] = useState(false)

  //state variables related to snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snacbarSeverity, setSnacbarSeverity] = useState('error')


  //state variables for creating ingredient object
  const [measureAmount, setMeasureAmount] = useState('')
  const [measure, setMeasure] = useState('')
  const [ingredientName, setIngredientName] = useState('')
  const [recommendBrand, setRecommendBrand] = useState('')
  const [ingredients,setIngredients] = useState([])


  //state variables for storing depicting filter options
  const [selectedMealTypes, setSelectedMealTypes] = useState([])
  const [selectedDishTypes, setSelectedDishTypes] = useState([])
  const [selectedCuisineTypes, setSelectedCuisineTypes] = useState([])
  const [selectedHealthFilters, setSelectedHealthFilters] = useState([])

  // Dialog state variables. selectedMealTypes etc are chosen in dialog
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [dialogOptions, setDialogOptions] = useState([])
  const [dialogSelectedOptions, setDialogSelectedOptions] = useState([])

  //redux Toolkit hooks for creating recipe and uploading its pictures
  const [ createInteraction ] = useCreateInteractionMutation()
  const [ uploadRecipePicture ] = useUploadRecipePictureMutation()
  const [ updateInteraction ] = useUpdateInteractionMutation()

  console.log(isEditing)



  const { handleSubmit, control, formState: { errors }, trigger, reset, setValue } = useForm()

  const fetchImageBlob = async (imageUrl) => {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    return blob
  }

  useEffect(() => {
    if (isEditing) {
      console.log('isEditing is true')
      const recipeData = sessionStorage.getItem('recipe')
      const parsedRecipe = JSON.parse(recipeData)
      if(!parsedRecipe) navigate('/')
      if (parsedRecipe && parsedRecipe.creator) {
        console.log(parsedRecipe.creator)
        console.log('parcing recipe')
        console.log(parsedRecipe)
        setValue('label', parsedRecipe.label)
        setValue('instructions', parsedRecipe.instructions)
        setValue('recipeYield', parsedRecipe.yield)
        setValue('totalTime', parsedRecipe.totalTime)
        setRecipe(parsedRecipe)
        setSelectedMealTypes(parsedRecipe.mealType || [])
        setSelectedDishTypes(parsedRecipe.dishType || [])
        setSelectedCuisineTypes(parsedRecipe.cuisineType || [])
        setSelectedHealthFilters(parsedRecipe.healthLabels || [])
        setIngredients(parsedRecipe.ingredients || [])
        setRecipeId(parsedRecipe.recipeId || '')
        const imageUrls = parsedRecipe.images || []

        // Convert image URLs to File objects
        const imageFilesPromises = imageUrls?.map(async (imageUrl) => {
          const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1).replace(/^\d+/, '')
          const imageBlob = await fetchImageBlob(imageUrl)
          return new File([imageBlob], fileName, { type: 'image/jpeg' })
        })

        Promise.all(imageFilesPromises)
          .then((imageFiles) => {
            setSelectedFiles(imageFiles)
          })
          .catch((error) => {
            console.error('Error fetching and creating image files:', error)
          })

        // Update selectedFiles state with imageFiles
        setImageIndex(imageUrls.length > 0 ? imageUrls.length - 1 : -1)
        console.log('selectedFiles:', selectedFiles)
        console.log('imageIndex:', imageIndex)

      }
    }
    else {
      // Reset the form values when navigating from edit to create
      console.log('else block')
      setIngredients([])
      setSelectedFiles([])
      setSelectedMealTypes([])
      setSelectedCuisineTypes([])
      setSelectedDishTypes([])
      setSelectedHealthFilters([])
      setValue('label', '')
      setValue('instructions', '')
      setValue('recipeYield', '')
      setValue('totalTime', '')
      setImageIndex(-1)
    }
    setRecipe({})
  }, [isEditing, location.pathname, reset])

  console.log(control)

  console.log(selectedFiles, selectedCuisineTypes)

  const handleBlur = (field) => {
    trigger(field.name)
  }

  const handleAddImageClick = () => {
    // Programmatically trigger the file input click
    fileInputRef.current.click()
  }

  const handleToLeftImage = () => {
    if(imageIndex > 0) {
      setImageIndex(imageIndex - 1)
    } else {
      setImageIndex(selectedFiles?.length - 1)
    }
  }

  const handleToRightImage = () => {
    if(imageIndex < (selectedFiles?.length - 1)) {
      setImageIndex(imageIndex + 1)
    } else {
      setImageIndex(0)
    }
  }

  //function to delete files to selectedFiles property
  const handleDeletePicture = () => {
    const confirmed = window.confirm('Are you sure you want to delete this picture?')
    if (confirmed) {
      const updatedFiles = [...selectedFiles]
      updatedFiles.splice(imageIndex, 1)
      if(imageIndex === selectedFiles?.length - 1) {
        setImageIndex(prevIndex => prevIndex - 1)
      }
      setSelectedFiles(updatedFiles)
    }
  }

  //function to add files to selectedFiles property
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    console.log(file)
    if (file) {
      setImageIndex(prevIndex => prevIndex + 1) //this is why imageIdexes initial state is -1
      setSelectedFiles((prevFiles) => [...prevFiles, file])
    }
    console.log(imageIndex,selectedFiles)
  }
  console.log(selectedFiles)
  console.log(imageIndex)

  //function to add ingredient
  const handleAddIngredient = () => {
    if (!measureAmount || !measure || !ingredientName) {
      console.log('if entered')
      showSnackbar('all ingredients must have name, measure and amount of ingredient','error')
      return
    }

    const ingredientObject = {
      text: `${measure} ${ingredientName} ${recommendBrand ? `(recommended ${recommendBrand})` : ''}`,
      quantity: measureAmount
    }
    setIngredients((prevIngredients) => [...prevIngredients, ingredientObject])

    // Clear ingredient fields
    setMeasureAmount('')
    setMeasure('')
    setIngredientName('')
    setRecommendBrand('')
  }

  //functino to remove ingredient
  const handleRemoveIngredient = (i) => {
    setIngredients((prevIngredients) => {
      const updatedIngredients = [...prevIngredients]
      updatedIngredients.splice(i, 1)
      return updatedIngredients
    })
  }

  //function to handle opening snacbar
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message)
    setSnacbarSeverity(severity)
    setSnackbarOpen(true)
  }

  //function to handle opening dialg where mealtypes etc are chosen
  const openOptionsDialog = (title, options, selectedOptions) => {
    setDialogTitle(title)
    setDialogOptions(options)
    setDialogSelectedOptions(selectedOptions)
    setOpenDialog(true)
    console.log(dialogOptions)
    console.log(dialogSelectedOptions)
  }

  //function ot handle creating recipe
  const onSubmit = async (submitData) => {
    if (!user) {
      setShowWarningDialog(true)
      return
    }

    if (selectedFiles.length === 0) {
      showSnackbar('Recipe mut have at least one picture','error')
      return
    } else if (ingredients.length === 0) {
      showSnackbar('Remember to input ingredients','error')
      return
    }

    const updateOperation = isEditing
    console.log(updateOperation)
    console.log(recipe.recipeId)

    try {
      if (Object.keys(errors).length === 0) {
        const {
          recipeYield,
          totalTime,
          ...restSubmitData
        } = submitData

        const interactionData = {
          ...restSubmitData,
          ingredients: ingredients,
          mealType: selectedMealTypes,
          dishType: selectedDishTypes,
          cuisineType: selectedCuisineTypes,
          healthLabels: selectedHealthFilters,
          creator: user?.id,
          recipeYield: parseInt(recipeYield),
          totalTime: parseInt(totalTime)
        }

        console.log(interactionData)

        let response
        if (updateOperation) {
          // Update the existing recipe
          console.log('update operation')
          interactionData.recipeId = recipeId
          response = await updateInteraction(interactionData)// You need to implement updateInteraction function
          console.log(response)
          const imageResponse = await uploadRecipePicture({ files: selectedFiles, id: response?.data?.id })
          console.log('recipes pictures uploaded and added to recipes image property,', imageResponse?.data?.recipeImages)
          showSnackbar('Recipe updated','success')
        } else {
          // Create a new recipe
          console.log('create recipe')
          response = await createInteraction(interactionData)
          const imageResponse = await uploadRecipePicture({ files: selectedFiles, id: response?.data?.savedRecipe?.id })
          console.log('recipes pictures uploaded and added to recipes image property,', imageResponse?.data?.recipeImages)
          console.log('recipe created', response?.data?.savedRecipe)
          showSnackbar('Recipe created','success')
        }

        console.log(response)


        //reset everything
        reset()
        setIngredients([])
        setSelectedFiles([])
        setSelectedMealTypes([])
        setSelectedCuisineTypes([])
        setSelectedDishTypes([])
        setSelectedHealthFilters([])
        setImageIndex(-1)
      }
    } catch (error) {
      console.error('An error while creating or updating recipe:', error)
      // Handle the error, show a message to the user, etc.
    }
  }

  console.log(selectedFiles[imageIndex])




  return (
    <div className='create-recipe-page'>
      <Container maxWidth="md" className="container" >

        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <form onSubmit={handleSubmit(onSubmit)}>

            <Grid item xs={isScreenSmall ? 12 : 6} sx={{ margin: '0 auto', width: '100%', textAlign: 'center', marginBottom: 4, marginTop: 6 }}>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000} // Adjust the duration as needed
                onClose={() => setSnackbarOpen(false)}
              >
                <Alert
                  onClose={() => setSnackbarOpen(false)}
                  severity={snacbarSeverity}
                  sx={{ width: '100%' }}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
              <Typography variant="h5" className="body" sx={{ marginTop: 3 }}>Give a Label to Your Recipe</Typography>
              <Controller
                name="label"
                control={control}
                defaultValue=''
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="label"
                    {...field}
                    error={!!errors.label}
                    helperText={errors.label ? 'Label is required' : ''}
                    onBlur={() => handleBlur(field)}
                    fullWidth
                  />
                )}
              />
              <Typography variant="h5">Add Pictures to Depict Your Recipe</Typography>
            </Grid>

            <Grid item xs={isScreenSmall ? 12 : 6} sx={{ marginBottom: 6, margin: '0 auto', width: '100%', textAlign: 'center' }}>
              {selectedFiles?.length === 0 ? ( <Tooltip title='click here to add pictures to your recipe'>
                <Box onClick={handleAddImageClick}
                  sx={{
                    backgroundColor: 'grey',
                    padding: '10px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center', // Center vertically
                    height: '250px',
                    width: '300px',
                  }}
                >
                  <AddAPhotoIcon sx={{ fontSize: '78px' }} />
                </Box>
              </Tooltip> ) : (
                <ImageListItem sx={{ height: '250px', width: '300px', objectFit: 'cover', minHeight: '280px'  }}>
                  <img
                    src={

                      selectedFiles[imageIndex] ? URL.createObjectURL(selectedFiles[imageIndex]) : ''

                    }
                    alt={selectedFiles[imageIndex]?.name || '...loading'}
                    style={{ width: '100%', height: '100%' }}
                  />
                  <ImageListItemBar
                    actionIcon={
                      <>
                        <IconButton onClick={handleToLeftImage}
                          key={'lefticon'}
                          sx={{ color: 'white' }}>
                          <ArrowBackIosNewIcon/>
                        </IconButton>
                        <IconButton onClick={handleToRightImage}
                          key={'righticon'}
                          sx={{ color: 'white' }}>
                          <ArrowForwardIosIcon/>
                        </IconButton>
                        <Tooltip title="add more pictures">
                          <IconButton sx={{ color: 'white' }} onClick={handleAddImageClick}>
                            <AddAPhotoIcon/>
                          </IconButton>
                        </Tooltip>
                        <IconButton sx={{ color: 'white' }} onClick={handleDeletePicture}>
                          <DeleteIcon/>
                        </IconButton>
                      </>}
                  />
                </ImageListItem>)}
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </Grid>

            <Grid item sx={{ marginTop: 4 }}>
              <Typography variant="h5">Add Ingredients to Your Recipe</Typography>
            </Grid>

            {ingredients?.length > 0 && (
              <Grid item>
                <h3>List of ingredients in a way other users will see them</h3>
                {ingredients.map((ingredient, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <h3 style={{ marginRight: '10px' }}>{`${index + 1}. ${ingredient?.quantity} ${ingredient?.text}`}</h3>
                    <Button
                      variant="outlined"
                      size="small"
                      style={{ backgroundColor: 'red', color: 'black' }}
                      onClick={() => handleRemoveIngredient(index)}
                    >
                  Remove
                    </Button>
                  </div>
                ))}
              </Grid>)}

            <Grid item sx={{ marginBottom: 4 }}>

              <Grid container spacing={2} alignItems="center" sx={{ padding: '8px' }}>

                <Grid item xs={isScreenSmall ? 6 : 2}>
                  <TextField
                    type="number"
                    value={measureAmount}
                    onChange={(event) => setMeasureAmount(event.target.value)}
                    placeholder='e.g. 3'
                    helperText='how much'
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={isScreenSmall ? 6 : 3} sx={{ marginBottom: 4 }}>
                  <TextField
                    value={measure}
                    onChange={(event) => setMeasure(event.target.value)}
                    label='e. g. Cup or Cups'
                    helperText='measure' />
                </Grid>

                <Grid item xs={isScreenSmall ? 6 : 4} sx={{ marginBottom: 4 }}>
                  <TextField
                    value={ingredientName}
                    onChange={(event) => setIngredientName(event.target.value)}
                    placeholder='e. g. wheat flour'
                    helperText='ingredient name'/>
                </Grid>

                <Grid item xs={isScreenSmall ? 6 : 3} sx={{ marginBottom: 4 }}>
                  <TextField
                    value={recommendBrand}
                    onChange={(event) => setRecommendBrand(event.target.value)}
                    placeholder='e. g. felix'
                    helperText='recommend brand (optional)'/>
                </Grid>
              </Grid>

              <Button onClick={handleAddIngredient} style={{ backgroundColor: '#FFA726', color: 'black' }}>
            Add ingredient
              </Button>

            </Grid>

            <Grid item xs={12} sx={{ width: '100%', marginBottom: 4 }} >
              <Typography variant="h5">Write Instructions for Your Recipe</Typography>
              <Controller
                name="instructions"
                control={control}
                defaultValue=''
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    rows={8}
                    type="text"
                    multiline
                    fullWidth
                    placeholder="Write instructions here"
                    error={!!errors.instructions}
                    helperText={errors.instructions ? 'instructions is required' : ''}
                    onBlur={() => handleBlur(field)}
                    sx={{  //this is here becouse css file for some reason did not affect this one
                      backgroundColor: 'white',
                      color: 'black',
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginBottom: 4 }}>
              <Typography variant="h5">How Long to Make and Serving Size</Typography>
              <Grid container direction={'row'} justifyContent={'space-around'}>
                <Controller
                  name="totalTime"
                  control={control}
                  rules={{ required: true }}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Total Time (minutes)"
                      type="number"
                      inputProps={{ min: 1 }}
                      {...field}
                      error={!!errors.totalTime}
                      helperText={errors.totalTime ? 'Total Time is required' : ''}
                      onBlur={() => handleBlur(field)}
                    />
                  )}
                />

                <Controller
                  name="recipeYield"
                  control={control}
                  rules={{ required: true }}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="serving size"
                      type="number"
                      inputProps={{ min: 1 }}
                      {...field}
                      error={!!errors.recipeYield}
                      helperText={errors.recipeYield ? 'serving size is required' : ''}
                      onBlur={() => handleBlur(field)}
                    />
                  )}
                />
              </Grid>

            </Grid>

            <Grid item sx={{ marginBottom: 4 }}>
              <Typography variant="h5">Add Depicting Hashtags to Your Recipe</Typography>
              <Button variant="outlined" color="secondary" onClick={() => openOptionsDialog('Select Meal Types', mealTypes, selectedMealTypes)}>
              Select Meal Types
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => openOptionsDialog('Select Dish Types', dishOptions, selectedDishTypes)}>
              Select Dish Types
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => openOptionsDialog('Select Cuisine Types', cuisineOptions, selectedCuisineTypes)}>
              Select Cuisine Types
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => openOptionsDialog('Select Diet/Allergic Options', healthFilterOptions, selectedHealthFilters)}>
              Select Diet/Allergic options
              </Button>
              <OptionsDialog
                setOpenDialog={setOpenDialog}
                open={openDialog}
                title={dialogTitle}
                options={dialogOptions}
                selectedOptions={dialogSelectedOptions}
                setSelectedMealTypes={setSelectedMealTypes}
                setSelectedDishTypes={setSelectedDishTypes}
                setSelectedCuisineTypes={setSelectedCuisineTypes}
                setSelectedHealthFilters={setSelectedHealthFilters}
              />
            </Grid>


            <Grid item sx={{ marginBottom: 4 }}>
              <Button variant="contained" color="primary" type="submit">
                {isEditing ? 'Update recipe' : 'Create recipe'}
              </Button>
            </Grid>

          </form>
        </Grid>
        <WarningDialog open={showWarningDialog} onClose={() => setShowWarningDialog(false)} user={user} />
      </Container>
    </div>
  )
}



export default CreateRecipePage
