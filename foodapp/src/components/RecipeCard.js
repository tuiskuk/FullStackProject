import { Card, CardMedia, CardContent, Typography, CardActionArea, CircularProgress  } from '@mui/material'
import { Link } from 'react-router-dom'
import { useGetRecipeQuery } from '../services/apiSlice'
import { useGetUserRecipeQuery } from '../services/userRecipeApiSlice'

const RecipeCard = ({ recipe }) => {
  let favoriteRecipe = null
  let isLoading = false
  let isFetching = false
  //console.log(recipe)
  const recipe_id =  recipe.uri ? recipe.uri.substring(recipe.uri.lastIndexOf('_') + 1) : recipe.recipeId ? recipe.recipeId : recipe.id

  try {
    const query = !recipe.uri && recipe.recipeId ? useGetRecipeQuery(recipe.id) : !recipe.uri && useGetUserRecipeQuery(recipe_id)
    favoriteRecipe = query.data
    isLoading = query.isLoading
    isFetching = query.isFetching
  } catch (e) {
    console.log('card error', e)
  }

  const displayedRecipe = favoriteRecipe?.recipe || recipe
  //console.log(displayedRecipe)

  const handleRecipeClick = () => {
    try {
      //for userCreated recipes store recipe to redux state
      console.log(recipe)
      console.log('recipe card')
      // Save the recipe to sessionStorage
      sessionStorage.setItem('recipe', JSON.stringify(displayedRecipe))
    } catch (error) {
      console.log('Error saving recipe:', error)
    }
  }

  return (
    <>
      {isLoading || isFetching ? (
        <CircularProgress /> // Render the loading spinner when loading is true
      ) : (
        <Link to={ (recipe.uri || recipe.recipeId) ? `/recipes/${recipe_id}` : `/userRecipes/${recipe_id}`} onClick={handleRecipeClick}>
          <Card sx={{ maxWidth: 200 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                src={displayedRecipe?.images?.SMALL?.url || displayedRecipe?.image || displayedRecipe?.images[0]}
                alt={displayedRecipe?.label}
                height={200}
                width={200}
                onError={(e) => {
                  console.log(e)
                  e.target.src = 'https://placehold.co/200?text=Photo+Not+Found'
                }}
              />
              <CardContent sx={{ height: 80 }}>
                <Typography variant="h6">{displayedRecipe.label}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
      )}
    </>
  )
}

export default RecipeCard