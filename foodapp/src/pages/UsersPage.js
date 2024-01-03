import React from 'react'
import { useGetUsersQuery } from '../services/userApiSlice'
import UserCard from '../components/UserCard'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../services/loginSlice'
import { Container, Typography, Grid, CircularProgress, } from '@mui/material'
import { alpha } from '@mui/system'


const UsersPage = () => {
  const { data: users, isLoading, isError, error } = useGetUsersQuery()
  const currentUser = useSelector(selectCurrentUser)


  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" >
          All Users
        </Typography>
        <CircularProgress />
      </Container>
    )
  }

  if (isError) {
    console.log(error)
    return (
      <Container maxWidth="lg" >
        <Typography variant="h4" >
          All Users
        </Typography>
        <h3>No users found</h3>
      </Container>
    )
  }

  const userList = Object.values(users.entities)

  return (
    <Container maxWidth="lg" >
      <Typography variant="h4" sx={{ marginTop: '12px' }}>
        Discover from all users
      </Typography>
      <Typography variant="body1" sx={{
        fontSize: '1.2rem',
        color: (theme) => alpha(theme.palette.text.primary, 0.85), // Adjust opacity as needed
        marginBottom: (theme) => theme.spacing(3),
        fontStyle: 'italic',
        letterSpacing: '0.02em',
      }}>
        Discover a vibrant community of users. Connect, follow, and explore the profiles of fellow users.
      </Typography>
      <Grid container spacing={3} marginTop={0.2}>
        {userList.length !== 0 ? (
          userList.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <UserCard user={user} currentUser={currentUser} />
            </Grid>
          ))
        ) : (
          <Typography variant="h5">No users found</Typography>
        )}
      </Grid>
    </Container>
  )
}

export default UsersPage