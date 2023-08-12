import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Button,
} from '@mui/material'

const OptionsDialog = ({
  open,
  setOpenDialog,
  title,
  options,
  selectedOptions,
  setSelectedMealTypes,
  setSelectedDishTypes,
  setSelectedCuisineTypes,
  setSelectedHealthFilters

}) => {

  const [checkedOptions, setCheckedOptions] = useState(selectedOptions)

  //everytime dialog is opened make checkedOptions up to date
  useEffect(() => {
    setCheckedOptions(selectedOptions)
  }, [open])


  const handleCheckboxChange = (value) => {
    console.log('entered')
    if (checkedOptions?.includes(value)) {
      const updatedOptions = checkedOptions?.filter((item) => item !== value)
      setCheckedOptions(updatedOptions)
    } else {
      const updatedOptions = [...checkedOptions, value]
      setCheckedOptions(updatedOptions)
    }
  }


  const onClose = () => {
    setOpenDialog(false)
    setCheckedOptions([])
  }

  const onSaveClose = () => {
    if (title === 'Select Meal Types') {
      setSelectedMealTypes(checkedOptions)
    } else if (title === 'Select Dish Types') {
      setSelectedDishTypes(checkedOptions)
    } else if (title === 'Select Cuisine Types') {
      setSelectedCuisineTypes(checkedOptions)
    } else if (title === 'Select Diet/Allergic Options') {
      setSelectedHealthFilters(checkedOptions)
    }

    setOpenDialog(false)
    setCheckedOptions([])
  }

  return (
    <Dialog open={open} PaperProps={{ style: { backgroundColor: '#F7F750'  } }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={checkedOptions.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
            }
            label={option}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSaveClose} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OptionsDialog
