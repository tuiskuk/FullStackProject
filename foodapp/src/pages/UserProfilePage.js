import { useEffect, useState, useRef } from 'react'
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
  Popover,
  Card,
  CardContent
} from '@mui/material'
import { selectCurrentUser } from '../services/loginSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useGetUserQuery, useUpdateUserMutation } from '../services/userApiSlice'
import { useUploadProfilePictureMutation } from '../services/pictureHandlerApiSlice'
import { setUser } from '../services/loginSlice'

import { useGetAllFollowingQuery, useGetAllFollowersQuery } from '../services/followSlice'
import { Link, useNavigate } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import UserListItem from '../components/userListItem'
import formatFinnishDate from '../helpers/formatFinnishDate'
import { useGetAllSpecificUserCreatedRecipesQuery } from '../services/interactionSlice'




const UserProfile = () => {
  const [profileDescription, setProfileDescription] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()
  const [followingListVisible, setFollowingListVisible] = useState(false)
  const [anchorElFollowers, setAnchorElFollowers] = useState(null)
  const [followersListVisible, setFollowersListVisible] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newProfilPicture, setNewProfilPicture] = useState(null)
  const [editProfileVisible, setEditProfileVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState('favorites')
  const user = useSelector(selectCurrentUser)
  const [ updateUser ] = useUpdateUserMutation()
  const [uploadProfilePicture] = useUploadProfilePictureMutation()


  const fileInputRef = useRef(null)
  const userId = user?.id
  useEffect(() => {
    if(!user) navigate('/login')
  }, [user])

  const { data: followingData, refetch: refetchFollowing } = useGetAllFollowingQuery(
    { userId }, { skip: !userId, refetchOnMountOrArgChange: true })
  const { data: followersData, refetch: refetchFollowers } = useGetAllFollowersQuery(
    { userId }, { skip: !userId, refetchOnMountOrArgChange: true })

  const followers = followersData?.followers
  const following = followingData?.following
  const { data: userData } = useGetUserQuery(
    userId, { skip: !userId, refetchOnMountOrArgChange: true })
  console.log(userData)
  const { data: userCreatedRecipes } = useGetAllSpecificUserCreatedRecipesQuery({
    userId, // Pass the actual value here
  })
  const postCount = userCreatedRecipes?.length
  //TODO: dislikesData, LikesData, favoritesData, commentsData
  console.log(userCreatedRecipes)
  const dispatch = useDispatch()
  const followingCount = following?.length
  const followersCount = followers?.length

  //const [recipeId, setRecipeId] = useState('')

  //const { data: recipe } = useGetRecipeQuery(recipeId)
  //setRecipeId('')

  useEffect(() => {
    setProfileDescription(user?.profileText)
    setNewUsername(user?.username)
    if(user) {
      refetchFollowing()
      refetchFollowers()
    }
  }, [user])

  const handleUpdateProfile = async () => {
    if(!user) return

    let updatedProfilePicture = null
    let updatedUser = null
    if(newProfilPicture !== null) {
      const response = await uploadProfilePicture({ file: newProfilPicture, id: user?.id })
      updatedProfilePicture = response.data.profileImage
      updatedUser = {
        ...user,
        profileImage: updatedProfilePicture,
        profileText: profileDescription,
        password: newPassword,
        username: newUsername,
      }
    } else {
      updatedUser = {
        ...user,
        profileText: profileDescription,
        password: newPassword,
        username: newUsername,
      }
    }


    await updateUser({ id: user?.id, user: updatedUser }).unwrap()
    dispatch(setUser({ user: updatedUser }))
    setNewProfilPicture(null)
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

  const handleAvatarClick = () => {
    // You can use a file input element that is hidden
    // and programmatically trigger a click on it.
    fileInputRef.current.click()
  }

  const handleProfilePictureChange = async(event) => {
    const file = event.target.files[0]
    setNewProfilPicture(file)
    if (file) {
      try {
        // Upload the profile picture and get the response
        const response = await uploadProfilePicture({ file: file, id: user?.id })
        const updatedProfilePicture = response.data.profileImage

        // Update the user with the new profile picture
        const updatedUser = {
          ...user,
          profileImage: updatedProfilePicture,
        }

        // Call the API to update the user's profile information
        await updateUser({ id: user?.id, user: updatedUser }).unwrap()

        // Update the user in the application state
        dispatch(setUser({ user: updatedUser }))
      } catch (error) {
        // Handle any errors that occurred during the upload/update process
        console.error('Error uploading profile picture:', error)
      }
    }
  }

  // Function to handle close event of following/followers overlay

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Avatar
            alt="Profile Image"
            src={user?.profileImage}
            sx={{ width: 150, height: 150, marginBottom: 2, cursor: 'pointer' }}
            onClick={handleAvatarClick}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleProfilePictureChange}
          />
        </Grid>
        <Grid item xs={12}>

          <Typography variant="h4" style={{ fontSize: '24px', margin: '0' }}>{user?.name}</Typography>

          <Typography variant="body1" style={{ fontSize: '18px', color: 'gray', margin: '0' }}>@{user?.username}</Typography>
          <Typography variant="body1" style={{ fontSize: '16px', margin: '10px 0' }}>
            {user?.profileText}
          </Typography>
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
            My Recipes
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
          userData?.favorites?.map((favorite, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <RecipeCard key={favorite.recipeId} recipe={favorite}/>
            </Grid>
          ))}
      </Grid>
      <Grid container spacing={3} marginTop={0.2}>
        {selectedOption === 'myRecipes' &&
          userCreatedRecipes?.map((recipe, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <RecipeCard key={recipe.recipeId} recipe={recipe} deleteRecipe={true} edit={true}/>
            </Grid>
          ))}
      </Grid>
      <Grid container spacing={3} marginTop={0.2}>
        {selectedOption === 'dislikes' &&
          userData?.dislikes?.map((dislike, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <RecipeCard key={dislike.recipeId} recipe={dislike}/>
            </Grid>
          ))}
      </Grid>
      <Grid container spacing={3} marginTop={0.2}>
        {selectedOption === 'likes' &&
          userData?.likes?.map((like, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <RecipeCard key={like.recipeId} recipe={like} />
            </Grid>
          ))}
      </Grid>
      <Grid container spacing={3} marginTop={0.2}>
        {selectedOption === 'comments' &&
        userData?.comments?.map((comment) => (
          <Grid item xs={12} key={comment._id}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item>
                    <Avatar
                      src={user.profileImage || `https://eu.ui-avatars.com/api/?name=${user.username}&size=200`}
                      alt={user.name}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="body1" fontWeight="bold">
                      {user.name}
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

export default UserProfile