import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { useNavigate } from 'react-router-dom'
import { Paper, CircularProgress, Grid } from '@mui/material'
import { useGetAllInteractionRecipesQuery } from '../services/interactionSlice'
import { useState, useEffect } from 'react'
import RecipeCard from './RecipeCard'

const HomePage = () => {
  const [recipes, setRecipes] = useState([])
  const { data: recipesData, isLoading, isFetching } = useGetAllInteractionRecipesQuery()
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

  const handleBannerClick = (link) => {
    navigate(link)
  }

  return (
    <div>
      <h2>Home Page</h2>
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
            elevation={3}
            sx={{
              cursor: 'pointer',
              overflow: 'hidden',
            }}
            onClick={() => handleBannerClick(banner.link)}
          >
            <img
              src={banner.image}
              alt={`Banner ${index + 1}`}
              style={{
                width: '100%',
                height: 'auto',
                transition: 'transform 0.2s',
              }}
            />
          </Paper>
        ))}
      </Carousel>
      <h2>Most liked recipes</h2>
      {isLoading || isFetching ? (
        <CircularProgress /> // Render the loading spinner when loading is true
      ) : recipes.length !== 0 ? (
        <Grid container spacing={3} marginTop={0.2}>
          {recipes.map((recipe, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <RecipeCard key={recipe.id} recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <h3>No recipes found</h3>
      )}
    </div>
  )
}

export default HomePage