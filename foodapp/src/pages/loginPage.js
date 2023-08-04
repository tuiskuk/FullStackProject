import { useState, useEffect } from 'react'
import  { TextField, Typography, Button, Container, Grid, Snackbar, Alert } from '@mui/material'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation, useSendLogoutMutation } from '../services/loginApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import {  selectCurrentUser, setUser } from '../services/loginSlice'
import { ExpirationWarningDialog } from '../components/WarningDialog'

const LoginPage = ({ action }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [ login, error ] = useLoginMutation()
  const [logout] = useSendLogoutMutation()
  const [ showWarning, setShowWarning ] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)

  const imageStyle = {
    width: '100%',
    height: '100vh',
    backgroundImage: 'url(/images/loginPageImage.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const formStyle = {
    padding: '0 20px',
  }

  const containerStyle = {
    height: '100vh',
    overflow: 'hidden',
  }

  const handleLogOut = async() => {
    await logout()
  }

  // Function to handle Snackbar close event
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  // Trigger Snackbar when an error occurs
  useEffect(() => {
    if (error) {
      setOpenSnackbar(true)
    }
  }, [error])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const response = await login({ email, password }).unwrap()
      const loggedInUser = response.user

      dispatch(setUser(loggedInUser))
      setEmail('')
      setPassword('')

      if(!action) {
        navigate('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (user) {
    return (
      <Container maxWidth="sm">
        <Typography>
          You are logged in as {user?.username}
        </Typography>
        <Button onClick={handleLogOut}>Log out</Button>
      </Container>
    )
  } else {
    return (
      <Container maxWidth={action ? 'sm' : false} style={!action ? containerStyle : undefined}>

        <Grid container sx={{ width: !action ? '100%' : undefined }}>
          {/* Left column for the image */}
          {!action && <Grid item xs={6}>
            <div style={imageStyle}></div>
          </Grid>}

          {error.error && <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert severity="error" onClose={handleCloseSnackbar}>
              {error.error && error.error.data && error.error.data.error}
            </Alert>
          </Snackbar>}
          <ExpirationWarningDialog open={showWarning} onClose={() => setShowWarning(false)} />

          {/* Right column for the login form */}
          <Grid item xs={action ? 12 : 6} style={{ display: 'flex', alignItems: 'center' }}>
            <Container style={formStyle}>
              <form onSubmit={handleLogin}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h4" align="center">
                    Log in to your account
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {/* <Typography variant="h2">
                    Logging in enables you to add comments on recipes, like/dislike recipes, add recipes you like to the favorites list, follow users, and much more
                  </Typography> */}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" color="primary" type="submit">
                    Log in
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">
                    Dont have an account? <Link to="/register">Click here</Link> to sign up.
                    </Typography>
                  </Grid>
                </Grid>
              </form>
            </Container>

            {error.error && <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
              <Alert severity="error" onClose={handleCloseSnackbar}>
                {error.error && error.error.data && error.error.data.error}
              </Alert>
            </Snackbar>}
          </Grid>
        </Grid>
      </Container>
    )
  }
}

export default LoginPage