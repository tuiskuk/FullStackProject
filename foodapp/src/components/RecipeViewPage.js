import  { Card, CardContent, CardMedia, Typography, Grid, IconButton, TextField, InputAdornment, Button, OutlinedInput } from '@mui/material'
import { useEffect, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import { selectCurrentUser } from '../services/loginSlice'
import { useSelector } from 'react-redux'
import { useAddFavoriteMutation, useRemoveFavoriteMutation, useGetFavoriteQuery } from '../services/favoriteSlice'
import { useAddLikeMutation, useRemoveLikeMutation, useGetLikeQuery } from '../services/likeSlice'
import { useAddDislikeMutation, useRemoveDislikeMutation, useGetDislikeQuery } from '../services/dislikeSlice'
import { useAddLikeInteractionMutation, useRemoveLikeInteractionMutation,
  useAddDislikeInteractionMutation, useRemoveDislikeInteractionMutation,
  useGetAllInteractionsQuery, useCreateInteractionMutation } from '../services/interactionSlice'


import { useParams } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import Fraction from 'fraction.js'

const RecipeViewPage = () => {
  const { recipeId } = useParams()
  const user = useSelector(selectCurrentUser)
  const userId = user?.id

  const [recipe, setRecipe] = useState({})
  const label = recipe.label
  const image = recipe.image
  const [multiplier, setMultiplier] = useState(recipe.yield || 1)
  const [userComment, setUserComment] = useState('')
  const [comments, setComments] = useState([])

  const [ addFavorite ] = useAddFavoriteMutation()
  const { data: favoriteData, refetch: refetchFavorite } = useGetFavoriteQuery(
    { userId, recipeId },
    { skip: !userId || !recipeId, refetchOnMountOrArgChange: true }
  )

  const hasFavorited = Boolean(favoriteData)
  const [ removeFavorite ] = useRemoveFavoriteMutation({
    onSettled: () => {
      refetchFavorite() // Manually refetch the data after mutation is complete
    },
  })

  const [ addLike ] = useAddLikeMutation()
  const { data: likeData, refetch: refetchLike } = useGetLikeQuery(
    { userId, recipeId },
    { skip: !userId || !recipeId, refetchOnMountOrArgChange: true }
  )

  const isLiked = Boolean(likeData)
  const [ removeLike ] = useRemoveLikeMutation({
    onSettled: () => {
      refetchLike() // Manually refetch the data after removing like
    },
  })

  const [ addDislike ] = useAddDislikeMutation()
  const { data: dislikeData, refetch: refetchDislike } = useGetDislikeQuery(
    { userId, recipeId },
    { skip: !userId || !recipeId, refetchOnMountOrArgChange: true }
  )

  const isDisliked = Boolean(dislikeData)
  const [ removeDislike ] = useRemoveDislikeMutation({
    onSettled: () => {
      refetchDislike() // Manually refetch the data after removing dislike
    },
  })

  useEffect(() => {
    const savedRecipe = sessionStorage.getItem('recipe')
    const parsedRecipe = JSON.parse(savedRecipe)
    setRecipe(parsedRecipe)
    setMultiplier(parsedRecipe?.yield || 1)
  }, [])

  const [ addLikeInteraction ] = useAddLikeInteractionMutation()
  const [ removeLikeInteraction ] = useRemoveLikeInteractionMutation()
  const [ addDislikeInteraction ] = useAddDislikeInteractionMutation()
  const [ removeDislikeInteraction ] = useRemoveDislikeInteractionMutation()
  const { data: interactionData } = useGetAllInteractionsQuery({ recipeId })
  const [ createInteraction ] = useCreateInteractionMutation()

  const handleLike = async () => {
    console.log(recipeId)

    if(!interactionData){
      try {
        await createInteraction({ recipeId })
        console.log('create')
      } catch (error) {
        console.error('Failed to create interaction: ', error)
      }
    }

    if (!isLiked) {
      try {
        await addLike({ userId, recipeId, label, image })
        await addLikeInteraction({ recipeId, userId })

        //if recipe was disliked, remove it from dislikes
        if (isDisliked) {
          try {
            await removeDislike({ userId, recipeId })
            await removeDislikeInteraction({ recipeId, userId })
          } catch (error) {
            console.error('Failed to remove dislike: ', error)
          }
        }
      } catch (error) {
        console.error('Failed to add like: ', error)
      }
    }

    if (isLiked){
      try {
        await removeLike({ userId, recipeId })
        await removeLikeInteraction({ recipeId, userId })
      } catch (error) {
        console.error('Failed to remove like: ', error)
      }
    }
  }

  const handleDislike = async () => {
    console.log(recipeId)

    if(!interactionData){
      try {
        await createInteraction({ recipeId })
        console.log('create')
      } catch (error) {
        console.error('Failed to create interaction: ', error)
      }
    }

    if (!isDisliked) {
      try {
        await addDislike({ userId, recipeId, label, image }).unwrap()
        await addDislikeInteraction({ recipeId, userId })

        // If the recipe was liked, remove it from likes
        if (isLiked) {
          try {
            await removeLike({ userId, recipeId })
            await removeLikeInteraction({ recipeId, userId })
          } catch (error) {
            console.error('Failed to remove like: ', error)
          }
        }
      } catch (error) {
        console.error('Failed to add dislike: ', error)
      }
    }

    if (isDisliked){
      try {
        await removeDislike({ userId, recipeId })
        await removeDislikeInteraction({ recipeId, userId })
      } catch (error) {
        console.error('Failed to remove dislike: ', error)
      }
    }
  }

  const handleFavorite = async () => {
    console.log(recipeId)
    if (!hasFavorited) {
      try {
        await addFavorite({ userId, recipeId, label, image }).unwrap()
      } catch (err) {
        console.error('Failed to add favorite: ', err)
      }
    }

    if(hasFavorited){
      try {
        await removeFavorite({ userId, recipeId })
      } catch (err) {
        console.error('Failed to remove favorite: ', err)
      }
    }
  }

  const handleMultiplierChange = (event) => {
    const value = parseFloat(event.target.value)
    setMultiplier(value || 1)
  }

  const convertToFraction = (value) => {
    const fraction = new Fraction(value)
    return fraction.toFraction(true)
  }

  const handleMultiply = (value) => {
    return ((value/recipe.yield) * multiplier)
  }

  const roundValue = (value) => {
    return Number(value.toFixed(1))
  }

  //regex pattern
  const pattern = /^\d+\s?\d*\/?\d*\s/

  const handleSubmitComment = () => {
    if (userComment.trim() !== '') {
      setComments([...comments, userComment])
      setUserComment('')
    }
  }

  return (
    <Grid container spacing={2}>
      {recipe && recipe.image && (
        <Grid item xs={12}>
          <Card>
            <CardMedia component="img" src={recipe.image} alt={recipe.label} height="300"
              onError={(e) => {
                e.target.src = 'https://placehold.co/300?text=Photo+Not+Found'
              }}/>
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
                    <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" style={{ marginRight: '4px' }}>
                        Likes:
                      </Typography>
                      <Typography variant="subtitle1" style={{ marginRight: '4px' }}>
                        {interactionData ? interactionData.recipe.likes.length : 0}
                      </Typography>
                      <IconButton onClick={handleLike} aria-label="Like">
                        {isLiked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                      </IconButton>
                    </Grid>
                    <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" style={{ marginRight: '4px' }}>
                        Dislikes:
                      </Typography>
                      <Typography variant="subtitle1" style={{ marginRight: '4px' }}>
                        {interactionData ? interactionData.recipe.dislikes.length : 0}
                      </Typography>
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

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container direction="row" alignItems="center" justify="space-around">
              <Grid item xs={4} container direction="row" alignItems="center" justify="center">
                <Typography variant="h6" paddingRight={'20px'}>Serving size</Typography>
                <TextField
                  value={multiplier}
                  onChange={handleMultiplierChange}
                  InputProps={{
                    inputProps: {
                      min: 1,
                      step: 1,
                      style: { width: '25px', height: '35px', textAlign: 'center', appearance: 'textfield' } }, // Set the minimum value to 1
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton onClick={() => setMultiplier(prevMultiplier => Math.max(prevMultiplier - 1, 1))} size="small">
                          <RemoveIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setMultiplier(prevMultiplier => prevMultiplier + 1)} size="small">
                          <AddIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {recipe && recipe.totalTime && (
                <Grid item xs={4}>
                  <Typography variant="h6" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>Time min</span>
                    <span>{recipe.totalTime}</span>
                  </Typography>
                </Grid>
              )}
              {recipe && recipe.calories && (
                <Grid item xs={4}>
                  <Typography variant="h6" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>Calories kcal</span>
                    <span>{roundValue(handleMultiply(recipe.calories))}</span>
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={6}>
        <Grid container spacing={2}>
          {recipe && recipe.ingredients && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Ingredients:</Typography>
                  {recipe.ingredients.map((ingredient, index) => (
                    <Typography key={index}>{`${convertToFraction(handleMultiply(ingredient.quantity))} ${ingredient.text.replace(pattern, '')}`}</Typography>
                  ))}
                  <Typography variant='subtitle1'>Weight in grams: {roundValue(handleMultiply(recipe.totalWeight))} g</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
          {recipe && recipe.url && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Check directions:</Typography>
                  <Typography>
                    <a href={recipe.url} target="_blank" rel="noopener noreferrer">
                      {recipe.label}
                    </a>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Grid>

      {recipe && recipe.totalNutrients && (
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Nutritional Information ({multiplier} servings):</Typography>
              {Object.entries(recipe.totalNutrients).map(([key, nutrient]) => (
                <Typography key={key}>
                  {nutrient.label}: {roundValue(handleMultiply(nutrient.quantity))} {nutrient.unit}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      )}

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Comments:</Typography>
            <br></br>
            {comments.map((comment, index) => (
              <Typography
                key={index}
                variant="body1"
                style={{
                  border: '1px solid #bdbdbd',
                  borderRadius: '4px',
                  padding: '10px 14px', // Adjust padding to match the OutlinedInput
                  marginBottom: '8px',
                  minHeight: '38px',
                  height: 'auto',
                  display: 'flex', // To center the text vertically
                  alignItems: 'center',
                  wordWrap: 'break-word',
                }}
              >
                {comment}
              </Typography>
            ))}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Comment recipe</Typography>
            <br></br>
            <OutlinedInput
              multiline
              fullWidth
              placeholder="Add your comment"
              value={userComment}
              onChange={(event) => setUserComment(event.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitComment}
                  >
                    Add
                  </Button>
                </InputAdornment>
              }
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )


}

export default RecipeViewPage