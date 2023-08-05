import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../services/loginSlice'
import { Avatar ,Menu, IconButton, useMediaQuery, AppBar, Toolbar, Button, MenuItem } from '@mui/material'
import { Link } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'
import LogOutDialog from './LogOutDialog'
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
        <IconButton onClick={handleMenuOpen} sx={{ position: 'absolute', top: 10, left: 10 }}>
          <MenuIcon sx={{ fontSize: '34px', color: '#000' }} />
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
        <Toolbar sx={{ height: '75px' }}>
          <Button color="inherit" component={Link} to="/">
            <img src="/vectors/logo.svg" alt="Logo" style={{ height: '50px' }}/>
          </Button>
          <Button color="inherit" component={Link} to="/search">
            search
          </Button>
          <Button color="inherit" component={Link} to="/userRecipesearch">
            recipes by other users
          </Button>
          <Button color="inherit" component={Link} to="/users">
            Discover users
          </Button>
          {user && (
            <Button color="inherit" component={Link} to="/createrecipe">
              Create recipe
            </Button>
          )}
          <LoginNavigationBarItem user={user} />
        </Toolbar>
      </AppBar>
    )
}

const LoginNavigationBarItem = (user) => {

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
  if(user.user){
    return(
      <>
        <Avatar onClick={handleMenuOpen} src={ user?.user?.profileImage ||
            `https://eu.ui-avatars.com/api/?name=${fisrstname}+${secondName}&size=200` }
        sx={{ width: 70, height: 70 }}/>
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