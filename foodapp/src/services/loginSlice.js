import { createSlice } from '@reduxjs/toolkit'

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    accessToken: null,
    user: null,
  },
  reducers: {
    setAccessToken: (state, action) => {
      const { accessToken } = action.payload
      state.accessToken = accessToken
    },
    logOut: (state) => {
      state.accessToken = null
      state.user = null
    },
    setUser: (state, action) => {
      const { user } = action.payload
      state.user = user

    },
  },
})
export default loginSlice
export const { setAccessToken, setUser, logOut } = loginSlice.actions

export const selectCurrentAccessToken = (state) => state.login.accessToken
export const selectCurrentUser = (state) => state.login.user