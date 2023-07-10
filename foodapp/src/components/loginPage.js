import { useState } from 'react'
import  { TextField, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation, loginSuccess, logout } from '../services/loginSlice'
import { useDispatch, useSelector } from 'react-redux'


const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login] = useLoginMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(state => state.login.isLoggedIn)
  const user = useSelector(state => state.login.user)

  const handleLogOut = () => {
    dispatch(logout())
    localStorage.clear()
  }


  const handleLogin = async (event) => {
    event.preventDefault()

    try{
      const response = await login({ email, password })
      const loggedInUser = response.data.user.user
      const token = response.data.token
      console.log(loggedInUser)

      dispatch(loginSuccess({ token: `Bearer ${token}` , user: loggedInUser }))
      setEmail('')
      setPassword('')
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }



  if(isLoggedIn){
    return (
      <>
        <Typography>you are logged in as a {user.username}</Typography>
        <Button onClick={handleLogOut}>log out</Button>
      </>
    )
  }
  else {
    return (
      <form onSubmit={handleLogin}>
        <Typography variant="h1">Log in to your account</Typography>
        {/*<Typography variant="h2">Logging in enables you to add comments on recepies, like/dislike recepies, add reciepies you like in favouriteslist, follow users and much more  </Typography>*/}
        <TextField
          label="Email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">Log in</Button>
        <Typography variant="h2">Dont have user? <Link to="/register">Click here</Link> to sign up.</Typography>
      </form>
    )
  }
}

export default LoginPage