import { useState, useEffect } from 'react'
import { FormControl, OutlinedInput, Box, Typography, IconButton } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'

const RangeInputComponent = ({ value, nameBackend, nameUser, unit, onChange, clear, update, updateUi, deleted }) => {
  const [minValue, setMinValue] = useState('')
  const [maxValue, setMaxValue] = useState('')
  const [edited, setEdited] = useState(false)

  useEffect(() => {
    if(value){
      analyze()
    }
  }, [])

  useEffect(() => {
    if (updateUi && value) {
      analyze()
    }
  }, [value])

  useEffect(() => {
    if (update) {
      handleParse()
    }
  }, [minValue, maxValue, update])

  useEffect(() => {
    console.log(minValue, maxValue)
    if(updateUi && edited) {
      handleParse()
    }
  }, [minValue, maxValue])

  useEffect(() => {
    if(updateUi) {
      setEdited(true)
    }
  }, [minValue, maxValue])

  useEffect(() => {
    analyze()
  }, [clear])

  const handleMinValueChange = (event) => {
    const valueMin = event.target.value
    const newValue = parseInt(valueMin)
    if (valueMin === '0'){
      setMinValue('')
    } else {
      if (newValue <= maxValue || !maxValue) {
        setMinValue(valueMin)
      } else {
        if (newValue >= minValue) {
          setMaxValue(valueMin)
          setMinValue(valueMin)
        } else {
          setMinValue('')
        }
      }
    }
  }

  const handleMaxValueChange = (event) => {
    const valueMax = event.target.value
    const newValue = parseInt(valueMax)

    if (valueMax === '0'){
      setMaxValue('')
    } else {
      if (newValue >= minValue || !minValue) {
        setMaxValue(valueMax)
      } else {
        if (newValue < maxValue) {
          setMaxValue('')
        } else {
          setMaxValue(minValue)
        }
      }
    }
  }

  const analyze = () => {
    if (value.includes('-')) {
      setMinValue(value.split('-')[0])
      setMaxValue(value.split('-')[1])
    } else if (value.includes('+')) {
      setMinValue(value.split('+')[0])
      setMaxValue('')
    } else if (value) {
      setMinValue('')
      setMaxValue(value)
    } else {
      setMinValue('')
      setMaxValue('')
    }
  }

  const handleParse = () => {
    let string = ''
    if (minValue && maxValue) {
      string = `${minValue}-${maxValue}`
    } else if (minValue && !maxValue) {
      string = `${minValue}+`
    } else if (!minValue && maxValue) {
      string = `${maxValue}`
    } else {
      string = ''
    }

    if (nameBackend) {
      onChange(nameBackend, string)
    } else {
      onChange(string)
    }
  }

  return (
    <Box border={1}
      borderColor="grey.400"
      borderRadius="4px"
      paddingX={1}
      paddingBottom={1}
      paddingTop={deleted ? 0 : 1}
      alignItems="center"
      bgcolor="white"
      boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)">
      <Box
        display="flex"
        alignItems="center"
        p={0.5}
        borderRadius="4px"
        mb={0.5}
        justifyContent="space-between"
      >
        <Typography variant="body1">{nameUser}</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {deleted && (
            <IconButton
              onClick={() => onChange(nameBackend, '')}
              size="small"
            >
              <CancelIcon />
            </IconButton>)}
          <Typography variant="body1">{unit}</Typography>
        </div>
      </Box>
      <Box display="flex" alignItems="center">
        <FormControl variant="outlined" >
          <OutlinedInput
            placeholder="MIN"
            type="number"
            inputProps={{ min: '0' }}
            value={minValue}
            onChange={handleMinValueChange}
            size="small"
          />
        </FormControl>
        <Typography variant="body1" sx={{ mx: 1 }}>-</Typography>
        <FormControl variant="outlined">
          <OutlinedInput
            placeholder="MAX"
            type="number"
            inputProps={{ min: '0' }}
            value={maxValue}
            onChange={handleMaxValueChange}
            size="small"
          />
        </FormControl>
      </Box>
    </Box>
  )
}

export default RangeInputComponent