import { apiSlice } from './apiSlice'
import { setAccessToken, logOut, setUser, setExpTime } from './loginSlice'
import jwtDecode from 'jwt-decode'

const fetchUser = async (userId) => {
  try {
    const response = await fetch(`http://localhost:3001/api/users/${userId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }
    const user = await response.json()
    return user
  } catch (error) {
    console.log(error)
  }
}

const onQueryStarted = async (arg, { dispatch, queryFulfilled }) => {

  try {

    const response = await queryFulfilled
    console.log(response.data)
    const { accessToken } = response.data
    console.log(accessToken)
    dispatch(setAccessToken({ accessToken }))

    const { id, exp } = jwtDecode(accessToken)
    const wholeToken = jwtDecode(accessToken)
    console.log(wholeToken)
    console.log(id)
    const user = await fetchUser(id)
    console.log(user)

    if (!user) {
      console.log('User not found in the database.')
      // Handle the case when the user is not found in the database
      // You can throw an error, show an error message, or handle it as needed
    } else {
      dispatch(setUser({ user }))
      dispatch(setExpTime({ exp }))
    }

  } catch (e) {
    console.log(e)
  }
}

export const loginApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: loginAttempt => ({
        url: '/login',
        method: 'POST',
        body: loginAttempt
      }),
      onQueryStarted,
      transformResponse: responseData => {
        const { accessToken, ...user } = responseData
        return { accessToken, user }
      },
      invalidatesTags: ['Login'],
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/login/refresh',
        method: 'GET'
      }),
      onQueryStarted
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: '/login/logout',
        method: 'POST'
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          console.log('onquerystart')
          dispatch(logOut())
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState())
          }, 1000)
        } catch (e) {
          console.log(e)
        }
      },
    }),
  })
})




export default loginApiSlice
export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } = loginApiSlice

