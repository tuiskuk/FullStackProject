import { useEffect, useState } from 'react'
import {
  TextField,
  Button,
  Grid,
  Container,
  Avatar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Popover
} from '@mui/material'



import { selectCurrentUser } from '../services/loginSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useUpdateUserMutation } from '../services/userSlice'
import { setUser } from '../services/loginSlice'
import { useGetAllFavoritesQuery } from '../services/favoriteSlice'
import { useGetAllFollowingQuery, useGetAllFollowersQuery } from '../services/followSlice'

import RecipeCard from './RecipeCard'
import UserListItem from './userListItem'



const UserProfile = () => {
  const [profileDescription, setProfileDescription] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [followingListVisible, setFollowingListVisible] = useState(false)
  const [anchorElFollowers, setAnchorElFollowers] = useState(null)
  const [followersListVisible, setFollowersListVisible] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [editProfileVisible, setEditProfileVisible] = useState(false)
  const selectedOption = 'favorites'
  const postCount = 0
  const user = useSelector(selectCurrentUser)
  const [ updateUser ] = useUpdateUserMutation()
  console.log(user?.id)
  const userId = user?.id
  const { data: favoritesData } = useGetAllFavoritesQuery({ userId })
  const { data: followingData, refetch: refetchFollowing } = useGetAllFollowingQuery({ userId })
  const { data: followersData, refetch: refetchFollowers } = useGetAllFollowersQuery({ userId })
  console.log(followersData)
  const followers = followersData?.followers
  const following = followingData?.following
  console.log(followers)
  console.log(following?.following)
  console.log(favoritesData)
  console.log(following)
  const dispatch = useDispatch()
  const followingCount = following?.length
  const followersCount = followers?.length
  console.log(user)

  //const [recipeId, setRecipeId] = useState('')

  //const { data: recipe } = useGetRecipeQuery(recipeId)
  //setRecipeId('')

  useEffect(() => {
    setProfileDescription(user?.profileText)
    setNewUsername(user?.username)
    refetchFollowing()
    refetchFollowers()
  }, [user])

  const handleUpdateProfile = () => {
    if(!user) return
    console.log(user?.id)
    // Handle updating profile logic
    const updatedUser = {
      ...user,
      profileText: profileDescription,
      password: newPassword,
      username: newUsername,
    }
    console.log(updatedUser)
    updateUser({ id: user?.id, user: updatedUser }).unwrap()
    dispatch(setUser({ user: updatedUser }))
    console.log(user)
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
            src={user?.profileImage}
            sx={{ width: 150, height: 150, marginBottom: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">{user?.username}</Typography>
          <Button variant="outlined" size="small" onClick={() => setEditProfileVisible(!editProfileVisible)}>
              Edit Profile
          </Button>
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
              {followers ? (
                followers.map((user) => <UserListItem key={user.id} user={user} />)
              ) : (
                <Typography>Loading...</Typography>
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
              {following ? (
                following.map((user) => <UserListItem key={user.id} user={user} />)
              ) : (
                <Typography>Loading...</Typography>
              )}
            </Box>
          </Popover>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{user?.name}</Typography>
        </Grid>
        <Dialog open={editProfileVisible} onClose={() => setEditProfileVisible(false)}>
          <DialogTitle>Edit your sweet profile</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} marginTop={1}>
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
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditProfileVisible(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
              Update Profile
            </Button>
          </DialogActions>
        </Dialog>

        <Grid container spacing={1} marginTop={1} justifyContent="center">
          <Grid item>
            <Button
              variant={selectedOption === 'favorites' ? 'contained' : 'outlined'}
              sx={{ textTransform: 'none' }}
            >
              Favorites
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant={selectedOption === 'myRecipes' ? 'contained' : 'outlined'}
              sx={{ textTransform: 'none' }}
            >
              My Recipes
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant={selectedOption === 'comments' ? 'contained' : 'outlined'}
              sx={{ textTransform: 'none' }}
            >
              Comments
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3} marginTop={0.2}>
          {favoritesData?.favorites?.map((favorite, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <RecipeCard key={favorite.recipeId} recipe={favorite} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Container>
  )

}

export default UserProfile