import { useEffect, useState } from 'react'
import { useCreateRecipeMutation } from '../services/userRecipeApiSlice'
import { selectCurrentUser } from '../services/loginSlice'
import { useSelector } from 'react-redux'
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  Snackbar,
  Alert,
  CircularProgress
  //Avatar,
} from '@mui/material'

const CreateRecipePage = () => {
  const [instructions, setInstruktions] = useState('')
  const [ingredientLines, setIngredientLines] = useState([])
  const [ingredient, setIngredient] = useState('')
  const [ingredientAmount, setIngredientAmount] = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [totalTime, setTotalTime] = useState(0)
  const [mealType, setMealType] = useState('')
  const [cuisineType, setCuisineType] = useState('')
  const [dishType, setDishType] = useState('')
  const [label, setLabel] = useState('')
  const [createRecipe, { data, isLoading ,isSuccess, isError }] = useCreateRecipeMutation()
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const user = useSelector(selectCurrentUser)

  //show notification when creation of recipe is
  // triend and reset ewerything if it is succesfull
  useEffect(() => {
    if(isSuccess || isError){
      setOpenSnackbar(true)
      if(isSuccess){
        setIngredient('')
        setIngredientAmount('')
        setRecommendation('')
        setInstruktions('')
        setMealType('')
        setDishType('')
        setTotalTime(0)
        setCuisineType('')
        setLabel('')
        setIngredientLines([])
      }
    }
  }, [isSuccess, isError])


  //function to delete undesired ingredientLIne
  const editIngredients = (index) => {
    const updatedIngredients = ingredientLines.filter((_, i) => i !== index)
    setIngredientLines(updatedIngredients)
  }


  //function to add ingredients
  const handleIngredientAddition = () => {
    console.log('add function entered')
    if (ingredient.trim() === '' || ingredientAmount.trim() === '') {
      setOpenSnackbar(true)
      return
    }

    if (recommendation.trim() !== '') {
      setIngredientLines([...ingredientLines,`${ingredient} ${ingredientAmount} (recommendation) ${recommendation}`])
    } else {
      setIngredientLines([...ingredientLines,`${ingredient} ${ingredientAmount}`])
    }
    setIngredient('')
    setIngredientAmount('')
    setRecommendation('')
  }

  //function to create new recipe
  const handleRecipeCreation = async () => {
    const recipe = {
      creator: user.id,
      label,
      instructions,
      ingredientLines,
      totalTime,
      mealType,
      cuisineType,
      dishType,
    }

    await createRecipe(recipe)
    console.log(data)
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  return (
    <Container maxWidth="md" >
      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={isSuccess ? 'success' : 'error'}  sx={{ width: '100%' }}>
          {isSuccess ? 'recipe created' : isError ? 'an error occured during recipe creation' : 'ingredient and it\'s amount must be provided'}
        </Alert>
      </Snackbar>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h1">
            Create and publish your own recipe
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2">
            Lets start by listing all ingredients
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {ingredientLines.map((ingredient, index) => (
            <Grid
              container
              key={index}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="h6">
                  { ingredient }
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => editIngredients(index)}
                >
                  Rewrite
                </Button>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="quantity"
            required={true}
            multiline
            value={ingredientAmount}
            onChange={(e) => setIngredientAmount(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Input ingredient e.g. ketchup"
            required={true}
            multiline
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="recommend brand e.g. Felix"
            multiline
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleIngredientAddition}
            fullWidth
          >
            Add ingredient
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2">
            Lets continue by writing the instructions
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="give instruction to your recipe here. simple senteces are usually good idea"
            multiline
            rows={5}
            value={instructions}
            onChange={(e) => setInstruktions(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2">
            basic information about your recipe
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="give time estimation in minutes"
            value={totalTime}
            onChange={(e) => setTotalTime(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="mealType e.g. dessert"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="cuisineType e.g. american"
            value={cuisineType}
            onChange={(e) => setCuisineType(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="dishType a.g starter"
            value={dishType}
            onChange={(e) => setDishType(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={5}>
            <Typography variant="h5">give label to you recipe</Typography>
          </Grid>
          <Grid item xs={5}>
            <TextField
              label="label here"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRecipeCreation}
            fullWidth
          >
            {isLoading ? <CircularProgress size={32} /> : 'Create recipe'}
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default CreateRecipePage
