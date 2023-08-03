import { Button, Tooltip, TextField, Link, Box ,Avatar, Container, Grid, IconButton, ImageListItem ,ImageListItemBar, Typography, InputAdornment } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CommentSection from './CommentSectionComponent'
import Fraction from 'fraction.js'
import { useGetAllInteractionsQuery } from '../services/interactionSlice'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { selectCurrentUser, setUser } from '../services/loginSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useRemoveFavoriteMutation, useAddFavoriteMutation } from '../services/favoriteSlice'

//handle adding or removing likes for edma recipes
//and creating new ones
import {
  useAddDislikeInteractionMutation,
  useAddLikeInteractionMutation,
  useRemoveDislikeInteractionMutation,
  useRemoveLikeInteractionMutation,
  useCreateInteractionMutation
} from '../services/interactionSlice'


const RecipeViewPage = () => {
  const user = useSelector(selectCurrentUser)
  const [recipe, setRecipe] = useState(null)
  const recipeId = useParams()
  const [disableIconButton, setDisableIconButton] = useState(false)
  const [isFavorite, setIsFavourite] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [hasUserLikedRecipe, setHasUserLikedRecipe] = useState(false)
  const [hasUserDisikedRecipe, setHasUserDisikedRecipe] = useState(false)
  const [multiplier, setMultiplier] = useState(4)
  const [pageIndex, setPageIndex] = useState(0)
  const [nutrientsPageIndex, setNutrientsPageIndex] = useState(0)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Use the mutation hooks for adding and deleting likes

  const [addLikeInteraction] = useAddLikeInteractionMutation()
  const [removeLikeInteraction] = useRemoveLikeInteractionMutation()

  // Use the mutation hooks for adding and deleting dislikes
  const [addDislikeInteraction] = useAddDislikeInteractionMutation()
  const [removeDislikeInteraction] = useRemoveDislikeInteractionMutation()

  //use mutation hooks to remove favourite
  const [removeFavorite] = useRemoveFavoriteMutation()
  const [addFavorite] = useAddFavoriteMutation()

  //use mutation hook for creating new recipe
  const [createInteraction] = useCreateInteractionMutation()

  //regex pattern
  const pattern = /^\d+\s?\d*\/?\d*\s/

  //these do not work
  const illegalFiltters = ['Crustcean-Free','DASH','Low Potassium','Low Sugar','Mediterranean','No oil added']


  const { data: interactionData } =  useGetAllInteractionsQuery(
    { recipeId: recipeId.recipeId }, { skip: !recipeId, refetchOnMountOrArgChange: true })

  const creatorNameParts = recipe?.creator?.name
  const creatorFirstName = creatorNameParts && creatorNameParts[0]
  const creatorLastName = creatorNameParts && creatorNameParts[1]


  console.log(interactionData)


  //useEffect hooks
  useEffect(() => {
    let recipeFromSessionStorage = JSON.parse(sessionStorage.getItem('recipe'))

    /*if recipe does not exist, initialize likes, dislikes and comments to empty array.
    if recipe is exists set those properties to values from database*/
    if(!interactionData){
      recipeFromSessionStorage.likes = []
      recipeFromSessionStorage.dislikes = []
      recipeFromSessionStorage.comments = []
    }else if (interactionData){
      recipeFromSessionStorage.likes = interactionData.recipe.likes
      recipeFromSessionStorage.dislikes = interactionData.recipe.dislikes
      recipeFromSessionStorage.comments = interactionData.recipe.comments
      recipeFromSessionStorage._id = interactionData.recipe.id
    }

    setRecipe(recipeFromSessionStorage)
    if(user?.favorites?.includes(recipe?.id) || user?.favorites?.includes(recipe?._id)){
      setIsFavourite(true)
    }
  },[])


  useEffect(() => {
    if(user?.favorites?.includes(recipeId.recipeId) || user?.favorites?.includes(recipe?._id)){
      setIsFavourite(true)
    } else {
      setIsFavourite(false)
    }

    console.log('user modified', user)

    if(recipe?.likes?.includes(user?.id)){
      setHasUserLikedRecipe(true)
    } else {
      setHasUserLikedRecipe(false)
    }

    if(recipe?.dislikes?.includes(user?.id)){
      setHasUserDisikedRecipe(true)
    } else {
      setHasUserDisikedRecipe(false)
    }
    console.log('recipe modified', recipe)
  },[recipe, user])




  const handleToLeftImage = () => {
    if(currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const handleToRightImage = () => {
    if(currentImageIndex < (recipe?.images.length - 1)) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const handleMultiplierChange = (event) => {
    const value = parseFloat(event.target.value)
    setMultiplier(value || 1)
  }

  const handleUserLinkClick = () => {
    // Check if recipe?.creator?.id is defined
    if (recipe?.creator?.id) {
      navigate(`/users/${recipe?.creator?.id}`)
    }
  }

  const handleForwardButtonChange = () => {
    if((pageIndex + 1) * 10 < recipe?.ingredientLines?.length){
      setPageIndex((prevIndex) => prevIndex + 1)
    }
  }

  const handleBackButtonChange = () => {
    if(pageIndex > 0){
      setPageIndex((prevIndex) => prevIndex - 1)
    }
  }

  const handleNutrientsForwardButtonChange = () => {
    console.log((nutrientsPageIndex + 1) * 10 < Object.keys(recipe?.totalNutrients).length)
    if((nutrientsPageIndex + 1) * 10 < Object.keys(recipe?.totalNutrients).length){
      setNutrientsPageIndex((prevIndex) => prevIndex + 1)
    }
  }

  const handleNutrientsBackButtonChange = () => {
    if(nutrientsPageIndex > 0){
      setNutrientsPageIndex((prevIndex) => prevIndex - 1)
    }
  }

  const handleMultiply = (value) => {
    return ((value/12) * multiplier) // modify to ${(value/recipe.yield) * multiplier} after create recipe is fixed
  }

  const convertToFraction = (value) => {
    const fraction = new Fraction(value)
    return fraction.toFraction(true)
  }

  const roundValue = (value) => {
    return Number(value.toFixed(1))
  }

  //if is favourite remove it from favourites otherwise add it to favourites
  const handleFavourite = async () => {
    setDisableIconButton(true)
    try {
      if(!interactionData){
        const response = await createInteraction({ recipeId: recipeId.recipeId, label: recipe?.label, image: recipe?.image })
        //since favourites are stored as ref to recipe, recipeId is not valid in and we need real mongo id
        setRecipe((prevState) => ({ ...prevState, _id: response.data.savedRecipe.id }))
      }


      if(user?.favorites?.includes(recipeId.recipeId) || user?.favorites?.includes(recipe?._id)){
        const response = await removeFavorite({ recipeId: recipeId.recipeId , userId: user?.id })
        dispatch(setUser({ user: response.data }))
      } else {
        console.log({ recipeId: recipeId.recipeId , userId: user?.id })
        const response = await addFavorite({ recipeId: recipeId.recipeId , userId: user?.id })
        dispatch(setUser({ user: response.data }))
      }
    } catch (error){
      console.log('error occured when processing favourite', error)
    }
    setDisableIconButton(false)
  }

  /*if like from user exist when dislike is pressed remove like and add dislike
  if dislike from user exist when dislike is pressed remove dislike
  if neither exist simply add dislike.*/
  const handleDislike = async () => {
    setDisableIconButton(true)
    if(!interactionData){
      await createInteraction({ recipeId: recipe?.id, label: recipe.label, image: recipe.image })
    }

    if(recipe?.likes?.includes(user?.id)){
      await removeLikeInteraction({ recipeId: recipe?.id, userId: user?.id })
      const response = await addDislikeInteraction({ recipeId: recipe?.id, userId: user?.id })
      setRecipe(prevState => ({
        ...prevState,
        dislikes: response.data?.dislikes,
        likes: response.data?.likes,
      }))
    } else if(recipe?.dislikes?.includes(user?.id)){
      const response = await removeDislikeInteraction({ recipeId: recipe?.id, userId: user?.id })
      console.log(response.data)
      setRecipe(prevState => ({
        ...prevState,
        dislikes: response.data?.dislikes,
      }))
    } else {
      const response = await addDislikeInteraction({ recipeId: recipe?.id, userId: user?.id })
      setRecipe(prevState => ({
        ...prevState,
        dislikes: response.data?.dislikes,
      }))
    }
    setDisableIconButton(false)
  }

  /*if dislike from user exist when like is pressed remove dislike and add like
  if like from user exist when like is pressed remove like
  if neither exist simply add like. */
  const handlelike = async () => {
    setDisableIconButton(true)

    if(!interactionData){
      await createInteraction({ recipeId: recipe?.id, label: recipe?.label, image: recipe?.image })
    }

    if(recipe?.dislikes?.includes(user?.id)){
      await removeDislikeInteraction({ recipeId: recipe?.id, userId: user?.id })
      const response = await addLikeInteraction({ recipeId: recipe?.id, userId: user?.id })
      console.log(response.data)
      setRecipe(prevState => ({
        ...prevState,
        likes: response.data?.likes,
        dislikes: response.data?.dislikes,
      }))
    } else if(recipe?.likes?.includes(user?.id)){
      const response = await removeLikeInteraction({ recipeId: recipe?.id, userId: user?.id })
      console.log(response.data?.likes)
      setRecipe(prevState => ({
        ...prevState,
        likes: response.data?.likes,
      }))
    } else {
      const response = await addLikeInteraction({ recipeId: recipe?.id, userId: user?.id })
      console.log(response.data)
      setRecipe(prevState => ({
        ...prevState,
        likes: response.data?.likes,
      }))
    }
    setDisableIconButton(false)
  }

  return (
    <Container >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        style={{ marginTop: '20px' }}
      >
        <Grid item xs={6} >
          <Grid container
            spacing={5}
            direction="column"
            justifyContent="space-between"
            alignItems="flex-start" >
            <Grid item>
              <ImageListItem sx={{ width: '550px', height: '550px' }}>
                <img src={recipe?.image === 'none' ? recipe?.images[currentImageIndex] : recipe?.image} alt={'...loading'} ></img>
                <ImageListItemBar
                  title={
                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                      {recipe?.label}
                    </Typography>
                  }
                  actionIcon={
                    <>
                      <IconButton onClick={handleToLeftImage}
                        key={'lefticon'}
                        sx={{ color: 'white', marginRight: 'auto' }}>
                        <ArrowBackIosNewIcon/>
                      </IconButton>
                      <IconButton onClick={handleToRightImage}
                        key={'righticon'}
                        sx={{ color: 'white',  marginLeft: 'auto' }}>
                        <ArrowForwardIosIcon/>
                      </IconButton>
                    </>}
                />
              </ImageListItem>
            </Grid>
            <Grid item>
              <Grid container
                spacing={2}
                direction="row"
                justifyContent="space-around"
                alignItems="center">
                {recipe?.creator && ( <Grid item>
                  <Link to="#" onClick={handleUserLinkClick}>
                    <Tooltip title="View profile">
                      <Box       sx={{
                        width: '120px',
                        height: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                        <Avatar src={ recipe?.creator?.profileImage ||
                `https://eu.ui-avatars.com/api/?name=${creatorFirstName}+${creatorLastName}&size=200` }
                        sx={{ width: 80, height: 80 }}/>
                        <Typography variant="h6" color={'black'} >{recipe?.creator?.username}</Typography>
                      </Box>
                    </Tooltip>
                  </Link>
                </Grid>)}
                <Grid item>
                  {recipe?.creator ? (
                    <>
                      <h1>how did you</h1>
                      <h1> like my recipe?</h1>
                    </> ) :
                    (<>
                      <h1>Dishcovery user did not </h1>
                      <h1>do this recipe, rate it</h1>
                    </> )}
                </Grid>
                <Grid item >
                  <Grid container
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                    <Grid item >
                      <IconButton disabled={disableIconButton} style={{ color: hasUserLikedRecipe ? '#00008B' : '#0000FF' }} onClick={handlelike}>
                        <ThumbUpIcon/>
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <h2>{recipe?.likes?.length || 0}</h2>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item >
                  <Grid container
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                    <Grid item >
                      <IconButton disabled={disableIconButton} style={{ color: hasUserDisikedRecipe ? '#00008B' : '#0000FF' }} onClick={handleDislike}>
                        <ThumbDownIcon/>
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <h2>{recipe?.dislikes?.length || 0}</h2>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Tooltip title={isFavorite ? 'remove from favourites' : 'save to favourites' }>
                    <IconButton disabled={disableIconButton} style={{ color: 'red', height: '75px', width: '75px' }} onClick={handleFavourite}>
                      {isFavorite ? <FavoriteIcon sx={{ height: '55px', width: '55px' }}/> : <FavoriteBorderIcon sx={{ height: '55px', width: '55px' }}/>}
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container
                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="center">
                <Grid item>
                  <Typography variant="h2">Instructions</Typography>
                </Grid>
                <Grid item>
                  <IconButton>
                    <AccessTimeIcon></AccessTimeIcon>
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography variant="h4">{recipe?.totalTime} min</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              {recipe?.instructions ? ( <Typography variant="h6">{recipe?.instructions}</Typography>
              ) : (
                <>
                  <Typography variant="h6">Since this recipe is not done by Dishcovery user we can not
                  give you instructions directly. instructions can be found in link bellow</Typography>
                  <Typography>
                    <a href={recipe?.url} target="_blank" rel="noopener noreferrer">
                      {recipe?.label}
                    </a>
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} >
          <Grid container direction="column" alignItems="flex-start">
            <Grid container direction="row" justifyContent="space-around" alignItems="flex-start">
              <Grid item>
                <Typography variant="h4">Ingredients</Typography>
              </Grid>
              <Grid item>
                <Grid container direction="column" justifyContent="center" alignItems="center">
                  <Grid item>
                    <Typography variant="h5">Adjust serving size</Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      value={multiplier}
                      onChange={handleMultiplierChange}
                      InputProps={{
                        inputProps: {
                          min: 1,
                          step: 1,
                          style: { width: '25px', height: '20px', textAlign: 'center', appearance: 'textfield' } }, // Set the minimum value to 1
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
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Box sx={{
              marginLeft: '30px',
              height: '350px',
              width: '500px',
              position: 'relative',
            }}>
              {recipe?.ingredients.slice((pageIndex) * 10,(( pageIndex + 1) * 10)).map((ingredient, index) => (
                <Typography key={index}>{`${convertToFraction(handleMultiply(ingredient.quantity))} ${ingredient.text.replace(pattern, '')}`}</Typography>
              ))}
              <IconButton sx={{
                position: 'absolute',
                bottom: '10px',
                right: '10px', }}
              onClick={handleForwardButtonChange}
              disabled={(pageIndex + 1) * 10 >= recipe?.ingredients?.length}
              >
                <ArrowForwardIcon />
              </IconButton>
              <IconButton sx={{
                position: 'absolute',
                bottom: '10px',
                right: '45px',
              }}
              disabled={pageIndex === 0}
              onClick={handleBackButtonChange}
              >
                <ArrowBackIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{
              marginLeft: '30px',
              height: '250px',
              width: '500px',
              padding: '20px'
            }}>
              <Typography variant="h5">Look for more recipes:</Typography>
              <br/>
              {recipe?.healthLabels.filter((element) => !illegalFiltters.includes(element))
                .slice(0,6).map(filtername => <RoundedButton key={filtername} backgroundColor={'#f19b1c'} healtlabel={filtername} />)}
              <br/>
              <br/>
              {recipe?.mealType?.map(filtername => <RoundedButton key={filtername} backgroundColor={'#00ff00'} healtlabel={filtername} />)}
            </Box>
          </Grid>
          <Grid item>
            {recipe?.totalNutrients ? (
              <Box sx={{
                marginLeft: '30px',
                height: '350px',
                width: '500px',
                position: 'relative',
              }}>
                <Typography variant="h5">Nutritional Information ({multiplier} servings):</Typography>
                <h1></h1>
                {Object.entries(recipe?.totalNutrients)
                  .slice((nutrientsPageIndex) * 10,(( nutrientsPageIndex + 1) * 10)).map(([key, nutrient]) => (
                    <Typography key={key}>
                      {nutrient.label}: {roundValue(handleMultiply(nutrient.quantity))} {nutrient.unit}
                    </Typography>))}

                <IconButton sx={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px', }}
                onClick={handleNutrientsForwardButtonChange}
                disabled={(nutrientsPageIndex + 1) * 10 > Object.keys(recipe?.totalNutrients).length}
                >
                  <ArrowForwardIcon />
                </IconButton>
                <IconButton sx={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '45px',
                }}
                disabled={nutrientsPageIndex === 0}
                onClick={handleNutrientsBackButtonChange}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Box>) : (
              <Box sx={{
                marginLeft: '30px',
                height: '350px',
                width: '500px',
                position: 'relative',
              }}/>
            )}
          </Grid>
        </Grid>
      </Grid>
      <CommentSection recipeId={recipe?.id} userId={user?.id} interactionData={interactionData} label={recipe?.label} image={recipe?.image} />
    </Container>
  )
}

const RoundedButton = ({ healtlabel, backgroundColor }) => {
  const buttonStyle = {
    borderRadius: '20px',
    backgroundColor:  backgroundColor,
    color: '#1b1309',
    '&:hover': {
      backgroundColor: '#e9ef3a',
    },
  }

  return (
    <Button sx={buttonStyle} variant="contained">
      {healtlabel}
    </Button>
  )
}

export default RecipeViewPage