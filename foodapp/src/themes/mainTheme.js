import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFA726',
      darker: '#D98B00', // Slightly darker shade for variety
    },
    secondary: {
      main: '#FFC107',
      darker: '#E0A800', // Slightly darker shade for variety
    },
    background: {
      default: '#FEEAE6',
      paper: '#FFF3E0',
      neutral: '#F5F5F5', // Added a neutral background color
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      color: '#FFA726',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#FFA726',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#FFA726',
    },
    // Add more custom typography styles as needed
  },
})

export default theme