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
      query: (searchTerm) => {
        console.log('searchTerm:', searchTerm) // Add console.log here
        return {
          url: '/recipes',
          params: { search: searchTerm },
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
