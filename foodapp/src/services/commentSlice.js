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
      query: ({ userId, commentId }) => ({
        url: '/comments/comment',
        method: 'DELETE',
        body: { userId, commentId }
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
      query: ({ recipeId, commentId, userId, text }) => ({
        url: '/comments/comment/reply',
        method: 'POST',
        body: { recipeId, commentId, userId, text },
      }),
      providesTags: ['Comments']
    }),
    likeComment: builder.mutation({
      query: ({ commentId, userId }) => ({
        url: '/comments/comment/like',
        method: 'POST',
        body: { commentId, userId },
      }),
    }),
    removeLikeComment: builder.mutation({
      query: ({ commentId, userId }) => ({
        url: '/comments/comment/like',
        method: 'DELETE',
        body: { commentId, userId },
      }),
    }),
    dislikeComment: builder.mutation({
      query: ({ commentId, userId }) => ({
        url: '/comments/comment/dislike',
        method: 'POST',
        body: { commentId, userId },
      }),
    }),
    removeDislikeComment: builder.mutation({
      query: ({ commentId, userId }) => ({
        url: '/comments/comment/dislike',
        method: 'DELETE',
        body: { commentId, userId },
      }),
    }),
    editComment: builder.mutation({
      query: ({ userId, commentId, text }) => ({
        url: '/comments/comment',
        method: 'PUT',
        body: { userId, commentId, text },
      }),
    }),
  })
})

export const {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsForRecipeQuery,
  useAddReplyMutation,
  useLikeCommentMutation,
  useRemoveLikeCommentMutation,
  useDislikeCommentMutation,
  useRemoveDislikeCommentMutation,
  useEditCommentMutation,
} = commentSlice
