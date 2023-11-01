import { Grid } from '@mui/material'
import UserCard from './UserCard'

const MostFollowedUsers = ({ users }) => {
  // Sorting users by followers count in descending order
  const mostFollowedUsers = users?.slice().sort((a, b) => b.followers.length - a.followers.length).slice(0, 6)

  return (
    <Grid container spacing={3}>
      {mostFollowedUsers?.map((user) => (
        <Grid item xs={12} sm={6} md={4} key={user.id}>
          <UserCard user={user} />
        </Grid>
      ))}
    </Grid>
  )
}

export default MostFollowedUsers