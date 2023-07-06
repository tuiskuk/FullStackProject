import { Typography, Grid, Avatar, Paper } from '@mui/material'
import { useEffect, useState } from 'react'

const UserViewPage = () => {
  const [user, setUser] = useState({})

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user')
    const parsedUser = JSON.parse(savedUser)
    setUser(parsedUser)
  }, [])

  const nameParts = user?.name?.split(' ')
  const firstName = nameParts && nameParts[0]
  const lastName = nameParts && nameParts[1]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">{user.name} Profile Page</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ padding: '20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Avatar
                src={user.profileImage || `https://eu.ui-avatars.com/api/?name=${firstName}+${lastName}&size=200`}
                alt={user.name}
                sx={{ width: '200px', height: '200px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Username: {user.username}</Typography>
              <Typography variant="body1">Who am I: {user.profileText || 'No profile text available'}</Typography>
              <Typography variant="body1">Favorite recipes: {user.favourites ? user.favourites.join(', ') : 'No favorites'}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default UserViewPage