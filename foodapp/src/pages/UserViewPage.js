import { Typography, Grid, Avatar, Button, CircularProgress, Container, Popover, Box, Card, CardContent } from '@mui/material'
import { useGetUserQuery } from '../services/userApiSlice'
import { useParams } from 'react-router-dom'
import { useFollowMutation, useUnfollowMutation, useGetAllFollowingQuery, useGetAllFollowersQuery } from '../services/followSlice'
import { selectCurrentUser, setUser } from '../services/loginSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import RecipeCard from '../components/RecipeCard'
import UserListItem from '../components/userListItem'
import WarningDialog from '../dialogs/WarningDialog'
import formatFinnishDate from '../helpers/formatFinnishDate'
import { Link } from 'react-router-dom'
import { useGetAllSpecificUserCreatedRecipesQuery } from '../services/interactionSlice'

const UserViewPage = () => {
  const { id } = useParams()
  const [selectedOption, setSelectedOption] = useState('favorites')
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const currentUserId = currentUser?.id
  const { data: userCurrent, refetch: refetchCurrent } = useGetUserQuery(
    currentUserId , { skip: !currentUserId, refetchOnMountOrArgChange: true })
  const { data: targetUser, isLoading, refetch } = useGetUserQuery(id)
  console.log(targetUser)
  const targetUserId = id
  const currentUserIsTarget = currentUserId === targetUserId ? true : false
  const [ follow, { isLoading: isFollowMutateLoading } ] = useFollowMutation()
  const [ unfollow, { isLoading: isUnfollowMutateLoading } ] = useUnfollowMutation()
  const { data: followersData } = useGetAllFollowersQuery({ userId: targetUserId })
  const { data: followingData } = useGetAllFollowingQuery({ userId: targetUserId })
  const { data: userCreatedRecipes } = useGetAllSpecificUserCreatedRecipesQuery({ userId: targetUserId })
  const isFollowing = Boolean(userCurrent?.following.includes(targetUserId))
  const [anchorEl, setAnchorEl] = useState(null)
  const [followingListVisible, setFollowingListVisible] = useState(false)
  const [anchorElFollowers, setAnchorElFollowers] = useState(null)
  const [followersListVisible, setFollowersListVisible] = useState(false)
  const postCount = userCreatedRecipes?.length
  const followers = followersData?.followers
  const following = followingData?.following
  const followingCount = following?.length
  const followersCount = followers?.length
  const [showWarningDialog, setShowWarningDialog] = useState(false)

  const handleUnfollow = async() => {
    if(!currentUser) {
      setShowWarningDialog(true)
      return
    }
    // Check if user data is available before unfollowing
    if (targetUser && isFollowing && !isUnfollowMutateLoading) {
      await unfollow({ currentUserId, targetUserId }).unwrap()
      refetch() // Manually refetch the data after mutation is complete
      const updatedUser = await refetchCurrent().unwrap() // Get the updated user data
      dispatch(setUser({ user: updatedUser }))
      console.log(updatedUser)
    }
  }

  console.log(targetUser?.comments)

  const handleFollow = async() => {
    if(!currentUser) {
      setShowWarningDialog(true)
      return
    }
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
          <Typography variant="h4" style={{ fontSize: '24px', margin: '0' }}>
            {targetUser?.name}
          </Typography>
          <Typography variant="body1" style={{ fontSize: '18px', color: 'gray', margin: '0' }}>
            @{targetUser?.username}
          </Typography>
          <Typography variant="body1" style={{ fontSize: '16px', margin: '10px 0' }}>
            {targetUser?.profileText}
          </Typography>
          {!currentUserIsTarget &&
            <Button
              variant={isFollowing ? 'outlined' : 'contained'}
              onClick={isFollowing ? handleUnfollow : handleFollow}
            >
              {isFollowing ? 'Unfollow' :  'Follow'}
            </Button>
          }

        </Grid>
        <WarningDialog open={showWarningDialog} onClose={() => setShowWarningDialog(false)} user={currentUser} />
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
        {selectedOption === 'favorites' &&
          targetUser?.favorites?.map((favorite, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <RecipeCard key={favorite.recipeId} recipe={favorite} />
            </Grid>
          ))}
      </Grid>
      <Grid container spacing={3} marginTop={0.2}>
        {selectedOption === 'myRecipes' &&
          userCreatedRecipes?.map((recipe, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <RecipeCard key={recipe.recipeId} recipe={recipe} />
            </Grid>
          ))}
      </Grid>
      <Grid container spacing={3} marginTop={0.2}>
        {selectedOption === 'likes' &&
          targetUser?.likes?.map((like, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <RecipeCard key={like.recipeId} recipe={like} />
            </Grid>
          ))}
      </Grid>
      <Grid container spacing={3} marginTop={0.2}>
        {selectedOption === 'dislikes' &&
          targetUser?.dislikes?.map((dislike, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <RecipeCard key={dislike.recipeId} recipe={dislike} />
            </Grid>
          ))}
      </Grid>
      <Grid container spacing={3} marginTop={0.2}>
        {selectedOption === 'comments' &&
        targetUser?.comments?.map((comment) => (
          <Grid item xs={12} key={comment._id}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item>
                    <Avatar
                      src={targetUser.profileImage || `https://eu.ui-avatars.com/api/?name=${targetUser.username}&size=200`}
                      alt={comment.user.name}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="body1" fontWeight="bold">
                      {targetUser.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatFinnishDate(comment.createdAt)}
                    </Typography>
                    <Typography variant="body1">
                      {comment.text}
                    </Typography>
                    <Link to={`/recipes/${comment.recipeId}`} style={{ textDecoration: 'none', color: 'gray' }}>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Check out this recipe
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

    </Container>
  )
}

export default UserViewPage