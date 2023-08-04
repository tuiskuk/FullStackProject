import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { useNavigate } from 'react-router-dom'
import { Paper, CircularProgress, Grid, Typography } from '@mui/material'
import { useGetAllInteractionRecipesQuery } from '../services/interactionSlice'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import RecipeCard from './RecipeCard'
import { useGetUsersQuery } from '../services/userApiSlice'
import { selectCurrentUser } from '../services/loginSlice'
import UserCard from './UserCard'

const HomePage = () => {
  const [recipes, setRecipes] = useState([])
  const [users, setUsers] = useState([])
  const { data: recipesData, isLoading, isFetching } = useGetAllInteractionRecipesQuery()
  const { data: usersData, isLoading: isLoadingUsers, isFetching: isFetchingUsers } = useGetUsersQuery()
  const currentUser = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  const banners = [
    {
      image: '/images/banner1.png',
      link: '/search'
    }
  ]

  useEffect(() => {
    // Sort the recipes based on the number of likes in descending order
    if(recipesData) {
      const sortedRecipes = recipesData.slice().sort((a, b) => b.likes.length - a.likes.length)
      setRecipes(sortedRecipes)
    }
  }, [recipesData])

  useEffect(() => {
    // Sort users based on the number of followers in descending order

    if(usersData) {
      console.log(usersData)
      const userList = Object.values(usersData.entities)
      console.log(userList)
      const sortedUsers = userList.sort((a, b) => b.followers.length - a.followers.length)
      setUsers(sortedUsers)
    }
  }, [usersData])

  const handleBannerClick = (link) => {
    navigate(link)
  }
  console.log(recipesData)
  console.log(users)
  return (
    <Grid container spacing={2} paddingTop={1}>
      <Grid item xs={12}>
        <Carousel
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          interval={3000}
        >
          {banners.map((banner, index) => (
            <Paper
              key={index}
              sx={{
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.01)',
                },
              }}
              onClick={() => handleBannerClick(banner.link)}
            >
              <img
                src={banner.image}
                alt={`Banner ${index + 1}`}
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </Paper>
          ))}
        </Carousel>
      </Grid>

      <Grid item xs={12}>
        <Paper elevation={2} sx={{ padding: '1rem', backgroundColor: 'white' }}>
          <Typography variant="h5" fontWeight="bold" paddingLeft={1}>
            Most liked recipes
          </Typography>
          {isLoading || isFetching ? (
            <CircularProgress /> // Render the loading spinner when loading is true
          ) : recipes.length !== 0 ? (
            <Grid container spacing={2} marginTop={0.2} justifyContent="space-around" >
              {recipes.slice(0, 5).map((recipe, index) => (
                <Grid item key={index}>
                  <RecipeCard key={recipe.id} recipe={recipe} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <h3>No recipes found</h3>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper elevation={2} sx={{ padding: '1rem', backgroundColor: 'white' }}>
          <Typography variant="h5" fontWeight="bold" paddingLeft={1}>
            Most followed users
          </Typography>
          {isLoadingUsers || isFetchingUsers ? (
            <CircularProgress /> // Render the loading spinner when loading is true
          ) : recipes.length !== 0 ? (
            <Grid container spacing={3} marginTop={0.2}>
              {users.slice(0, 5).map((user, index) => (
                <Grid item xs={12} sm={6} md={2} key={index}>
                  <UserCard user={user} currentUser={currentUser}/>
                </Grid>
              ))}
            </Grid>
          ) : (
            <h3>No recipes found</h3>
          )}
        </Paper>
      </Grid>
    </Grid>
  )
}

export default HomePage