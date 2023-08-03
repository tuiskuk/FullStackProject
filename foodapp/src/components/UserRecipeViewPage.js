import { Tooltip, TextField, Link, Box ,Avatar, Container, Grid, IconButton, ImageListItem ,ImageListItemBar, Typography, InputAdornment } from '@mui/material'
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
import { useNavigate } from 'react-router-dom'
import { selectCurrentUser, setUser } from '../services/loginSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useRemoveFavoriteMutation, useAddFavoriteMutation } from '../services/favoriteSlice'
import {
  useAddLikeMutation,
  useDeleteLikeMutation,
  useAddDislikeMutation,
  useDeleteDislikeMutation,
} from '../services/userRecipeApiSlice'

const UserRecipeViewPage = () => {
  const user = useSelector(selectCurrentUser)
  const [recipe, setRecipe] = useState(null)
  const [disableIconButton, setDisableIconButton] = useState(false)
  const [isFavorite, setIsFavourite] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [hasUserLikedRecipe, setHasUserLikedRecipe] = useState(false)
  const [hasUserDisikedRecipe, setHasUserDisikedRecipe] = useState(false)
  const [multiplier, setMultiplier] = useState(4)
  const [pageIndex, setPageIndex] = useState(0)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Use the mutation hooks for adding and deleting likes
  const [addLike] = useAddLikeMutation()
  const [deleteLike] = useDeleteLikeMutation()

  // Use the mutation hooks for adding and deleting dislikes
  const [addDislike] = useAddDislikeMutation()
  const [deleteDislike] = useDeleteDislikeMutation()

  //use mutation hooks to remove favourite
  const [removeFavorite] = useRemoveFavoriteMutation()
  const [addFavorite] = useAddFavoriteMutation()

  //regex pattern
  const pattern = /^\d+\s?\d*\/?\d*\s/

  const creatorNameParts = recipe?.creator?.name
  const creatorFirstName = creatorNameParts && creatorNameParts[0]
  const creatorLastName = creatorNameParts && creatorNameParts[1]

  useEffect(() => {
    if(recipe?.likes.includes(user?.id)){
      setHasUserLikedRecipe(true)
    } else {
      setHasUserLikedRecipe(false)
    }

    if(recipe?.dislikes.includes(user?.id)){
      setHasUserDisikedRecipe(true)
    } else {
      setHasUserDisikedRecipe(false)
    }
  },[recipe])

  useEffect(() => {
    if(user?.favorites.includes(recipe?.id)){
      setIsFavourite(true)
    } else {
      setIsFavourite(false)
    }

    console.log('user modified', user)
  },[user])

  useEffect(() => {
    setRecipe(JSON.parse(sessionStorage.getItem('recipe')))
    if(user?.favorites.includes(recipe?.id)){
      setIsFavourite(true)
    }
  },[])

  const { data: interactionData } = useGetAllInteractionsQuery(
    { recipeId: recipe?.id }, { skip: !recipe?.id, refetchOnMountOrArgChange: true })

  useEffect(() => {
    console.log(pageIndex)
  },[pageIndex])

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
      navigate(`/users/${recipe?.creator.id}`)
    }
  }

  const handleForwardButtonChange = () => {
    if((pageIndex + 1) * 10 < recipe?.ingredientLines.length){
      setPageIndex((prevIndex) => prevIndex + 1)
    }
  }

  const handleBackButtonChange = () => {
    if(pageIndex > 0){
      setPageIndex((prevIndex) => prevIndex - 1)
    }
  }

  const handleMultiply = (value) => {
    return ((value/12) * multiplier)
  }

  const convertToFraction = (value) => {
    const fraction = new Fraction(value)
    return fraction.toFraction(true)
  }

  const handleFavourite = async () => {
    setDisableIconButton(true)
    if(user?.favorites?.includes(recipe?.id)){
      const response = await removeFavorite({ recipeId: recipe?.id, userId: user?.id })
      console.log(response.data)
      dispatch(setUser({ user: response.data }))
    } else {
      const response = await addFavorite({ recipeId: recipe?.id, userId: user?.id })
      console.log(response.data)
      dispatch(setUser({ user: response.data }))
    }
    setIsFavourite((prevboolean) => !prevboolean )
    setDisableIconButton(false)
  }

  /*if like from user exist when dislike is pressed remove like and add dislike
  if dislike from user exist when dislike is pressed remove dislike
  if neither exist simply add dislike*/
  const handleDislike = async () => {
    setDisableIconButton(true)
    if(recipe?.likes?.includes(user?.id)){
      await deleteLike({ recipeId: recipe?.id, userId: user?.id })
      const response = await addDislike({ recipeId: recipe?.id, userId: user?.id })
      setRecipe(response.data)
    } else if(recipe?.dislikes?.includes(user?.id)){
      const response = await deleteDislike({ recipeId: recipe?.id, userId: user?.id })
      setRecipe(response.data)
    } else {
      const response = await addDislike({ recipeId: recipe?.id, userId: user?.id })
      setRecipe(response.data)
    }
    setDisableIconButton(false)
  }

  /*if dislike from user exist when like is pressed remove dislike and add like
  if like from user exist when like is pressed remove like
  if neither exist simply add like*/
  const handlelike = async () => {
    setDisableIconButton(true)
    if(recipe?.dislikes?.includes(user?.id)){
      await deleteDislike({ recipeId: recipe?.id, userId: user?.id })
      const response = await addLike({ recipeId: recipe?.id, userId: user?.id })
      setRecipe(response.data)
    } else if(recipe?.likes.includes(user?.id)){
      const response = await deleteLike({ recipeId: recipe?.id, userId: user?.id })
      setRecipe(response.data)
    } else {
      const response = await addLike({ recipeId: recipe?.id, userId: user?.id })
      setRecipe(response.data)
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
                <img src={recipe?.images[currentImageIndex]} alt={'...loading'} ></img>
                <ImageListItemBar
                  title={
                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                      {recipe?.label}
                    </Typography>
                  }
                  actionIcon={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
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
                    </div>}
                />
              </ImageListItem>
            </Grid>
            <Grid item>
              <Grid container
                spacing={2}
                direction="row"
                justifyContent="space-around"
                alignItems="center">
                <Grid item>
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
                </Grid>
                <Grid item>
                  <h1>how did you</h1><h1> like my recipe?</h1>
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
                      <h2>{recipe?.likes.length}</h2>
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
                      <h2>{recipe?.dislikes.length}</h2>
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
              <Typography variant="h6">{recipe?.instructions}</Typography>
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
              disabled={(pageIndex + 1) * 10 >= recipe?.ingredients.length}
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
              position: 'relative',
            }}>

            </Box>
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
              disabled={(pageIndex + 1) * 10 >= recipe?.ingredients.length}
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
        </Grid>
      </Grid>
      <CommentSection recipeId={recipe?.id} userId={user?.id} interactionData={interactionData} label={recipe?.label} image={recipe?.image} />
    </Container>
  )
}

export default UserRecipeViewPage