import { Card, CardMedia, CardContent, Typography, CardActionArea  } from '@mui/material'
import { Link } from 'react-router-dom'
import { useGetRecipeQuery } from '../services/apiSlice'
import { useEffect, useState, useRef } from 'react'
import './RecipeCard.css'


const RecipeCard = ({ recipe }) => {
  console.log(recipe)
  let recipe_id  = recipe.uri ? recipe.uri.substring(recipe.uri.lastIndexOf('_') + 1) : recipe.recipeId
  let favoriteRecipe = null
  const [displayedRecipe,setDisplayedRecipe] = useState(null)

  const { data: dataFromApi } = useGetRecipeQuery(recipe.id)

  const textRef = useRef(null)

  const handleMouseEnter = () => {
    if (textRef.current) {
      const textHeight = textRef.current.clientHeight
      const underline = textRef.current.querySelector('.underline')
      if (underline) {
        underline.style.height = `${textHeight}px`
      }
    }
  }

  const handleMouseLeave = () => {
    if (textRef.current) {
      const underline = textRef.current.querySelector('.underline')
      if (underline) {
        underline.style.height = '0'
      }
    }
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
        console.log(recipe)
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

  console.log(displayedRecipe)



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
    <Link
      to={`/recipes/${recipe_id}`}
      onClick={handleRecipeClick}
      style={{ textDecoration: 'none' }}
    >
      <Card
        sx={{
          maxWidth: 200,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.03)' },
        }}
      >
        <CardActionArea onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
                  '-webkit-line-clamp': 2,
                  '-webkit-box-orient': 'vertical',
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
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  )
}

export default RecipeCard