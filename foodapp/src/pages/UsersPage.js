import { useGetUsersQuery } from '../services/userApiSlice'
import UserCard from '../components/UserCard'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../services/loginSlice'
import { Container, Typography, Grid } from '@mui/material'


const UsersPage = () => {
  const { data: users, isLoading, isError, error } = useGetUsersQuery()
  const currentUser = useSelector(selectCurrentUser)
  console.log(currentUser)
  console.log(users)

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>Error: {error.message}</p>
  }

  const userList = Object.values(users.entities)
  console.log(userList)

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        All Users
      </Typography>
      <Grid container spacing={3}>
        {userList.length !== 0 ? (
          userList?.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <UserCard user={user} currentUser={currentUser}/>
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