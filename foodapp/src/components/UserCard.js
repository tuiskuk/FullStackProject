import { Link } from 'react-router-dom'
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material'
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
  height: 20,
})

const UserCard = ({ user }) => {

  const handleUserClick = () => {
    try {
    // Save the user to sessionStorage
      sessionStorage.setItem('user', JSON.stringify(user))
    } catch (error) {
      console.log('Error saving user:', error)
    }}

  const nameParts = user.name.split(' ')
  const firstName = nameParts[0]
  const lastName = nameParts[1]

  return (
    <Link to={`/users/${user.id}`} onClick={handleUserClick}>
      <StyledCard>
        <CardActionArea>
          <StyledCardMedia component="img" src={user.profileImage || `https://eu.ui-avatars.com/api/?name=${firstName}+${lastName}&size=200`} alt={user.name} />
          <StyledCardContent>
            <Typography variant="h6">{user.name}</Typography>
          </StyledCardContent>
        </CardActionArea>
      </StyledCard>

    </Link>
  )
}

export default UserCard