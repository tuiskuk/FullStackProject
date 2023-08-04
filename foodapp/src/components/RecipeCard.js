import { Card, CardMedia, CardContent, Typography, CardActionArea, CircularProgress  } from '@mui/material'
import { Link } from 'react-router-dom'
import { useGetRecipeQuery } from '../services/apiSlice'
import { useEffect, useState } from 'react'


const RecipeCard = ({ recipe }) => {
  let recipe_id  = recipe.uri ? recipe.uri.substring(recipe.uri.lastIndexOf('_') + 1) : recipe.recipeId
  let favoriteRecipe = null
  const [displayedRecipe,setDisplayedRecipe] = useState(null)

  const { data: dataFromApi, isFetching, isLoading } = useGetRecipeQuery(recipe.id)

  //inside useEffect to make sure that dataFromApi is defined
  useEffect(() => {
    try {

      //modify recipe only if it is not created by user
      //and does not contain api information
      if(!recipe?.creator && !recipe?.url){
        //we need to make sure that properties instruktions, totalTime
        //and so on are will be set in recipeViewPages state
        const wholeRecipe = {
          ...dataFromApi?.recipe,
        }
        recipe = wholeRecipe
        console.log(recipe)
      }

    } catch (e) {recipe
      favoriteRecipe = dataFromApi.data
      console.log(dataFromApi)
      console.log(favoriteRecipe)
      console.log('card error', e)
    }

    setDisplayedRecipe(favoriteRecipe || recipe)
    console.log(displayedRecipe)
  }, [recipe ,dataFromApi])



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
                src={recipe?.images?.SMALL?.url || recipe?.image || recipe?.images[0]}
                alt={recipe?.label || 'moi'}
                height={200}
                width={200}
                onError={(e) => {
                  console.log(e)
                  e.target.src = 'https://placehold.co/200?text=Photo+Not+Found'
                }}
              />
              <CardContent sx={{ height: 80 }}>
                <Typography variant="h6">{recipe?.label}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
      )}
    </>
  )
}

export default RecipeCard