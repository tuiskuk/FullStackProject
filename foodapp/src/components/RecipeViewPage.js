import  { Card, CardContent, CardMedia, Typography, Grid, IconButton, TextField, InputAdornment } from '@mui/material'
import { useEffect, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import { selectCurrentUser } from '../services/loginSlice'
import { useSelector } from 'react-redux'
import CommentSection from './CommentSectionComponent'
import { useAddFavoriteMutation, useRemoveFavoriteMutation, useGetAllFavoritesQuery } from '../services/favoriteSlice'
import { useAddLikeInteractionMutation, useRemoveLikeInteractionMutation,
  useAddDislikeInteractionMutation, useRemoveDislikeInteractionMutation,
  useGetAllInteractionsQuery, useCreateInteractionMutation } from '../services/interactionSlice'

import WarningDialog from './WarningDialog'
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
  const [showWarningDialog, setShowWarningDialog] = useState(false)

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
  const [ addFavorite ] = useAddFavoriteMutation()
  const [ removeFavorite ] = useRemoveFavoriteMutation()
  const { data: interactionData } = useGetAllInteractionsQuery(
    { recipeId }, { skip: !recipeId, refetchOnMountOrArgChange: true })
  const { data: favoriteData, refetch } = useGetAllFavoritesQuery(
    { userId }, { skip: !userId, refetchOnMountOrArgChange: true })
  const [ createInteraction ] = useCreateInteractionMutation()

  //can search also from user
  const isLiked = Boolean(interactionData?.recipe?.likes.some((user) => user === userId))
  const isDisliked = Boolean(interactionData?.recipe?.dislikes.some((user) => user === userId))

  const isFavorite = Boolean(favoriteData?.favorites?.some((recip) => recip === interactionData?.recipe.id))

  const handleLike = async () => {
    console.log(recipeId)
    if(!user) {
      setShowWarningDialog(true)
      return
    }

    if(!interactionData){
      try {
        await createInteraction({ recipeId, label, image })
        console.log('create')
      } catch (error) {
        console.error('Failed to create interaction: ', error)
      }
    }

    if (!isLiked) {
      try {
        await addLikeInteraction({ recipeId, userId })

        //if recipe was disliked, remove it from dislikes
        if (isDisliked) {
          try {
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
        await removeLikeInteraction({ recipeId, userId })
      } catch (error) {
        console.error('Failed to remove like: ', error)
      }
    }
  }

  const handleDislike = async () => {
    console.log(recipeId)
    if(!user) {
      setShowWarningDialog(true)
      return
    }

    if(!interactionData){
      try {
        await createInteraction({ recipeId, label, image })
        console.log('create')
      } catch (error) {
        console.error('Failed to create interaction: ', error)
      }
    }

    if (!isDisliked) {
      try {
        await addDislikeInteraction({ recipeId, userId })

        // If the recipe was liked, remove it from likes
        if (isLiked) {
          try {
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
        await removeDislikeInteraction({ recipeId, userId })
      } catch (error) {
        console.error('Failed to remove dislike: ', error)
      }
    }
  }

  const handleFavorite = async () => {
    console.log(recipeId)
    if(!user) {
      setShowWarningDialog(true)
      return
    }

    if (!isFavorite) {
      if(!interactionData){
        try {
          await createInteraction({ recipeId, label, image })
          console.log('create')
        } catch (error) {
          console.error('Failed to create interaction: ', error)
        }
      }

      try {
        await addFavorite({ userId, recipeId })
        refetch()
      } catch (err) {
        console.error('Failed to add favorite: ', err)
      }
    }

    if(isFavorite){
      try {
        await removeFavorite({ userId, recipeId })
        refetch()
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
                {<Grid item xs={4}>
                  <Grid container direction="column" alignItems="flex-end">
                    <Grid item>
                      <IconButton onClick={handleFavorite} aria-label="Favorite">
                        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
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

      <CommentSection recipeId={recipeId} userId={userId} interactionData={interactionData} label={label} image={image} />
      <WarningDialog open={showWarningDialog} onClose={() => setShowWarningDialog(false)} user={user} />
    </Grid>
  )
}

export default RecipeViewPage