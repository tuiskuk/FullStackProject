import { Typography, Grid, Avatar, Paper, Button, CircularProgress } from '@mui/material'
import { useGetUserQuery } from '../services/userSlice'
import { useParams } from 'react-router-dom'
import { useFollowMutation, useUnfollowMutation } from '../services/followSlice'
import { selectCurrentUser } from '../services/loginSlice'
import { useSelector } from 'react-redux'

const UserViewPage = () => {

  const { id } = useParams()
  const currentUser = useSelector(selectCurrentUser)
  const currentUserId = currentUser?.id
  const { data: userCurrent, refetch: refetchCurrent } = useGetUserQuery(currentUserId)
  const { data: user, isLoading, refetch } = useGetUserQuery(id)
  const targetUserId = user?.id
  const [ follow ] = useFollowMutation({ onSettled: () => {
    refetch() // Manually refetch the data after mutation is complete
  } })
  const [ unfollow ] = useUnfollowMutation({ onSettled: () => {
    refetch() // Manually refetch the data after mutation is complete
  } })
  const isFollowing = Boolean(userCurrent?.following.includes(targetUserId))
  console.log(userCurrent)
  console.log(isFollowing)
  console.log(id, user)


  const nameParts = user?.name?.split(' ')
  const firstName = nameParts && nameParts[0]
  const lastName = nameParts && nameParts[1]

  const handleUnfollow = async() => {
    // Check if user data is available before unfollowing
    if (user && isFollowing) {
      await unfollow({ currentUserId, targetUserId }).unwrap()
      refetch()
      refetchCurrent()
    }
  }

  const handleFollow = async() => {
    // Check if user data is available before following
    if (user && !isFollowing) {
      await follow({ currentUserId, targetUserId }).unwrap()
      refetch()
      refetchCurrent()
    }
  }

  if (isLoading) {
    // Show loading spinner while data is being fetched
    return <CircularProgress />
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">{user?.name} Profile Page</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ padding: '20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Avatar
                src={user?.profileImage || `https://eu.ui-avatars.com/api/?name=${firstName}+${lastName}&size=200`}
                alt={user?.name}
                sx={{ width: '200px', height: '200px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Username: {user?.username}</Typography>
              <Typography variant="body1">Who am I: {user?.profileText || 'No profile text available'}</Typography>
              <Typography variant="body1">Favorite recipes: {user?.favorites ? user?.favorites.join(', ') : 'No favorites'}</Typography>
              {isFollowing ? (
                <Button variant="contained" color="primary" onClick={handleUnfollow}>
                  Unfollow
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleFollow}>
                  Follow
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default UserViewPage