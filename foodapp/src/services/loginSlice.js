import { createSlice } from '@reduxjs/toolkit'

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    accessToken: null,
    user: null,
    expTime: null,
  },
  reducers: {
    setAccessToken: (state, action) => {
      const { accessToken } = action.payload
      state.accessToken = accessToken
    },
    logOut: (state) => {
      state.accessToken = null
      state.user = null
      state.expTime = null
    },
    setUser: (state, action) => {
      const { user } = action.payload
      state.user = user

    },
    setExpTime: (state, action) => {
      const { exp } = action.payload
      state.expTime = exp
    }
  },
})
export default loginSlice
export const { setAccessToken, setUser, logOut, setExpTime } = loginSlice.actions

export const selectCurrentAccessToken = (state) => state.login.accessToken
export const selectCurrentUser = (state) => state.login.user
export const selectCurrentExpTime = (state) => state.login.expTime