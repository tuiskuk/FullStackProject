import React from 'react'
import { Grid, Link, Typography } from '@mui/material'

const Footer = () => {
  return (
    <Grid container spacing={2} paddingBottom={2} sx={{ backgroundColor: '#FFA726', margin: '0 auto', maxWidth: '100%', mt: '15px' }}>
      <Grid item xs={12}>
        <Typography variant="h5" fontWeight="bold" align="center">
          Full stack open project
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={3} align="center" display="flex" flexDirection="column">
            <Typography variant="h7" fontWeight="bold">
              About the project
            </Typography>
            <Link href="#" color="inherit">Github</Link>
          </Grid>
          <Grid item xs={3} align="center" display="flex" flexDirection="column">
            <Typography variant="h7" fontWeight="bold">
              About us
            </Typography>
            <Link href="#" color="inherit">Writing</Link>
          </Grid>
          <Grid item xs={3} align="center" display="flex" flexDirection="column">
            <Typography variant="h7" fontWeight="bold">
              Contact Us
            </Typography>
            <Link href="#" color="inherit">Santeri Ora</Link>
            <Link href="#" color="inherit">Otso Tikkane</Link>
            <Link href="#" color="inherit">Tuisku Kaikuvuo</Link>
          </Grid>
          <Grid item xs={3} align="center" display="flex" flexDirection="column">
            <Typography variant="h7" fontWeight="bold">
              Something
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Footer