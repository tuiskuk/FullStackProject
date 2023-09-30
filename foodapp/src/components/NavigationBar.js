import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../services/loginSlice'
import { Avatar ,Menu, IconButton, useMediaQuery, AppBar, Toolbar, Button, MenuItem, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'
import LogOutDialog from '../dialogs/LogOutDialog'
import { useSendLogoutMutation } from '../services/loginApiSlice'

const NavigationBar = () => {
  const user = useSelector(selectCurrentUser)
  const isScreenSmall = useMediaQuery('(max-width: 900px)')
  const [logout] = useSendLogoutMutation()

  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  console.log(user)


  if(isScreenSmall){

    return (
      <>
        <IconButton onClick={handleMenuOpen} sx={{ position: 'fixed', top: 10, left: 10, color: '#FFA726' }}>
          <MenuIcon sx={{ fontSize: '44px' }} />
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
          <MenuItem component={Link} to="/CreateRecipe">
            Create recipe
          </MenuItem>
          {!user ? <MenuItem component={Link} to="/login">
            Login
          </MenuItem> :
            <MenuItem onClick={() => logout()}>
          Log out
            </MenuItem>}
        </Menu>
      </>
    )}
  else
    return(
      <AppBar position="static" >
        <Toolbar sx={{ height: '50px' }}>
          <Button color="inherit" component={Link} to="/">
            <img src="/vectors/logo.svg" alt="Logo" style={{ height: '50px' }}/>
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/search"
            sx={{ display: { xs: 'none', md: 'block' }, textTransform: 'none' }}
          >
            <Typography variant="subtitle2">Search</Typography>
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/userRecipesearch"
            sx={{ display: { xs: 'none', md: 'block' }, textTransform: 'none' }}
          >
            <Typography variant="subtitle2">Recipes by Other Users</Typography>
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/users"
            sx={{ display: { xs: 'none', md: 'block' }, textTransform: 'none' }}
          >
            <Typography variant="subtitle2">Discover Users</Typography>
          </Button>
          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/CreateRecipe"
              sx={{ display: { xs: 'none', md: 'block' }, textTransform: 'none' }}
            >
              <Typography variant="subtitle2">Create Recipe</Typography>
            </Button>
          )}
          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/profile"
              sx={{ display: { xs: 'none', md: 'block' }, textTransform: 'none' }}
            >
              <Typography variant="subtitle2">My profile</Typography>
            </Button>
          )}
          <Grid style={{ marginLeft: 'auto' }}>
            <LoginNavigationBarItem user={user} logout={logout} />
          </Grid>
        </Toolbar>
      </AppBar>
    )
}

const LoginNavigationBarItem = ({ user }) => {

  const fisrstname = user?.user?.name?.split(' ')[0]
  const secondName = user?.user?.name?.split(' ')[1]

  const [anchorEl, setAnchorEl] = useState(null)
  const [showLogOutDialog, setShowLogOutDialog] = useState(false)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  console.log(user)
  if(user){
    return(
      <>
        <Avatar onClick={handleMenuOpen} src={ user?.profileImage ||
            `https://eu.ui-avatars.com/api/?name=${fisrstname}+${secondName}&size=200` }
        sx={{ width: 70, height: 70, cursor: 'pointer' }}/>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
        >
          <MenuItem component={Link} to="/profile">
            My Profile
          </MenuItem>
          <MenuItem onClick={() => setShowLogOutDialog(true)} >
            log out
          </MenuItem>
        </Menu>
        <LogOutDialog open={showLogOutDialog} onClose={() => setShowLogOutDialog(false)}/>
      </>

    )
  } else {
    return(
      <Button color="inherit" component={Link} to="/login">
        login
      </Button>
    )
  }
}

export default NavigationBar