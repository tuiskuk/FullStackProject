import  { Card, CardContent, CardMedia, Typography, Grid, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import { selectCurrentUser } from '../services/loginSlice'
import { useSelector } from 'react-redux'
import { useAddFavoriteMutation } from '../services/favoriteSlice'
import { useRemoveFavoriteMutation } from '../services/favoriteSlice'
import { useGetFavoriteQuery } from '../services/favoriteSlice'
import { useParams } from 'react-router-dom'


const RecipeViewPage = () => {

  const { recipeId } = useParams()
  const user = useSelector(selectCurrentUser)
  const userId = user?.id
  console.log(userId, recipeId)
  const [ addFavorite ] = useAddFavoriteMutation()
  const { data: favoriteData, refetch } = useGetFavoriteQuery(
    { userId, recipeId },
    { skip: !userId || !recipeId, refetchOnMountOrArgChange: true }
  )
  console.log(favoriteData)

  const hasFavorited = Boolean(favoriteData)
  console.log(hasFavorited)
  const [ removeFavorite ] = useRemoveFavoriteMutation({
    onSettled: () => {
      refetch() // Manually refetch the data after mutation is complete
    },
  })
  const [recipe, setRecipe] = useState({})
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)


  useEffect(() => {
    const savedRecipe = sessionStorage.getItem('recipe')
    const parsedRecipe = JSON.parse(savedRecipe)
    setRecipe(parsedRecipe)
  }, [])

  const roundValue = (value) => {
    return Number(value.toFixed(1))
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setIsDisliked(false)

  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    setIsLiked(false)

  }

  const handleFavorite = async() => {
    console.log(recipeId)
    if (!hasFavorited) {
      try {
        await addFavorite({ userId, recipeId }).unwrap()
      } catch (err) {
        console.error('Failed to add favorite: ', err)
      }
    }
    if(hasFavorited){
      try {
        await removeFavorite({ userId, recipeId })
      } catch (err) {
        console.error('Failed to create user: ', err)
      }
    }

  }




  return (
    <Grid container spacing={2}>
      {recipe && recipe.image && (
        <Grid item xs={12}>
          <Card>
            <CardMedia component="img" src={recipe.image} alt={recipe.label} height="300" />
            <CardContent>
              <Grid container alignItems="center">
                <Grid item xs={8}>
                  <Grid container direction="column" alignItems="flex-start">
                    <Typography variant="h5">{recipe.label}</Typography>
                    <Typography variant="subtitle1">Cuisine: {recipe.cuisineType?.join(', ')}</Typography>
                    <Typography variant="subtitle1">Meal: {recipe.mealType?.join(', ')}</Typography>
                    <Typography variant="subtitle1">Dish: {recipe.dishType?.join(', ')}</Typography>
                  </Grid>
                </Grid>
                {user && <Grid item xs={4}>
                  <Grid container direction="column" alignItems="flex-end">
                    <Grid item>
                      <IconButton onClick={handleFavorite} aria-label="Favorite">
                        {hasFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={handleLike} aria-label="Like">
                        {isLiked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={handleDislike} aria-label="Dislike">
                        {isDisliked ? <ThumbDownIcon /> : <ThumbDownOffAltIcon />}
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>}
              </Grid>
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