import { Avatar, Box, Button, Typography, Tooltip } from '@mui/material'
import { Link } from 'react-router-dom'
const UserListItem = ({ user }) => {
  return (
    <Box
      key={user.id}
      display="flex"
      alignItems="center"
      marginBottom={1}
      padding={2}
      borderRadius={8}
      boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
      bgcolor="white"
      transition="background-color 0.3s ease, transform 0.3s ease"
      sx={{
        '&:hover': {
          backgroundColor: '#f5f5f5',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Tooltip title={`${user?.name} (${user?.followers?.length} followers)`} arrow>
        <Avatar src={user?.avatar} sx={{ width: 40, height: 40, marginRight: 2 }} />
      </Tooltip>
      <Box>
        <Link to={`/users/${user?.id}`} style={{ textDecoration: 'none' }}>
          <Typography variant="subtitle2" marginRight={1} fontWeight="bold">
            {user?.username}
          </Typography>
        </Link>
        <Typography variant="body2" marginRight={1} color="text.secondary">
          {user?.name}
        </Typography>
      </Box>
      <Box flexGrow={1} />
      <Button
        variant="contained"
        color={user.isFollowing ? 'secondary' : 'primary'}
        size="small"
        disableElevation
        disableRipple
        sx={{
          '&:hover': {
            backgroundColor: user.isFollowing ? '#E57373' : '#64B5F6',
          },
        }}
      >
        {user.isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
    </Box>
  )
}

export default UserListItem