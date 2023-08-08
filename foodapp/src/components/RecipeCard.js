import { Card, CardMedia, CardContent, Typography, CardActionArea  } from '@mui/material'
import { Link } from 'react-router-dom'
import { useGetRecipeQuery } from '../services/apiSlice'
import { useEffect, useState } from 'react'


const RecipeCard = ({ recipe }) => {
  let recipe_id  = recipe.uri ? recipe.uri.substring(recipe.uri.lastIndexOf('_') + 1) : recipe.recipeId
  let favoriteRecipe = null
  const [displayedRecipe,setDisplayedRecipe] = useState(null)

  const { data: dataFromApi } = useGetRecipeQuery(recipe.id)

  //inside useEffect to make sure that dataFromApi and recipe are defined
  useEffect(() => {
    try {
      //modify recipe only if it is not created by user
      //and does not contain api information
      if(!recipe?.creator && !recipe?.url){
        //we need to make sure that properties instruktions, totalTime
        //and so on are will be set in sessionStorage and in recipeViewPages state
        recipe = dataFromApi?.recipe
      }

      setDisplayedRecipe(recipe)

    } catch (e) {recipe
      favoriteRecipe = dataFromApi?.recipe
      setDisplayedRecipe(favoriteRecipe)
      console.log(dataFromApi)
      console.log(favoriteRecipe)
      console.log('card error', e)
    }

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
    <Link to={ `/recipes/${recipe_id}` } onClick={handleRecipeClick} sx={{ maxWidth: 200 }}>
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
            <Typography variant="h6">{recipe?.label}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  )
}

export default RecipeCard