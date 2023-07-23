import { apiSlice } from './apiSlice'

export const likeApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addLike: builder.mutation({
      query: ({ userId, recipeId }) => {
        return ({
          url: '/users/likes',
          method: 'POST',
          body: { userId, recipeId }
        })
      },
      invalidatesTags: ['Likes'],
    }),
    removeLike: builder.mutation({
      query: ({ userId, recipeId }) => ({
        url: '/users/likes',
        method: 'DELETE',
        body: { userId, recipeId }
      }),
      invalidatesTags: ['Likes']
    }),
    getLike: builder.query({
      query: ({ userId, recipeId }) => {
        console.log(recipeId)
        return {
          url: '/users/likes/like',
          params: { userId, recipeId },
        }
      },
      providesTags: ['Likes']
    }),
    getAllLikes: builder.query({
      query: ({ userId }) => {
        return {
          url: '/users/likes',
          params: { userId },
        }
      },
      providesTags: ['Likes']
    })
  })
})

export const {
  useGetAllLikesQuery,
  useAddLikeMutation,
  useRemoveLikeMutation,
  useGetLikeQuery
} = likeApiSlice