import { Link } from 'react-router-dom'
import { Card, CardActionArea, CardMedia, CardContent, Typography, Button, Box } from '@mui/material'
import { styled } from '@mui/system'

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 300,
  margin: '0.5rem',
  boxShadow: theme?.shadows[4],
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}))

const StyledCardMedia = styled(CardMedia)({
  height: 120,
})

const StyledCardContent = styled(CardContent)({
  height: 60,
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

  return (
    <Link to={`/users/${user.id}`} style={{ textDecoration: 'none' }}>
      <StyledCard>
        <CardActionArea onClick={handleUserClick}>
          <StyledCardMedia component="img" src={user.profileImage || `https://eu.ui-avatars.com/api/?name=${user.username}&size=200`} alt={user.name} />
          <StyledCardContent>
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="subtitle1">{user.username}</Typography>
            <Typography variant="subtitle1">followers: {user.followers.length}</Typography>
          </StyledCardContent>
        </CardActionArea>
        <Box display="flex" justifyContent="space-between" alignItems="center" padding="8px">
          <Button variant="outlined" size="small" sx={{ fontSize: '0.7rem' }}>
            {user.isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        </Box>
      </StyledCard>
    </Link>
  )
}

export default UserCard