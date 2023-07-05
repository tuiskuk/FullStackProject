import  { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material'
import { useEffect, useState } from 'react'

const RecipeViewPage = () => {


  const [recipe, setRecipe] = useState({})

  useEffect(() => {
    const savedRecipe = sessionStorage.getItem('recipe')
    const parsedRecipe = JSON.parse(savedRecipe)
    setRecipe(parsedRecipe)
  }, [])

  const roundValue = (value) => {
    return Number(value.toFixed(1))
  }




  return (
    <Grid container spacing={2}>
      {recipe && recipe.image && (
        <Grid item xs={12}>
          <Card>
            <CardMedia component="img" src={recipe.image} alt={recipe.label} height="300" />
            <CardContent>
              <Typography variant="h5">{recipe.label}</Typography>
              <Typography variant="subtitle1">Cuisine: {recipe.cuisineType?.join(', ')}</Typography>
              <Typography variant="subtitle1">Meal: {recipe.mealType?.join(', ')}</Typography>
              <Typography variant="subtitle1">Dish: {recipe.dishType?.join(', ')}</Typography>
            </CardContent>
          </Card>
        </Grid>
      )}

      {recipe && recipe.ingredients && (
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Ingredients:</Typography>
              {recipe.ingredients.map((ingredient, index) => (
                <Typography key={index}>{ingredient.text}</Typography>
              ))}
              <Typography variant='subtitle1'>Weight in grams: {roundValue(recipe.totalWeight)} g</Typography>
            </CardContent>
          </Card>
        </Grid>
      )}

      {recipe && recipe.totalNutrients && (
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Nutritional Information:</Typography>
              {Object.entries(recipe.totalNutrients).map(([key, nutrient]) => (
                <Typography key={key}>
                  {nutrient.label}: {roundValue(nutrient.quantity)} {nutrient.unit}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      )}

    </Grid>
  )


}

export default RecipeViewPage