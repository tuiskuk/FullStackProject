import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFA726', // Modern primary color (Deep Purple)
    },
    secondary: {
      main: '#00BCD4', // Elegant secondary color (Cyan)
    },
    background: {
      default: '#F5F5F5', // Light gray background
      paper: '#FFF3E0',   // Recipe card background
      neutral: '#E0E0E0', // Slightly darker neutral background
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#3949AB', // Match the primary color
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#3949AB', // Match the primary color
    },
    h3: {
      fontSize: '1.8rem',
      fontWeight: 600,
      color: '#3949AB', // Match the primary color
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#333',    // Dark text color (unchanged)
    },
    // Add more custom typography styles as needed
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none', // Preserve button text case
        borderRadius: '8px',   // Add rounded corners for buttons
      },
    },
  },
})

export default theme