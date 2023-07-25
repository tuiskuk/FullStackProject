import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardActionArea, CardMedia, CardContent, Typography, Button, Box } from '@mui/material'
import { useFollowMutation, useUnfollowMutation } from '../services/followSlice'
import { useGetUserQuery } from '../services/userApiSlice'
import { styled } from '@mui/system'
import { useDispatch } from 'react-redux'
import { setUser } from '../services/loginSlice'
import WarningDialog from './WarningDialog'

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 300,
  margin: '0.5rem',
  borderRadius: 12, // Adding border-radius for a modern look
  boxShadow: theme?.shadows[4],
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}))

const StyledCardMedia = styled(CardMedia)({
  height: 120, // Adjust the height to display the image at the desired size
  width: 120, // Adjust the width to display the image at the desired size
  borderRadius: '50%', // Displaying the image in a circular shape
  objectFit: 'cover',
  display: 'flex',
  justifyContent: 'center', // Center horizontally
  alignItems: 'center', // Center vertically
})

const StyledCardContent = styled(CardContent)({
  height: 60,
})

const CenteredBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
})

const UserCard = ({ user, currentUser }) => {
  const handleUserClick = () => {
    try {
      // Save the user to sessionStorage
      sessionStorage.setItem('user', JSON.stringify(user))
    } catch (error) {
      console.log('Error saving user:', error)
    }
  }

  const dispatch = useDispatch()
  const targetUserId = user?.id
  const currentUserId = currentUser?.id
  const currentUserIsTarget = currentUserId === targetUserId ? true : false
  const { data: userCurrent, refetch: refetchCurrent } = useGetUserQuery(
    currentUserId , { skip: !currentUserId, refetchOnMountOrArgChange: true })
  const { data: targetUser, refetch } = useGetUserQuery(targetUserId)
  console.log(currentUser, targetUserId)
  console.log(userCurrent?.following)
  const isFollowing = Boolean(userCurrent?.following.includes(targetUserId))
  const [ follow, { isLoading: isFollowMutateLoading } ] = useFollowMutation()
  const [ unfollow, { isLoading: isUnfollowMutateLoading } ] = useUnfollowMutation()
  const [showWarningDialog, setShowWarningDialog] = useState(false)

  const handleUnfollow = async(event) => {
    event.preventDefault()
    // Check if user data is available before unfollowing
    if (targetUser && isFollowing && !isUnfollowMutateLoading) {
      await unfollow({ currentUserId, targetUserId }).unwrap()
      refetch() // Manually refetch the data after mutation is complete
      const updatedUser = await refetchCurrent().unwrap() // Get the updated user data
      dispatch(setUser({ user: updatedUser }))
      console.log(updatedUser)
    }
  }
  console.log(isFollowing)

  const handleFollow = async(event) => {
    event.preventDefault()
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
      console.log(updatedUser)
    }
  }
  return (
    <>
      <Link to={`/users/${user.id}`} style={{ textDecoration: 'none' }}>
        <StyledCard>
          <CardActionArea onClick={handleUserClick}>
            <CenteredBox>
              <StyledCardMedia
                component="img"
                src={user.profileImage || `https://eu.ui-avatars.com/api/?name=${user.username}&size=200`}
                alt={user.name}
              />
            </CenteredBox>
            <StyledCardContent>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="subtitle1">{user.username}</Typography>
              <Typography variant="subtitle1">followers: {user.followers.length}</Typography>
            </StyledCardContent>
          </CardActionArea>
          <Box display="flex" justifyContent="space-between" alignItems="center" padding="8px">
            {!currentUserIsTarget &&
              <Button
                variant={isFollowing ? 'outlined' : 'contained'}
                onClick={isFollowing ? handleUnfollow : handleFollow}
              >
                {isFollowing ? 'Unfollow' :  'Follow'}
              </Button>
            }

          </Box>
        </StyledCard>
      </Link>
      <WarningDialog open={showWarningDialog} onClose={() => setShowWarningDialog(false)} user={user} />
    </>
  )
}

export default UserCard