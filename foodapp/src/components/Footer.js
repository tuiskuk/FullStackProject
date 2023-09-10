import React from 'react'
import { Grid, Link, Typography } from '@mui/material'

const Footer = () => {
  return (
    <Grid container padding={2} marginTop={2} sx={{ backgroundColor: '#FFA726' }}>
      <Grid item xs={12} paddingBottom={2}>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h5" fontWeight="bold">
                Dishcovery
            </Typography>
          </Grid>
          <Grid item>
            <Link href="https://www.edamam.com/" target="_blank" rel="noopener noreferrer">
              <img src="/vectors/Edamam_Badge_Transparent.svg" style={{ height: '40px' }} alt="Edamam Badge" />
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} >
        <Grid container justifyContent="space-around" spacing={2}>
          <Grid item align="center" display="flex" flexDirection="column">
            <Typography variant="h7" fontWeight="bold" paddingBottom={1}>
              Dishcovery
            </Typography>
            <Link href="/" color="inherit">HomePage</Link>
            <Link href="/search" color="inherit">Search</Link>
            <Link href="/users" color="inherit">Discovery users</Link>
            <Link href="/search" color="inherit">Search</Link>
            <Link href="/userRecipesearch" color="inherit">Recipes By Users</Link>
          </Grid>
          <Grid item align="center" display="flex" flexDirection="column">
            <Typography variant="h7" fontWeight="bold" paddingBottom={1}>
              About The Project
            </Typography>
            <Link href="https://www.edamam.com/" target="_blank" rel="noopener noreferrer" color="inherit">Recipe Api</Link>
          </Grid>
          <Grid item align="center" display="flex" flexDirection="column">
            <Typography variant="h7" fontWeight="bold" paddingBottom={1}>
              GitHub Repositories
            </Typography>
            <Link href="https://github.com/tuiskuk/FullStackProject" target="_blank" rel="noopener noreferrer" color="inherit">Project</Link>
            <Link href="https://github.com/Zantemann" target="_blank" rel="noopener noreferrer" color="inherit">Santeri Ora</Link>
            <Link href="https://github.com/tuiskuk" target="_blank" rel="noopener noreferrer" color="inherit">Otso Tikkanen</Link>
            <Link href="https://github.com/Potso12" target="_blank" rel="noopener noreferrer" color="inherit">Tuisku Kaikuvuo</Link>
          </Grid>
          <Grid item align="center" display="flex" flexDirection="column">
            <Typography variant="h7" fontWeight="bold" paddingBottom={1}>
              Something
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Footer