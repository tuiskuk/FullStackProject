import { useState, useEffect } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import RangeInputComponent from '../components/RangeInputComponent'

const NutrientDialog = ({ open, onClose, nutrient, nutrientInputs, handleNutrientInputChange, clear }) => {
  const [update, setUpdate] = useState(false)
  console.log(nutrient)

  useEffect(() => {
    if (update && open) {
      onClose()
      setUpdate(false) // Reset the update state after closing
    }
  }, [update, onClose, open])

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' >
      <DialogTitle style={{ textAlign: 'center', padding: 8, paddingBottom: 0 }}>Set Nutrient Details</DialogTitle>
      <DialogContent sx={{ m: 0.5, minWidth: 200, padding: 1 }}>
        <RangeInputComponent
          value={nutrientInputs[nutrient.backend] || ''}
          nameBackend={nutrient.backend}
          nameUser={nutrient.user}
          unit={nutrient.unit}
          onChange={handleNutrientInputChange}
          clear={clear}
          update={update}
        />
      </DialogContent>
      <DialogActions style={{ justifyContent: 'space-between', padding: '1rem', paddingTop: 0 }}>
        <Button
          variant="contained"
          style={{ backgroundColor: '#f44336' }}
          onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          style={{ backgroundColor: '#4caf50' }}
          onClick={() => setUpdate(true)}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NutrientDialog