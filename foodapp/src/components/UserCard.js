import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardMedia, CardContent, Typography, Button, Box, Grid } from '@mui/material'
import { useFollowMutation, useUnfollowMutation } from '../services/followSlice'
import { useGetUserQuery } from '../services/userApiSlice'
import { styled } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, setUser } from '../services/loginSlice'
import WarningDialog from '../dialogs/WarningDialog'
import GroupIcon from '@mui/icons-material/Group'

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 300,
  margin: '0.5rem',
  borderRadius: 12,
  boxShadow: theme?.shadows[4],
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}))

const StyledCardMedia = styled(CardMedia)({
  height: 120,
  width: 120,
  borderRadius: '50%',
  objectFit: 'cover',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const StyledCardContent = styled(CardContent)({
  padding: '1rem',
  textAlign: 'center',

})

const CenteredBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',

})

const UserCard = ({ user }) => {
  const handleUserClick = () => {
    try {
      // Save the user to sessionStorage
      sessionStorage.setItem('user', JSON.stringify(user))
    } catch (error) {
      console.log('Error saving user:', error)
    }
  }
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const targetUserId = user?.id
  const currentUserId = currentUser?.id
  const currentUserIsTarget = currentUserId === targetUserId ? true : false
  const { data: targetUser, refetch: refetchTarget, isSuccess: targetUserSuccess } = useGetUserQuery(targetUserId)
  const isFollowing = Boolean(currentUser?.following.includes(targetUserId))
  console.log(isFollowing)
  const [follow, { isLoading: isFollowMutateLoading, isFetching: isFollowMutateFetching }] = useFollowMutation({
    onSuccess: (response) => {
      dispatch(setUser({ user: response }))
      if (targetUserSuccess) {
        refetchTarget()
      }
    },
  })

  const [unfollow, { isLoading: isUnfollowMutateLoading, isFetching: isUnfollowMutateFetching }] = useUnfollowMutation({
    onSuccess: (response) => {
      dispatch(setUser({ user: response }))
      if (targetUserSuccess) {
        refetchTarget()
      }
    },
  })
  const [showWarningDialog, setShowWarningDialog] = useState(false)

  const handleUnfollow = async (event) => {
    event.preventDefault()
    // Check if user data is available before unfollowing
    if (targetUser && isFollowing && !isUnfollowMutateLoading && !isUnfollowMutateFetching) {
      const res = await unfollow({ currentUserId, targetUserId }).unwrap()
      dispatch(setUser({ user: res }))
      console.log(currentUser)
    }
  }
  console.log(isFollowing)

  const handleFollow = async (event) => {
    event.preventDefault()
    if (!currentUser) {
      setShowWarningDialog(true)
      return
    }
    // Check if user data is available before following
    if (targetUser && !isFollowing && !isFollowMutateLoading && !isFollowMutateFetching) {
      const res = await follow({ currentUserId, targetUserId }).unwrap()
      dispatch(setUser({ user: res }))
      console.log(currentUser)

    }

  }
  return (
    <>
      <Link to={`/users/${user.id}`} style={{ textDecoration: 'none' }} >
        <StyledCard onClick={handleUserClick}>

          <CenteredBox>
            <StyledCardMedia
              component="img"
              src={user.profileImage || `https://eu.ui-avatars.com/api/?name=${user.username}&size=200`}
              alt={user.name}
            />
          </CenteredBox>
          <StyledCardContent>
            <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name}
            </Typography>
            <Typography variant="subtitle1" style={{ color: 'gray' }}>
              @{user.username}
            </Typography>
            <Grid container alignItems="center" justifyContent="center" style={{ marginTop: '8px' }}>
              <GroupIcon fontSize="small" style={{ marginRight: '4px', color: 'gray' }} />
              <Typography variant="body2" color="textSecondary">
                {user.followers.length} {user.followers.length === 1 ? 'Follower' : 'Followers'}
              </Typography>
            </Grid>
          </StyledCardContent>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding="8px"
          >
            {!currentUserIsTarget && (
              <Button
                variant={isFollowing ? 'outlined' : 'contained'}
                onClick={isFollowing ? handleUnfollow : handleFollow}
                fullWidth
                style={{ borderRadius: '999px', fontWeight: 'bold' }}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </Box>
        </StyledCard>
      </Link>
      <WarningDialog
        open={showWarningDialog}
        onClose={() => setShowWarningDialog(false)}
        user={user}
      />
    </>
  )
}

export default UserCard