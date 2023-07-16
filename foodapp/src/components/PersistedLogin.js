import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRefreshMutation } from '../services/loginApiSlice'
import { selectCurrentToken } from '../services/loginSlice'

const PersistedLogin = () => {
  const accessToken = useSelector(selectCurrentToken)
  console.log(accessToken)
  const [refreshSuccess, setRefreshSuccess] = useState(false)

  const [refresh, { isLoading, isSuccess, isError }] = useRefreshMutation()

  useEffect(() => {

    // Call the refresh mutation to get a new Access Token, if the Refresh Token
    // is still valid. Add another piece of state (refreshSuccess) to make sure
    // that the refresh request has completed and we have received the Access Token
    // before setting it.
    console.log(accessToken)
    const refreshTokenIsValid = async () => {
      try {
        console.log('getting refresh token')
        await refresh()
        setRefreshSuccess(true)
      } catch (e) {
        console.error(e)
      }
    }

    if (!accessToken) {
      refreshTokenIsValid()
    }

    // Set useEffectRan.current to true in the clean-up function to flag
    // when the effect has already run once for the if statement above.

  }, [accessToken, refresh])

  // Handle different states of the refresh process
  if (isError) {
    // Handle the error state if the refresh fails
    return <div>Error occurred while refreshing the token</div>
  }

  if (isLoading) {
    // Show loading spinner while refreshing the token
    return <div>Loading...</div>
  }

  if ((isSuccess && refreshSuccess) || accessToken) {
    // If the refresh is successful and we have the new access token,
    // render the protected routes
    return <Outlet />
  }

  // If none of the above conditions are met, the user is not authenticated
  // or the refresh process hasn't completed yet, so you might want to show
  // a login page or some other indication to prompt the user to log in.
  return <div>Please log in</div>
}

export default PersistedLogin