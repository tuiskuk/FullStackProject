import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { useRefreshMutation, useSendLogoutMutation } from '../services/loginApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentAccessToken, setUser } from '../services/loginSlice'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import WarningDialog from './WarningDialog'

const ExpirationWarningDialog = ({ loggedOut, open, onClose }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const accessToken = useSelector(selectCurrentAccessToken)
  const [logout] = useSendLogoutMutation()
  const [refresh] = useRefreshMutation()
  const [showWarningDialog, setShowWarningDialog] = useState(false)

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

  const logIn = () => {
    setShowWarningDialog(true)
    onClose()
  }

  const handleLogOut = () => {
    navigate('/')
    logout()
    onClose()
  }

  const handleClose = () => {
    navigate('/')
    onClose()
  }

  const handleLogInClose = () => {
    setShowWarningDialog(false)
    onClose()
  }

  return (
    <>
      {!loggedOut ? (
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
      ) : (
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>Logged out</DialogTitle>
          <DialogContent>
            <p>Session expired, please log in again</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={logIn} color="primary">
              Log In
            </Button>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <WarningDialog user={true} open={showWarningDialog} onClose={handleLogInClose} />
    </>
  )
}

export default ExpirationWarningDialog