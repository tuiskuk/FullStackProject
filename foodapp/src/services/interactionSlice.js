import { apiSlice } from './apiSlice'

export const interactionApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addLikeInteraction: builder.mutation({
      query: ({ recipeId, userId }) => {
        return ({
          url: '/recipes/interactions/likes',
          method: 'POST',
          body: { recipeId, userId }
        })
      },
      invalidatesTags: ['Interactions'],
    }),
    removeLikeInteraction: builder.mutation({
      query: ({ recipeId, userId }) => ({
        url: '/recipes/interactions/likes',
        method: 'DELETE',
        body: { recipeId, userId }
      }),
      invalidatesTags: ['Interactions']
    }),
    getAllLikeInteractions: builder.query({
      query: ({ recipeId }) => {
        return {
          url: '/recipes/interactions/likes',
          params: { recipeId },
        }
      },
      providesTags: ['Interaction']
    }),
    createRecipe: builder.mutation({
      query: newRecipe => {
        return ({
          url: '/recipes/interactions',
          method: 'POST',
          body: newRecipe
        })
      },
      invalidatesTags: ['Users'],
    }),
  })
})

export const {
  useAddLikeInteractionMutation,
  useRemoveLikeInteractionMutation,
  useGetAllLikesQuery,
  useCreateRecipeMutation
} = interactionApiSlice