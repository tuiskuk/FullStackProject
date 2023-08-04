import { Container, Typography, OutlinedInput, CircularProgress, Grid } from '@mui/material'
import { useState } from 'react'
import { useGetAllUserCreatedInteractionsQuery } from '../services/interactionSlice'
import RecipeCard from '../components/RecipeCard'


const UserSearchPage = () => {
  const [search, setSearch] = useState('')
  const { data: recipedata, isLoading /*,isSuccess*/, isError } = useGetAllUserCreatedInteractionsQuery()

  console.log(recipedata)



  return (
    <Container>
      <Typography variant="h5" >Search recipes done by other users</Typography>
      <OutlinedInput
        placeholder='Search recipes'
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        {isLoading ? <CircularProgress/> : isError ? <h3>error occured while trying to get recipes</h3>
          : recipedata.map((recipe) =>  <RecipeCard key={recipe.id} recipe={recipe} />) }
      </Grid>
    </Container>
  )
}

export default UserSearchPage