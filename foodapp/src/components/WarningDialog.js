import LoginPage from '../pages/loginPage'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { useRefreshMutation, useSendLogoutMutation } from '../services/loginApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentAccessToken, setUser } from '../services/loginSlice'
import { useNavigate } from 'react-router-dom'


const WarningDialog = ({ open, onClose, user }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {!user && <DialogTitle sx={{ textAlign: 'center' }}>You need to log in before this action</DialogTitle>}
      <DialogContent>
        <LoginPage action={true}/>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const ExpirationWarningDialog = ({ open, onClose }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const accessToken = useSelector(selectCurrentAccessToken)
  const [logout] = useSendLogoutMutation()
  const [refresh] = useRefreshMutation()

  const handleStayLoggedIn = async () => {
    console.log('Stay logged in')

    try {
      const response = await refresh()
      console.log(response)
      const newAccessToken = response.data.accessToken

      // Save the new access token to the Redux store
      dispatch(setUser({ ...accessToken, accessToken: newAccessToken }))
      onClose()

    } catch (error) {
      console.error('Error refreshing token:', error)
    }
  }

  const handleLogOut = () => {
    console.log('Log out')
    navigate('/')
    logout()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Session Expiration Warning</DialogTitle>
      <DialogContent>
        <p>Your session is about to expire. Please choose an option:</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleStayLoggedIn} color="primary">
          Stay Logged In
        </Button>
        <Button onClick={handleLogOut} color="primary">
          Log Out
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export { WarningDialog, ExpirationWarningDialog }