import { apiSlice } from './apiSlice'

export const dislikeApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addDislike: builder.mutation({
      query: ({ userId, recipeId, }) => {
        return ({
          url: '/users/dislikes',
          method: 'POST',
          body: { userId, recipeId }
        })
      },
      invalidatesTags: ['Dislikes'],
    }),
    removeDislike: builder.mutation({
      query: ({ userId, recipeId }) => ({
        url: '/users/dislikes',
        method: 'DELETE',
        body: { userId, recipeId }
      }),
      invalidatesTags: ['Dislikes']
    }),
    getDislike: builder.query({
      query: ({ userId, recipeId }) => {
        console.log(recipeId)
        return {
          url: '/users/dislikes/dislike',
          params: { userId, recipeId },
        }
      },
      providesTags: ['Dislikes']
    }),
    getAllDislikes: builder.query({
      query: ({ userId }) => {
        return {
          url: '/users/dislikes',
          params: { userId },
        }
      },
      providesTags: ['Dislikes']
    })
  })
})

export const {
  useGetAllDislikesQuery,
  useAddDislikeMutation,
  useRemoveDislikeMutation,
  useGetDislikeQuery
} = dislikeApiSlice
