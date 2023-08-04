import { Card, CardMedia, CardContent, Typography, CardActionArea, CircularProgress  } from '@mui/material'
import { Link } from 'react-router-dom'
import { useGetRecipeQuery } from '../services/apiSlice'


const RecipeCard = ({ recipe }) => {
  let recipe_id = ''
  let favoriteRecipe = null
  let isLoading = false
  let isFetching = false

  try {
    recipe_id =  recipe.uri ? recipe.uri.substring(recipe.uri.lastIndexOf('_') + 1) : recipe.id
    console.log(recipe_id)
  } catch (e) {
    const query = useGetRecipeQuery(recipe.recipeId)
    favoriteRecipe = query.data
    console.log(query)
    console.log(favoriteRecipe)
    isLoading = query.isLoading
    isFetching = query.isFetching
    console.log('card error', e)
  }


  const displayedRecipe = favoriteRecipe?.recipe || recipe

  const handleRecipeClick = () => {
    try {
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
        <Link to={ `/recipes/${recipe_id}` } onClick={handleRecipeClick} >
          <Card sx={{ maxWidth: 200, transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.03)',
            }, }}>
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