import LoginPage from '../pages/loginPage'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { useState, useEffect } from 'react'

const WarningDialog = ({ open, onClose, user }) => {
  const [closeDialog, setCloseDialog] = useState(false)

  useEffect(() => {
    if (closeDialog) {
      onClose()
      setCloseDialog(false)
    }
  }, [closeDialog])

  return (
    <Dialog open={open} onClose={onClose}>
      {!user && <DialogTitle sx={{ textAlign: 'center' }}>You need to log in before this action</DialogTitle>}
      <DialogContent>
        <LoginPage action={true} closeDialog={() => setCloseDialog(true)}/>
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