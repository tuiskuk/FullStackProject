import { apiSlice } from './apiSlice'

export const favoriteApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addFavorite: builder.mutation({
      query: ({ userId, recipeId }) => {
        return ({
          url: '/users/favorites',
          method: 'POST',
          body: { userId, recipeId }
        })
      },
      invalidatesTags: ['Favorites'],
    }),
    removeFavorite: builder.mutation({
      query: ({ userId, recipeId }) => ({
        url: '/users/favorites',
        method: 'DELETE',
        body: { userId, recipeId }
      }),
      invalidatesTags: ['Favorites']
    }),
    getAllFavorites: builder.query({
      query: ({ userId }) => {
        return {
          url: '/users/favorites',
          params: { userId },
        }
      },
      providesTags: ['Favorites']
    })
  })
})

export const {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetFavoriteQuery,
  useGetAllFavoritesQuery
} = favoriteApiSlice