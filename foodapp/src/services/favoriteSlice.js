import { apiSlice } from './apiSlice'

export const favoriteApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addFavorite: builder.mutation({
      query: ({ userId, recipeId, label, image }) => {
        return ({

          url: '/users/favorites',
          method: 'POST',
          body: { userId, recipeId, label, image }

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
    getFavorite: builder.query({
      query: ({ userId, recipeId }) => {
        console.log(recipeId)
        return {
          url: '/users/favorites/favorite',
          params: { userId, recipeId },
        }

      },
      providesTags: ['Favorites']
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
  }) })

export const {
  useGetAllFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetFavoriteQuery
} = favoriteApiSlice