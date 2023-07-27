import { Typography, Grid, Avatar, Button, CircularProgress, Container, Popover, Box } from '@mui/material'
import { useGetUserQuery } from '../services/userApiSlice'
import { useParams } from 'react-router-dom'
import { useFollowMutation, useUnfollowMutation, useGetAllFollowingQuery, useGetAllFollowersQuery } from '../services/followSlice'
import { selectCurrentUser, setUser } from '../services/loginSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import RecipeCard from './RecipeCard'
import UserListItem from './userListItem'


const UserViewPage = () => {

  const { id } = useParams()
  const [selectedOption, setSelectedOption] = useState('favorites')
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const currentUserId = currentUser?.id
  const { data: userCurrent, refetch: refetchCurrent } = useGetUserQuery(currentUserId)
  const { data: targetUser, isLoading, refetch } = useGetUserQuery(id)
  const targetUserId = id
  const currentUserIsTarget = currentUserId === targetUserId ? true : false
  const [ follow, { isLoading: isFollowMutateLoading } ] = useFollowMutation()
  const [ unfollow, { isLoading: isUnfollowMutateLoading } ] = useUnfollowMutation()
  const { data: followersData } = useGetAllFollowersQuery({ userId: targetUserId })
  const { data: followingData } = useGetAllFollowingQuery({ userId: targetUserId })
  const isFollowing = Boolean(userCurrent?.following.includes(targetUserId))
  const [anchorEl, setAnchorEl] = useState(null)
  const [followingListVisible, setFollowingListVisible] = useState(false)
  const [anchorElFollowers, setAnchorElFollowers] = useState(null)
  const [followersListVisible, setFollowersListVisible] = useState(false)
  const postCount = 0
  const followers = followersData?.followers
  const following = followingData?.following
  const favorites = targetUser?.favorites
  console.log(favorites)
  const followingCount = following?.length
  const followersCount = followers?.length


  const handleUnfollow = async() => {
    // Check if user data is available before unfollowing
    if (targetUser && isFollowing && !isUnfollowMutateLoading) {
      await unfollow({ currentUserId, targetUserId }).unwrap()
      refetch() // Manually refetch the data after mutation is complete
      const updatedUser = await refetchCurrent().unwrap() // Get the updated user data
      dispatch(setUser({ user: updatedUser }))
      console.log(updatedUser)
    }
  }

  const handleFollow = async() => {
    // Check if user data is available before following
    if (targetUser && !isFollowing && !isFollowMutateLoading) {
      await follow({ currentUserId, targetUserId }).unwrap()
      refetch() // Manually refetch the data after mutation is complete
      const updatedUser = await refetchCurrent().unwrap() // Get the updated user data
      dispatch(setUser({ user: updatedUser }))
    }
  }

  if (isLoading) {
    // Show loading spinner while data is being fetched
    return <CircularProgress />
  }

  const handleClickFollowing = (event) => {
    setAnchorEl(event.currentTarget)
    setFollowingListVisible(true)
  }

  // Function to handle close event of following/followers overlay


  const handleClickFollowers = (event) => {
    setAnchorElFollowers(event.currentTarget)
    setFollowersListVisible(true)
  }


  // Function to handle close event of following/followers overlay

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Avatar
            alt="Profile Image"
            src={ targetUser?.profileImage}
            sx={{ width: 150, height: 150, marginBottom: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">{targetUser?.username}</Typography>
          {userCurrent && !currentUserIsTarget &&
            <Button
              variant={isFollowing ? 'outlined' : 'contained'}
              onClick={isFollowing ? handleUnfollow : handleFollow}
            >
              {isFollowing ? 'Unfollow' :  'Follow'}
            </Button>
          }

        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">{postCount}</Typography>
          <Typography variant="h6">Recipes posted</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">{followersCount}</Typography>
          <Typography variant="h6" onClick={handleClickFollowers} sx={{ cursor: 'pointer', textDecoration: 'none' }}>
            Followers
          </Typography>
          <Popover
            open={followersListVisible}
            anchorEl={anchorElFollowers}
            onClose={() => {setAnchorElFollowers(null); setFollowersListVisible(false)}}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            disablePortal
          >
            <Box p={2} minWidth={200}>
              {followers?.length > 0 ? (
                followers.map((user) => <UserListItem key={user.id} user={user} />)
              ) : (
                <Typography>No followers.</Typography>
              )}
            </Box>
          </Popover>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">{followingCount}</Typography>
          <Typography variant="h6" onClick={handleClickFollowing} sx={{ cursor: 'pointer', textDecoration: 'none' }}>
            Following
          </Typography>
          <Popover
            open={followingListVisible}
            anchorEl={anchorEl}
            onClose={() => {
              setAnchorEl(null)
              setFollowingListVisible(false)
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            disablePortal
          >
            <Box p={2} minWidth={200}>
              {following?.length > 0 ? (
                following.map((user) => <UserListItem key={user.id} user={user} />)
              ) : (
                <Typography>Not following anyone.</Typography>
              )}
            </Box>
          </Popover>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{targetUser?.name}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={1} marginTop={1} justifyContent="center">
        <Grid item>
          <Button
            variant={selectedOption === 'favorites' ? 'contained' : 'outlined'}
            onClick={() => setSelectedOption('favorites')}
          >
            Favorites
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={selectedOption === 'myRecipes' ? 'contained' : 'outlined'}
            onClick={() => setSelectedOption('myRecipes')}
          >
            {currentUserIsTarget ? 'My Recipes' : 'Their recipes'}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={selectedOption === 'comments' ? 'contained' : 'outlined'}
            onClick={() => setSelectedOption('comments')}
          >
            Comments
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={selectedOption === 'likes' ? 'contained' : 'outlined'}
            onClick={() => setSelectedOption('likes')}
          >
            Likes
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={selectedOption === 'dislikes' ? 'contained' : 'outlined'}
            onClick={() => setSelectedOption('dislikes')}
          >
            Dislikes
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3} marginTop={0.2}>
        {favorites?.map((favorite, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <RecipeCard key={favorite.recipeId} recipe={favorite} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default UserViewPage