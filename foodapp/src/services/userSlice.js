import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'

import { apiSlice } from './apiSlice'

const usersAdapter = createEntityAdapter({
  selectId: (user) => user.id
})
const initialState = usersAdapter.getInitialState()

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => ({
        url: '/users',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError
      }),
      transformResponse: responseData =>
        usersAdapter.setAll(initialState, responseData),
      providesTags: ['Users']
    }),
    getUser: builder.query({
      query: (userId) =>
      {
        if(!userId) return
        return ({
          url: `/users/${userId}`,
          params: { userId }
        })
      },
    }),
    createUser: builder.mutation({
      query: newUser => {
        return ({

          url: '/users',
          method: 'POST',
          body: newUser

        })
      },
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: ['Users']
    }),
    updateUser: builder.mutation({
      query: ({ id, user }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: user
      }),
      invalidatesTags: ['Users']
    })
  })
})

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserQuery
} = userApiSlice

export const selectUsersResult = userApiSlice.endpoints.getUsers.select('UsersList')

const selectUsersData = createSelector(
  selectUsersResult,
  usersResult => usersResult.data
)

export const {
  selectIds: selectUserIds,
  selectEntities: selectUserEntities
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)

export const selectAllUsers = createSelector(
  selectUserIds,
  selectUserEntities,
  (ids, users) => ids?.map(id => users[id])
)