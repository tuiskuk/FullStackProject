import { apiSlice } from './apiSlice'
import { setAccessToken, logOut, setUser } from './loginSlice'
import jwtDecode from 'jwt-decode'
const onQueryStarted = async (arg, { dispatch, queryFulfilled }) => {

  try {

    const response = await queryFulfilled
    console.log(response.data)
    const { accessToken } = response.data
    dispatch(setAccessToken({ accessToken }))

    const { username, name, email, profileImage, profileText, followers,following, favorites, id } = jwtDecode(accessToken)
    const user = { username, name, email, profileImage, profileText, followers,following, favorites, id }
    dispatch(setUser({ user }))
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

