import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'
import { useRefreshMutation, useSendLogoutMutation } from '../services/loginApiSlice'
import { selectCurrentAccessToken, selectCurrentExpTime } from '../services/loginSlice'

const PersistedUserLogin = () => {
  const navigate = useNavigate()
  const accessToken = useSelector(selectCurrentAccessToken)
  const exp = useSelector(selectCurrentExpTime)
  const [ logout ] = useSendLogoutMutation()

  console.log((exp*1000)-Date.now())

  useEffect(() => {
    const timeRemaining = (exp * 1000) - Date.now()
    const timeout = setTimeout(() => {
      logout()
      navigate('/')
    }, timeRemaining)

    return () => clearTimeout(timeout)
  }, [exp])

  const useEffectRan = useRef(false) // Flag for if the useEffect has already ran once. It runs twice in React.strictmode, which is used for development.
  const [refreshSuccess, setRefreshSuccess] = useState(false)

  const [refresh, {
    isUninitialized,
    isSuccess,
    isError,
    isLoading
  }] = useRefreshMutation()

  useEffect(() => {
    console.log('moro')
    console.log(useEffectRan)

    // useEffect runs twice in development with Strict Mode. If effectRan.current === true,
    // it means the useEffect has already ran once, as we set it to true in the clean up function.
    // This is necessary in development, but not in prod.

    // TODO: remove this in prod or create an env for when development === true and use the var here.


    // Call the refresh mutation to get a new Access Token, if the Refresh Token
    // is still valid. Add another piece of state (refreshSuccess) to make sure
    // that the refresh request has completed and we have received the Access Token
    // before setting it.

    const refreshTokenIsValid = async () => {
      try {
        await refresh()
        setRefreshSuccess(true)
      } catch (e) {
        console.error(e)
      }
    }

    // If the user has no Access Token and they have opted to persistion, attempt to
    // refresh the token.

    if (!accessToken)
      refreshTokenIsValid()

    // Set useEffectRan.current to true in the clean up function to flag
    // when the effect has already ran once for the if statement above.


  }, [])


  // The return values are the same, but the conditions change, resulting in different behavior.
  // If rememberUser is false (user opted not to stay logged in), there is no point in starting to evaluate
  // whether the RefreshToken-call was successful or not, and we should simply redirect the user back to the login page.

  if (isError)
    return <Outlet />
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }
  else if ((isSuccess && refreshSuccess) || (isUninitialized && accessToken) || (isUninitialized && !accessToken))
    return <Outlet />

}

export default PersistedUserLogin