import { useCreateInteractionMutation } from '../services/interactionSlice'
import { useUploadRecipePictureMutation } from '../services/pictureHandlerApiSlice'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { selectCurrentUser } from '../services/loginSlice'
import { useSelector } from 'react-redux'
import { TextField, Container,  Grid, Tooltip, Box, ImageListItem, ImageListItemBar, IconButton, Button, Snackbar, Alert } from '@mui/material'
import { useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { cuisineOptions, dishOptions, healthFilterOptions, mealTypes } from '../data'
import { WarningDialog } from '../components/WarningDialog'
import OptionsDialog from '../components/SelectOptionsForRecipeDialog'



const CreateRecipePage = () => {
  //hooks related to recipe pictures
  const fileInputRef = useRef(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [imageIndex, setImageIndex] = useState(-1)

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

  const { handleSubmit, control,formState: { errors }, trigger, reset } = useForm()

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

    try {
      if (Object.keys(errors).length === 0) {
        const {
          recipeYield,
          totalTime,
          ...restSubmitData
        } = submitData

        const createData = {
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

        const response = await createInteraction(createData)
        console.log('recipe created', response?.data?.savedRecipe)

        const imageResponse = await uploadRecipePicture({ files: selectedFiles, id: response?.data?.savedRecipe.id })
        console.log('recipes pictures uploaded and added to recipes image property,', imageResponse?.data?.recipeImages)

        //reset everything and show success messgae to user
        reset()
        setIngredients([])
        setSelectedFiles([])
        setSelectedMealTypes([])
        setSelectedCuisineTypes([])
        setSelectedDishTypes([])
        setSelectedHealthFilters([])
        setImageIndex(-1)
        showSnackbar('Recipe creted','success')
      }
    } catch (error) {
      console.error('An error while creating recipe:', error)
      // Handle the error, show a message to the user, etc.
    }
  }





  return (
    <Container maxWidth="md" >

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <form onSubmit={handleSubmit(onSubmit)}>

          <Grid item xs={6}>
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
            <h2>give label to your recipe</h2>
            <Controller
              name="label"
              control={control}
              rules={{ required: true }}
              defaultValue=""
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
            <h2>add pictures to depict your recipe (one required)</h2>
          </Grid>

          <Grid item>
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
              <ImageListItem sx={{ height: '250px', width: '300px' }}>
                <img
                  src={selectedFiles[imageIndex] ? URL.createObjectURL(selectedFiles[imageIndex]) : ''}
                  alt={'...loading'}
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

          <Grid item>
            <h2>add ingredients to you recipe</h2>
          </Grid>

          {ingredients[0] && (
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

          <Grid item>

            <Grid container spacing={2} alignItems="center" sx={{ padding: '8px' }}>

              <Grid item xs={2}>
                <TextField
                  type="number"
                  value={measureAmount}
                  onChange={(event) => setMeasureAmount(event.target.value)}
                  placeholder='e.g. 3'
                  helperText='how much'
                  inputProps={{ min: 1 }}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  value={measure}
                  onChange={(event) => setMeasure(event.target.value)}
                  label='e. g. Cup or Cups'
                  helperText='measure' />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  value={ingredientName}
                  onChange={(event) => setIngredientName(event.target.value)}
                  placeholder='e. g. wheat flour'
                  helperText='ingredient name'/>
              </Grid>

              <Grid item xs={3}>
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

          <Grid item xs={12} sx={{ width: '100%' }}>
            <h1>Write instructions to your recipe here</h1>
            <Controller
              name="instructions"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  rows={8}
                  multiline
                  fullWidth
                  placeholder="Write instructions here"
                  error={!!errors.instructions}
                  helperText={errors.instructions ? 'instructions is required' : ''}
                  onBlur={() => handleBlur(field)}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <h2>How long does it take to make your recipe and what is the serving size?</h2>
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

          <Grid item>
            <h2>add depicting hashtags to your recipe. helps other users find your recipe</h2>
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


          <Grid item>
            <Button variant="contained" color="primary" type="submit">
              Create recipe
            </Button>
          </Grid>

        </form>
      </Grid>
      <WarningDialog open={showWarningDialog} onClose={() => setShowWarningDialog(false)} user={user} />
    </Container>
  )
}



export default CreateRecipePage
