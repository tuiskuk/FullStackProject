import { useMediaQuery, Tooltip, TextField, Link, Box ,Avatar, Container, Grid, IconButton, ImageListItem ,ImageListItemBar, Typography, InputAdornment } from '@mui/material'
import { useEffect, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { selectCurrentUser } from '../services/loginSlice'
import { useSelector } from 'react-redux'
import CommentSection from '../components/CommentSectionComponent'
import { useAddFavoriteMutation, useRemoveFavoriteMutation, useGetAllFavoritesQuery } from '../services/favoriteSlice'
import { useAddLikeInteractionMutation, useRemoveLikeInteractionMutation,
  useAddDislikeInteractionMutation, useRemoveDislikeInteractionMutation,
  useGetAllInteractionsQuery, useCreateInteractionMutation } from '../services/interactionSlice'

import { WarningDialog } from '../components/WarningDialog'
import { useNavigate, useParams } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import Fraction from 'fraction.js'

const RecipeViewPage = () => {
  const { recipeId } = useParams()
  const [recipe, setRecipe] = useState({})
  const [showWarningDialog, setShowWarningDialog] = useState(false)
  const user = useSelector(selectCurrentUser)
  const userId = user?.id
  const [showRecipeGrid, setShowRecipeGrid] = useState(true)
  const isScreenSmall = useMediaQuery('(max-width: 1180px)')


  useEffect(() => {
    const savedRecipe = sessionStorage.getItem('recipe')
    const parsedRecipe = JSON.parse(savedRecipe)
    setRecipe(parsedRecipe)
  }, [])




  const { data: interactionData } = useGetAllInteractionsQuery(
    { recipeId }, { skip: !recipeId, refetchOnMountOrArgChange: true })


  console.log(interactionData)
  console.log(recipe)



  if(isScreenSmall){
    return (
      <Container >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          style={{ marginTop: '20px' }}>


          {showRecipeGrid ? (
            <RecipeGrid recipe={recipe} interactionData={interactionData} recipeId={recipeId} user={user} userId={userId} setShowWarningDialog={setShowWarningDialog} isScreenSmall={isScreenSmall} setShowRecipeGrid={setShowRecipeGrid} />
          ) : (
            <InfoGrid recipe={recipe} isScreenSmall={isScreenSmall} setShowRecipeGrid={setShowRecipeGrid} />
          )}
        </Grid>


        <CommentSection recipeId={recipeId} userId={userId} interactionData={interactionData} label={recipe?.label} image={recipe?.image} />
        <WarningDialog open={showWarningDialog} onClose={() => setShowWarningDialog(false)} user={user} />
      </Container>
    )
  }

  else{
    return (
      <Container >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          style={{ marginTop: '20px' }}>


          <RecipeGrid recipe={recipe} interactionData={interactionData} recipeId={recipeId} user={user} userId={userId} setShowWarningDialog={setShowWarningDialog} isScreenSmall={isScreenSmall} setShowRecipeGrid={setShowRecipeGrid} />
          <InfoGrid recipe={recipe}  isScreenSmall={isScreenSmall} setShowRecipeGrid={setShowRecipeGrid}/>

        </Grid>
        <CommentSection recipeId={recipeId} userId={userId} interactionData={interactionData} label={recipe?.label} image={recipe?.image} setShowRecipeGrid={setShowRecipeGrid} />
        <WarningDialog open={showWarningDialog} onClose={() => setShowWarningDialog(false)} user={user} />
      </Container>
    )
  }
}




const RecipeGrid = ({ recipe, interactionData ,user ,recipeId, setShowWarningDialog, userId, isScreenSmall, setShowRecipeGrid }) => {
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [disableIconButton, setDisableIconButton] = useState(false)

  const label = recipe.label
  const image = recipe.image

  const [ addLikeInteraction ] = useAddLikeInteractionMutation()
  const [ removeLikeInteraction ] = useRemoveLikeInteractionMutation()
  const [ addDislikeInteraction ] = useAddDislikeInteractionMutation()
  const [ removeDislikeInteraction ] = useRemoveDislikeInteractionMutation()
  const [ addFavorite ] = useAddFavoriteMutation()
  const [ removeFavorite ] = useRemoveFavoriteMutation()
  const [ createInteraction ] = useCreateInteractionMutation()

  const { data: favoriteData, refetch } = useGetAllFavoritesQuery(
    { userId }, { skip: !userId, refetchOnMountOrArgChange: true })


  console.log(favoriteData)


  const creatorNameParts = recipe?.creator?.name
  const creatorFirstName = creatorNameParts && creatorNameParts[0]
  const creatorLastName = creatorNameParts && creatorNameParts[1]

  //can search also from user
  const isLiked = Boolean(interactionData?.recipe?.likes.some((user) => user === userId))
  const isDisliked = Boolean(interactionData?.recipe?.dislikes.some((user) => user === userId))
  const isFavorite = Boolean(favoriteData?.favorites?.some((recip) => recip.recipeId === recipeId))

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

  const handleLike = async () => {
    console.log(recipeId)
    if(!user) {
      setShowWarningDialog(true)
      return
    }
    //set disable iconbutton to true and release it in each case
    setDisableIconButton(true)


    if(!interactionData){
      try {
        await createInteraction({ recipeId, label, image })
        console.log('create')
      } catch (error) {
        setDisableIconButton(false)
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
            setDisableIconButton(false)
            console.error('Failed to remove dislike: ', error)
          }
        }
      } catch (error) {
        setDisableIconButton(false)
        console.error('Failed to add like: ', error)
      }
    }

    if (isLiked){
      try {
        await removeLikeInteraction({ recipeId, userId })
      } catch (error) {
        setDisableIconButton(false)
        console.error('Failed to remove like: ', error)
      }
    }
    setDisableIconButton(false)
  }

  const handleDislike = async () => {
    console.log(recipeId)
    if(!user) {
      setShowWarningDialog(true)
      return
    }
    //set disable iconbutton to true and release it in each case
    setDisableIconButton(true)

    if(!interactionData){
      try {
        await createInteraction({ recipeId, label, image })
        console.log('create')
      } catch (error) {
        setDisableIconButton(false)
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
            setDisableIconButton(false)
            console.error('Failed to remove like: ', error)
          }
        }
      } catch (error) {
        setDisableIconButton(false)
        console.error('Failed to add dislike: ', error)
      }
    }

    if (isDisliked){
      try {
        await removeDislikeInteraction({ recipeId, userId })
      } catch (error) {
        setDisableIconButton(false)
        console.error('Failed to remove dislike: ', error)
      }
    }
    setDisableIconButton(false)
  }

  const handleFavorite = async () => {
    console.log(recipeId)
    if(!user) {
      setShowWarningDialog(true)
      return
    }
    //set disable iconbutton to true and release it in each case
    setDisableIconButton(true)

    if (!isFavorite) {
      if(!interactionData){
        try {
          await createInteraction({ recipeId, label, image })
          console.log('create')
        } catch (error) {
          setDisableIconButton(false)
          console.error('Failed to create interaction: ', error)
        }
      }

      try {
        await addFavorite({ userId, recipeId })
        refetch()
      } catch (err) {
        setDisableIconButton(false)
        console.error('Failed to add favorite: ', err)
      }
    }

    if(isFavorite){
      try {
        await removeFavorite({ userId, recipeId })
        refetch()
      } catch (err) {
        setDisableIconButton(false)
        console.error('Failed to remove favorite: ', err)
      }
    }
    setDisableIconButton(false)
  }

  return(
    <Grid item xs={ isScreenSmall ? 12 : 6 } >

      {/* switch page button for movile  */}
      {isScreenSmall && (
        <IconButton onClick={() => setShowRecipeGrid(false)} key={'lefticon'}
          sx={{
            position: 'fixed',
            top: '50%',
            right: '30px', // Adjust this value to position the button from the right
            zIndex: 2,
            color: 'black',
          }}>
          <ArrowForwardIosIcon sx={{ height: '50px', width: '50px' }} />
        </IconButton>
      )}

      <Grid container
        spacing={5}
        direction="column"
        justifyContent="space-between"
        alignItems="flex-start" >

        <Grid item style={{ flexGrow: 1, flexBasis: 'auto', width: '100%', height: '100%' }}>
          <ImageListItem>
            <img src={ recipe?.image ? recipe?.image : recipe?.images?.[currentImageIndex] }
              alt={'...loading'} ></img>
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
              <Link to="#" onClick={() => navigate(`/users/${recipe?.creator.id}`)}>
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
                  <h1>like my recipe?</h1>
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
                  <IconButton disabled={disableIconButton} style={{ color: isLiked ? '#00008B' : '#0000FF' }} onClick={handleLike}>
                    <ThumbUpIcon/>
                  </IconButton>
                </Grid>
                <Grid item>
                  <h2>{interactionData?.recipe?.likes.length || 0}</h2>
                </Grid>
              </Grid>
            </Grid>

            <Grid item >
              <Grid container
                direction="column"
                justifyContent="center"
                alignItems="center">
                <Grid item >
                  <IconButton disabled={disableIconButton} style={{ color: isDisliked ? '#00008B' : '#0000FF' }} onClick={handleDislike}>
                    <ThumbDownIcon/>
                  </IconButton>
                </Grid>
                <Grid item>
                  <h2>{interactionData?.recipe?.dislikes?.length || 0}</h2>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Tooltip title={isFavorite ? 'remove from favourites' : 'save to favourites' }>
                <IconButton disabled={disableIconButton} style={{ color: 'red', height: '75px', width: '75px' }} onClick={handleFavorite}>
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
  )}


const InfoGrid = ({ recipe, isScreenSmall, setShowRecipeGrid }) => {
  const [pageIndex, setPageIndex] = useState(0)
  const [multiplier, setMultiplier] = useState(recipe.yield || 1)
  const [nutrientsPageIndex, setNutrientsPageIndex] = useState(0)

  //regex pattern
  const pattern = /^\d+\s?\d*\/?\d*\s/

  const handleForwardButtonChange = () => {
    if((pageIndex + 1) * 10 < recipe?.ingredientLines?.length){
      setPageIndex((prevIndex) => prevIndex + 1)
      setNutrientsPageIndex(0)
    }
  }

  const handleBackButtonChange = () => {
    if(pageIndex > 0){
      setPageIndex((prevIndex) => prevIndex - 1)
    }
  }

  const handleForwardButton = () => {
    if((nutrientsPageIndex + 1) * 15 < Object.entries(recipe?.totalNutrients).length){
      setNutrientsPageIndex((prevIndex) => prevIndex + 1)
    }
  }

  const handleBackButton = () => {
    if(nutrientsPageIndex > 0){
      setNutrientsPageIndex((prevIndex) => prevIndex - 1)
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
    return ((value/recipe?.yield) * multiplier)
  }

  const roundValue = (value) => {
    return Number(value.toFixed(1))
  }

  return(
    <Grid item xs={ isScreenSmall ? 12 : 6} >

      {/* switch page button for movile  */}
      {isScreenSmall && (
        <IconButton onClick={() => setShowRecipeGrid(true)} key={'righticon'}
          sx={{
            position: 'fixed',
            top: '50%',
            left: '30px',
            zIndex: 1,
            color: 'black',
            height: '50px',
            width: '50px'
          }}>
          <ArrowBackIosNewIcon sx={{ height: '50px', width: '50px' }} />
        </IconButton>
      )}

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
          width: isScreenSmall ? '100%' : '500px',
          position: 'relative',
        }}>
          {recipe?.ingredients?.slice((pageIndex) * 10,(( pageIndex + 1) * 10)).map((ingredient, index) => (
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

      {recipe?.totalNutrients && <Grid item>
        <Box sx={{
          marginLeft: '30px',
          height: '500px',
          width: isScreenSmall ? '100%' : '500px',
          position: 'relative',
        }}>

          <Typography variant="h5">Nutritional Information ({multiplier} servings):</Typography>
          <h1></h1>
          {Object.entries(recipe?.totalNutrients)
            .slice((nutrientsPageIndex) * 15,(( nutrientsPageIndex + 1) * 15)).map(([key, nutrient]) => (
              <Typography key={key}>
                {nutrient.label}: {roundValue(handleMultiply(nutrient.quantity))}
                {nutrient.unit}
              </Typography>))}
          <IconButton sx={{
            position: 'absolute',
            bottom: '10px',
            right: '10px', }}
          onClick={handleForwardButton}
          disabled={(nutrientsPageIndex + 1) * 15 >= Object.entries(recipe?.totalNutrients).length }
          >
            <ArrowForwardIcon />
          </IconButton>
          <IconButton sx={{
            position: 'absolute',
            bottom: '10px',
            right: '45px',
          }}
          disabled={nutrientsPageIndex === 0}
          onClick={handleBackButton}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </Grid>}
    </Grid>
  )}

export default RecipeViewPage