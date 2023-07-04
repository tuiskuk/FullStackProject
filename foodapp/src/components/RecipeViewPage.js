import { Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
const RecipeViewPage = () => {
  const params = useParams()
  const recipe_id = params.id
  return (
    <Typography>{recipe_id}</Typography>
  )


}

export default RecipeViewPage