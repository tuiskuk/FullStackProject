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
      query: ({ searchTerm,  filterOptionTerms, excludedTerms, timeTerm, caloriesTerm }) => {
        console.log('searchTerm:', searchTerm, filterOptionTerms, excludedTerms, timeTerm, caloriesTerm)
        return {
          url: '/recipes',
          params: { search: searchTerm, healthFilters: filterOptionTerms, excludedFilters: excludedTerms, time: timeTerm, calories: caloriesTerm },
        }
      },
    }),
    getNextPage: builder.query({
      query: (link) => ({
        url: '/recipes/link',
        params: { link: link }
      })
    }),

  })
})

export const { useGetAllRecipesQuery, useGetNextPageQuery, useGetRecipeQuery } = apiSlice
