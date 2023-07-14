import { createSlice } from '@reduxjs/toolkit'

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    token: null,
    user: null,
  },
  reducers: {
    setToken: (state, action) => {
      const { token } = action.payload
      state.token = token
    },
    logOut: (state) => {
      state.token = null
      state.user = null
    },
    setUser: (state, action) => {
      const { user } = action.payload
      state.user = user

    },
  },
})
export default loginSlice
export const { setToken, setUser, logOut } = loginSlice.actions

export const selectCurrentToken = (state) => state.login.token
export const selectCurrentUser = (state) => state.login.user