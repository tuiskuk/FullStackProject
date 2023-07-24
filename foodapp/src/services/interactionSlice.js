import { apiSlice } from './apiSlice'

export const interactionApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addLikeInteraction: builder.mutation({
      query: ({ recipeId, userId }) => {
        return ({
          url: '/interactions/likes',
          method: 'POST',
          params: { recipeId, userId }
        })
      },
      invalidatesTags: ['Interactions'],
    }),
    removeLikeInteraction: builder.mutation({
      query: ({ recipeId, userId }) => ({
        url: '/interactions/likes',
        method: 'DELETE',
        params: { recipeId, userId }
      }),
      invalidatesTags: ['Interactions']
    }),
    addDislikeInteraction: builder.mutation({
      query: ({ recipeId, userId }) => {
        return ({
          url: '/interactions/dislikes',
          method: 'POST',
          params: { recipeId, userId }
        })
      },
      invalidatesTags: ['Interactions'],
    }),
    removeDislikeInteraction: builder.mutation({
      query: ({ recipeId, userId }) => ({
        url: '/interactions/dislikes',
        method: 'DELETE',
        params: { recipeId, userId }
      }),
      invalidatesTags: ['Interactions']
    }),
    getAllInteractions: builder.query({
      query: ({ recipeId }) => {
        return {
          url: '/interactions',
          params: { recipeId },
        }
      },
      providesTags: ['Interactions']
    }),
    createInteraction: builder.mutation({
      query: ({ recipeId }) => {
        return ({
          url: '/interactions',
          method: 'POST',
          params: { recipeId },
        })
      },
      invalidatesTags: ['Interactions'],
    }),
  })
})

export const {
  useAddLikeInteractionMutation,
  useRemoveLikeInteractionMutation,
  useAddDislikeInteractionMutation,
  useRemoveDislikeInteractionMutation,
  useGetAllInteractionsQuery,
  useCreateInteractionMutation
} = interactionApiSlice