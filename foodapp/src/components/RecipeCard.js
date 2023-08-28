import { Card, CardMedia, CardContent, Typography, CardActionArea, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions  } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useGetRecipeQuery } from '../services/apiSlice'
import { useEffect, useState, useRef } from 'react'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import { useDeleteSpecificUserCreatedRecipeMutation } from '../services/interactionSlice'
import './RecipeCard.css'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../services/loginSlice'


const RecipeCard = ({ recipe, deleteRecipe, edit }) => {
  let recipe_id  = recipe.uri ? recipe.uri.substring(recipe.uri.lastIndexOf('_') + 1) : recipe.recipeId
  let favoriteRecipe = null
  const [displayedRecipe,setDisplayedRecipe] = useState(null)
  const [isHovered, setIsHovered] = useState(false)
  const user = useSelector(selectCurrentUser)
  const userId = user?.id
  const navigate = useNavigate()


  const { data: dataFromApi } = useGetRecipeQuery(recipe.id)
  const [ deleteSpecificUserCreatedRecipe ] = useDeleteSpecificUserCreatedRecipeMutation()

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Handle opening the delete confirmation dialog
  const handleOpenDeleteDialog = (event) => {
    event?.preventDefault() // Prevent the link navigation
    setDeleteDialogOpen(true)
  }

  // Handle closing the delete confirmation dialog
  const handleCloseDeleteDialog = (event) => {
    event?.preventDefault()
    setDeleteDialogOpen(false)
  }

  // Handle recipe deletion after confirmation
  const handleDeleteRecipe = async (event) => {
    event?.preventDefault()
    try {
      await deleteSpecificUserCreatedRecipe({ userId: userId, recipeId: recipe.recipeId })
      // Additional logic you may want to perform after deletion
    } catch (error) {
      // Handle error if deletion fails
    }
    handleCloseDeleteDialog()
  }

  const textRef = useRef(null)

  const handleMouseEnter = () => {
    if (textRef.current) {
      const textHeight = textRef.current.clientHeight
      const underline = textRef.current.querySelector('.underline')
      if (underline) {
        underline.style.height = `${textHeight}px`
      }
    }
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    if (textRef.current) {
      const underline = textRef.current.querySelector('.underline')
      if (underline) {
        underline.style.height = '0'
      }
    }
    setIsHovered(false)
  }

  //inside useEffect to make sure that dataFromApi and recipe are defined
  useEffect(() => {
    try {
      //modify recipe only if it is not created by user
      //and does not contain api information
      if(!recipe?.creator && !recipe?.url){
        //we need to make sure that properties instruktions, totalTime
        //and so on will be set in sessionStorage and in recipeViewPages state
        recipe = dataFromApi?.recipe
        //console.log(recipe)
      }

      setDisplayedRecipe(recipe)

    } catch (e) {recipe
      favoriteRecipe = dataFromApi?.recipe
      setDisplayedRecipe(favoriteRecipe)
      console.log(dataFromApi)
      console.log(favoriteRecipe)
      console.log('card error', e)
    }

    //console.log(displayedRecipe)
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
    <div
      className="card-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={`/recipes/${recipe_id}`}
        onClick={handleRecipeClick}
        style={{ textDecoration: 'none' }}
      >

        <Card
          sx={{
            maxWidth: 200,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              src={
                displayedRecipe?.images?.SMALL?.url ||
                displayedRecipe?.image ||
                displayedRecipe?.images[0]
              }
              alt={displayedRecipe?.label}
              height={200}
              width={200}
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/200?text=No+Image'
              }}
            />
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: 80,
                padding: '8px',
                position: 'relative', // Added for positioning pseudo-element
              }}
            >
              <span className="recipe-label" ref={textRef}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    marginBottom: 1,
                    overflow: 'hidden',
                    whiteSpace: 'normal',
                    display: '-webkit-box',
                    WebkitLineClamp: 2, // Change to camelCase
                    WebkitBoxOrient: 'vertical', // Change to camelCase
                    position: 'relative', // Added for positioning pseudo-element
                  }}
                >
                  {displayedRecipe?.label}
                  <span className="underline"></span>
                </Typography>
              </span>
              <div className="tags">
                {displayedRecipe?.dishType?.map((dish, index) => (
                  <span key={index} className="tag">
                    {dish}
                  </span>
                ))}
                {displayedRecipe?.cuisineType?.map((cuisine, index) => (
                  <span key={index} className="tag">
                    {cuisine}
                  </span>
                ))}
                {displayedRecipe?.mealType?.map((meal, index) => (
                  <span key={index} className="tag">
                    {meal}
                  </span>
                ))}
              </div>
              {deleteRecipe && (
                <div>
                  <Button onClick={handleOpenDeleteDialog}>Delete</Button>
                  <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Are you sure you want to delete this recipe?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                      <Button onClick={handleDeleteRecipe} color="error">
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              )}
              {edit && (
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    sessionStorage.setItem('recipe', JSON.stringify(displayedRecipe))
                    navigate({
                      pathname: '/editRecipe',
                    })
                  }}
                >
                  Edit
                </Button>
              )}
            </CardContent>
          </CardActionArea>
        </Card>
        {isHovered && <div className="overlay">{/* Likes and Comments Count */}
          <div className="likes-comments">
            <span className="likes"><ThumbUpIcon/> {recipe?.likes?.length ? recipe?.likes?.length : 0} </span>
            <span className="comments"><ChatBubbleIcon/> {recipe?.comments?.length ? recipe?.comments?.length : 0} </span>
          </div>
        </div>}

      </Link>
    </div>
  )
}

export default RecipeCard