import React from 'react'
import { useState } from 'react'
import { ExpirationWarningDialog } from './WarningDialog'

const ErrorLayout = ({ children }) => {
  const [ showWarning, setShowWarning ] = useState(false)

  return (
    <>
      {children}
      <ExpirationWarningDialog open={showWarning} onClose={() => setShowWarning(false)}/>
    </>
  )
}

export default ErrorLayout