import LoginPage from './loginPage'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'


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

export default WarningDialog