import { useState, useEffect } from 'react'
import  { TextField, Typography, Button, Container, Grid, Snackbar, Alert } from '@mui/material'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation, useSendLogoutMutation } from '../services/loginApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import {  selectCurrentUser, setUser } from '../services/loginSlice'


const LoginPage = ({ action }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [ login, error ] = useLoginMutation()
  const [logout] = useSendLogoutMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  console.log(user)
  console.log(error)

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

    try{
      const response = await login({ email, password }).unwrap()
      console.log(response)
      const loggedInUser = response.user
      console.log(loggedInUser)
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
      <Container maxWidth="sm">
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
        {error.error && <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert severity="error" onClose={handleCloseSnackbar}>
            {error.error && error.error.data && error.error.data.error}
          </Alert>
        </Snackbar>}
      </Container>
    )
  }
}

export default LoginPage