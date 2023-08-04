import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../services/loginSlice'
import { Menu, IconButton, useMediaQuery, AppBar, Toolbar, Button, MenuItem } from '@mui/material'
import { Link } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'


const NavigationBar = () => {
  const user = useSelector(selectCurrentUser)
  const isScreenSmall = useMediaQuery('(max-width: 900px)')

  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }


  if(isScreenSmall){

    return (
      <>
        <IconButton onClick={handleMenuOpen} sx={{ position: 'absolute', top: 0, left: 0 }}>
          <MenuIcon sx={{ fontSize: '24px', color: '#000' }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
        >
          <MenuItem component={Link} to="/">
            <img src="/vectors/logo.svg" alt="Logo" style={{ height: '50px' }} />
          </MenuItem>
          <MenuItem component={Link} to="/search">
            Search
          </MenuItem>
          <MenuItem component={Link} to="/users">
            Discover users
          </MenuItem>
          <MenuItem component={Link} to="/userRecipesearch">
            Recipes by other users
          </MenuItem>
          <MenuItem component={Link} to="/profile">
            My Profile
          </MenuItem>
          <MenuItem component={Link} to="/createrecipe">
            Create recipe
          </MenuItem>
          <MenuItem component={Link} to="/login">
            Login
          </MenuItem>
        </Menu>
      </>
    )}
  else
    return(
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            <img src="/vectors/logo.svg" alt="Logo" style={{ height: '50px' }}/>
          </Button>
          <Button color="inherit" component={Link} to="/search">
            search
          </Button>
          <Button color="inherit" component={Link} to="/users">
            Discover users
          </Button>
          <Button color="inherit" component={Link} to="/userRecipesearch">
            recipes by other users
          </Button>
          {user && (
            <Button color="inherit" component={Link} to="/profile">
              My Profile
            </Button>
          )}
          <Button color="inherit" component={Link} to="/users">
            Discover users
          </Button>
          {user && (
            <Button color="inherit" component={Link} to="/createrecipe">
              Create recipe
            </Button>
          )}
          <Button color="inherit" component={Link} to="/login">
            login
          </Button>
        </Toolbar>
      </AppBar>
    )
}

export default NavigationBar