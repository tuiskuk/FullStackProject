import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3001/api',
  credentials: 'include',
})

export const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: [
    'Recipes'
  ],
  endpoints: builder => ({
    getAllRecipes: builder.query({
      query: ({ searchTerm, filterOptions }) => {
        console.log('searchTerm:', searchTerm, filterOptions) // Add console.log here
        return {
          url: '/recipes',
          params: { search: searchTerm, healthFilters: filterOptions },
        }
      },
    }),
    getNextPage: builder.query({
      query: (link) => ({
        url: '/recipes/link',
        params: { link: link }
      })
    })
  })
})

export const { useGetAllRecipesQuery, useGetNextPageQuery } = apiSlice
