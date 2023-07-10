import { apiSlice } from './apiSlice'
import { createSlice } from '@reduxjs/toolkit'



export const loginApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: loginAttempt => {
        return ({
          url: '/login',
          method: 'POST',
          body: loginAttempt
        })
      },
      transformResponse: responseData => {
        const { token, ...user } = responseData
        return { token, user }
      },
      invalidatesTags: ['Login'],
    })
  })
})

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    isLoggedIn: false,
    token: null,
    user: null,
  },
  reducers: {
    loginSuccess(state, action) {
      state.isLoggedIn = true
      state.token = action.payload.token
      state.user = action.payload.user
      window.localStorage.setItem(
        'token', JSON.stringify(action.payload.token)
      )
      window.localStorage.setItem(
        'user', JSON.stringify(action.payload.user)
      )
      console.log(action.payload.user)
    },
    logout(state) {
      state.isLoggedIn = false
      state.token = null
      state.user = null
      localStorage.clear()
    },
  },
})


export const { loginSuccess, logout } = loginSlice.actions
export const { useLoginMutation } = loginApiSlice
export default loginSlice.reducer