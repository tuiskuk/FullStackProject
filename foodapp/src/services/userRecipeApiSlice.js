import { apiSlice } from './apiSlice'

export const userRecipeApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createRecipe: builder.mutation({
      query: newrecipe => ({
        url: '/userrecipes',
        method: 'POST',
        body: newrecipe
      }),
    }),
    getRecipe: builder.query({
      query: ({ recipeID }) => ({
        url: `/userrecipes/${recipeID}`,
      }),
    }),
    getRecipes: builder.query({
      query: () => ({
        url: '/userrecipes',
      }),
    }),
    deleteRecipe: builder.mutation({
      query: ({ id }) => ({
        url: `/userrecipes/${id}`,
        method: 'DELETE',
        body: { id }
      }),
    })
  })
})

export const {
  useCreateRecipeMutation,
  useGetRecipeQuery,
  useGetRecipesQuery,
  useDeleteRecipeMutation
} = userRecipeApiSlice