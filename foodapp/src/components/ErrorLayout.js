import React from 'react'
import { useEffect, useState } from 'react'
import { ExpirationWarningDialog } from './WarningDialog'
import { useSelector } from 'react-redux'
import { selectCurrentExpTime } from '../services/loginSlice'
import { selectCurrentUser } from '../services/loginSlice'

const ErrorLayout = ({ children }) => {
  const [ showWarning, setShowWarning ] = useState(false)
  const user = useSelector(selectCurrentUser)
  const exp = useSelector(selectCurrentExpTime, { skip: !user, refetchOnMountOrArgChange: true })

  // Set the threshold time for showing the warning
  const thresholdTime = 30 * 1000

  useEffect(() => {
    if (user) {
      const timeRemaining = (exp * 1000) - Date.now()

      if (timeRemaining <= thresholdTime) {
        console.log('Warning')
        setShowWarning(true)
      } else {
        const timer = setTimeout(() => {
          setShowWarning(true)
        }, timeRemaining - thresholdTime)

        return () => clearTimeout(timer)
      }
    }

  }, [exp])

  return (
    <>
      {children}
      <ExpirationWarningDialog open={showWarning} onClose={() => setShowWarning(false)}/>
    </>
  )
}

export default ErrorLayout