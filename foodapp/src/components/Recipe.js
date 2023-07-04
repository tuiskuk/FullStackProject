import { Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material'
import { Link } from 'react-router-dom'
const Recipe = ({ recipe }) => {
  const recipe_id = recipe.uri.substring(recipe.uri.lastIndexOf('_') + 1)
  return (
    <Link to={`/${recipe_id}`}>
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
            <Typography>{recipe_id}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  )
}

export default Recipe