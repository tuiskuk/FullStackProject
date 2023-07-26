import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { useNavigate } from 'react-router-dom'
import { Paper } from '@mui/material'

const HomePage = () => {
  const navigate = useNavigate()
  const banners = [
    {
      image: '/banner1.png',
      link: '/search'
    }
  ]
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
    </div>
  )
}

export default HomePage