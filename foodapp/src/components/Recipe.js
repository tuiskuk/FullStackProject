import { Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material'
import { Link } from 'react-router-dom'
const Recipe = ({ recipe }) => {
  const recipe_id = recipe.uri.substring(recipe.uri.lastIndexOf('_') + 1)

  const handleRecipeClick = () => {
    try {
      // Save the recipe to sessionStorage
      sessionStorage.setItem('recipe', JSON.stringify(recipe))
    } catch (error) {
      console.log('Error saving recipe:', error)
    }
  }
  return (
    <Link to={`/recipes/${recipe_id}`} onClick={handleRecipeClick}>
      <Card sx={{ maxWidth: 200 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            src={recipe.images.SMALL.url}
            alt={recipe.label}
            height={200}
            width={200}
          />
          <CardContent sx={{ height: 80 }}>
            <Typography variant="h6">{recipe.label}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  )
}

export default Recipe