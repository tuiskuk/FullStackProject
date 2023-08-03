import { apiSlice } from './apiSlice'

export const userRecipeApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({

    //create new recipe
    createRecipe: builder.mutation({
      query: newrecipe => ({
        url: '/userrecipes',
        method: 'POST',
        body: newrecipe
      }),
    }),

    //get one recipe
    getUserRecipe: builder.query({
      query: ({ recipeID }) => ({
        url: `/userrecipes/${recipeID}`,
      }),
    }),

    //get all recipes
    getUserRecipes: builder.query({
      query: () => ({
        url: '/userrecipes',
      }),
    }),

    //delete whole recipe
    deleteUserRecipe: builder.mutation({
      query: ({ id }) => ({
        url: `/userrecipes/${id}`,
        method: 'DELETE',
        body: { id }
      }),
    }),

    // Add a like to a user recipe
    addLike: builder.mutation({
      query: ({ recipeId, userId }) => ({
        url: '/userrecipes/like',
        method: 'POST',
        body: { userId, recipeId },
      }),
    }),

    // Delete a like from a user recipe
    deleteLike: builder.mutation({
      query: ({ recipeId, userId }) => ({
        url: '/userrecipes/like',
        method: 'DELETE',
        body: { userId, recipeId },
      }),
    }),

    // Add a dislike to a user recipe
    addDislike: builder.mutation({
      query: ({ recipeId, userId }) => ({
        url: '/userrecipes/dislike',
        method: 'POST',
        body: { userId, recipeId },
      }),
    }),

    // Delete a dislike from a user recipe
    deleteDislike: builder.mutation({
      query: ({ recipeId, userId }) => ({
        url: '/userrecipes/dislike',
        method: 'DELETE',
        body: { userId, recipeId },
      }),
    }),
  }),
})

export const {
  useCreateRecipeMutation,
  useGetUserRecipeQuery,
  useGetUserRecipesQuery,
  useDeleteUserRecipeMutation,
  useAddLikeMutation,
  useDeleteLikeMutation,
  useAddDislikeMutation,
  useDeleteDislikeMutation,
} = userRecipeApiSlice