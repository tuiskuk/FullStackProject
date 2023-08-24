import React from 'react'
import { Grid, Typography, IconButton, Link } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'


const InstructionsSection = ({ recipe }) => {
  return (
    <Grid item xs={12} md={6} sx={{
      marginLeft: '30px',
      minHeight: '200px',
      minWidth: '25rem',
      position: 'relative',
      backgroundColor: '#FFF3E0', // Background color
      borderRadius: '10px', // Rounded corners
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
      padding: '20px', // Add some padding for spacing
    }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <IconButton color="primary">
            <AccessTimeIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <Typography variant="h5" color="primary">
            Duration {recipe?.totalTime} min
          </Typography>
        </Grid>
      </Grid>
      <Typography variant="h4" sx={{ marginTop: 2 }}>
          Instructions
      </Typography>
      <Typography variant="body1" sx={{ marginTop: 1, marginBottom: 3 }}>
        {recipe?.instructions ? (
          recipe.instructions
        ) : (
          <>
              Since this recipe is not created by one of our users, we cannot provide you with instructions directly.
              Instructions can be found in the link below.
          </>
        )}
      </Typography>
      {!recipe?.instructions && (
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          <Link
            href={recipe?.url}
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"  // Set the link color to inherit from its parent
          >
            Click here to view instructions for {recipe?.label}
          </Link>
        </Typography>
      )}
    </Grid>
  )
}

export default InstructionsSection
