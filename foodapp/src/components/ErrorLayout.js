import React from 'react'
import { useEffect, useState } from 'react'
import ExpirationWarningDialog from '../dialogs/ExpirationWarningDialog'
import { useSelector } from 'react-redux'
import { selectCurrentExpTime } from '../services/loginSlice'
import { selectCurrentUser } from '../services/loginSlice'

const ErrorLayout = ({ children }) => {
  const [ showWarning, setShowWarning ] = useState(false)
  const [ logOut, setLogOut ] = useState(false)
  const user = useSelector(selectCurrentUser)
  const exp = useSelector(selectCurrentExpTime, { skip: !user })

  // Set the threshold time for showing the warning
  const thresholdTime = 10 * 60 * 1000

  useEffect(() => {
    console.log(exp)
    console.log(user)
    if (exp) {
      const timeRemaining = (exp * 1000) - Date.now()
      if (timeRemaining <= thresholdTime) {
        console.log('Warning')
        setLogOut(false)
        setShowWarning(true)
      } else {
        const timer = setTimeout(() => {
          setLogOut(false)
          setShowWarning(true)
        }, timeRemaining - thresholdTime)

        return () => clearTimeout(timer)
      }
    } else {
      if(showWarning) {
        setLogOut(true)
        setShowWarning(true)
        console.log('Expiration time has passed.')
      }
    }
  }, [exp])

  return (
    <>
      {children}
      <ExpirationWarningDialog loggedOut={logOut} open={showWarning} onClose={() => setShowWarning(false)}/>
    </>
  )
}

export default ErrorLayout