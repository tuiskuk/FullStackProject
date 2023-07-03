import { Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material'

const Recipe = ({ recipe }) => {
  return (
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
  )
}

export default Recipe