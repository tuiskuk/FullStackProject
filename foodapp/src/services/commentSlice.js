import { apiSlice } from './apiSlice'

export const commentSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addComment: builder.mutation({
      query: ({ recipeId, userId, text }) => ({
        url: '/comments/comment',
        method: 'POST',
        body: { recipeId, userId, text }
      }),
      invalidatesTags: ['Comments'],
    }),
    deleteComment: builder.mutation({
      query: ({ commentId }) => ({
        url: '/comments/comment',
        method: 'DELETE',
        body: { commentId }
      }),
      invalidatesTags: ['Comments']
    }),
    getCommentsForRecipe: builder.query({
      query: ({ recipeId }) => ({
        url: '/comments',
        params: { recipeId },
      }),
      providesTags: ['Comments']
    }),
    addReply: builder.mutation({
      query: ({ commentId, userId, text }) => ({
        url: '/comments/comment/reply',
        method: 'POST',
        body: { commentId, userId, text },
      }),
      providesTags: ['Comments']
    })
  })
})

export const {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsForRecipeQuery,
  useAddReplyMutation
} = commentSlice
