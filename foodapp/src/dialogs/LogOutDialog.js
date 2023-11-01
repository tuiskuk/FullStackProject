import { Dialog, Button, DialogTitle, DialogActions } from '@mui/material'
import { useSendLogoutMutation } from '../services/loginApiSlice'

const LogOutDialog = ({ open, onClose }) => {
  const [logout] = useSendLogoutMutation()

  const handleStayLoggedIn = async () => {

    onClose()
  }

  const handleLogOut = () => {


    logout()
    onClose()
  }


  return(
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <p>Are you sure you want to log out?</p>
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleStayLoggedIn} color="primary">
          Cancel
        </Button>
        <Button onClick={handleLogOut} color="primary">
          Log Out
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LogOutDialog