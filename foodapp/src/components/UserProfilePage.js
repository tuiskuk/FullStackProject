import { useEffect, useState } from 'react'
import {
  TextField,
  Button,
  Grid,
  Container,
  Avatar,
} from '@mui/material'

import { selectCurrentUser } from '../services/loginSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useUpdateUserMutation } from '../services/userSlice'
import { setUser } from '../services/loginSlice'

const UserProfile = () => {
  const [profileDescription, setProfileDescription] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const user = useSelector(selectCurrentUser)
  const [ updateUser ] = useUpdateUserMutation()
  const dispatch = useDispatch()
  console.log(user)

  useEffect(() => {
    setProfileDescription(user?.profileText)
    setNewUsername(user?.username)
  }, [])

  const handleUpdateProfile = () => {
    if(!user) return
    console.log(user.id)
    // Handle updating profile logic
    const updatedUser = {
      ...user,
      profileText: profileDescription,
      password: newPassword,
      username: newUsername,
    }
    updateUser({ id: user.id, user: updatedUser }).unwrap()
    dispatch(setUser({ user: updatedUser }))
    console.log(user)
  }

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Avatar
            alt="Profile Image"
            src={user?.profileImage}
            sx={{ width: 150, height: 150, marginBottom: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Profile Description"
            multiline
            rows={4}
            value={profileDescription}
            onChange={(e) => setProfileDescription(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateProfile}
            fullWidth
          >
            Update Profile
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default UserProfile