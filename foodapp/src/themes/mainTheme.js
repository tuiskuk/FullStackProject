import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFA726', // Warm orange color for primary elements
    },
    secondary: {
      main: '#FFC107', // Bright yellow color for secondary elements
    },
    background: {
      default: '#FEEAE6', // Light warm pink color for the default background
      paper: '#FFF3E0', // Pale warm orange color for paper surfaces
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      color: '#FF8F00', // Warm orange color for heading text
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#FF8F00',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#FF8F00',
    },
    // Add more custom typography styles as needed
  },
})

export default theme