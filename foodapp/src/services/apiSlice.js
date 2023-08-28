import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setAccessToken } from './loginSlice'


const baseQueryWithAccessToken = fetchBaseQuery({
  baseUrl: 'http://localhost:3001/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {

    // Attach our accessToken from state to the requests' authorization header
    // before each request is sent.
    const jwt = getState().login?.accessToken

    if (jwt)
      headers.set('authorization', `Bearer ${jwt}`)
    return headers
  }
})

const baseQueryWithRefreshToken = async(args, api, extraOptions) => {

  // Call the previously defined baseQuery function to set the authorization header.
  // If the accessToken is still valid, this response will be returned.
  let response = await baseQueryWithAccessToken(args, api, extraOptions)
  // 403 means our accessToken has expired and it should be refreshed.
  if (response?.error?.status === 403) {

    // Attempt to acquire a new accessToken using our httpOnly RefreshToken.
    const refreshResponse = await baseQueryWithAccessToken('/login/refresh', api, extraOptions)

    console.log(refreshResponse)

    // If we get data back, our refresh token is valid and the data
    // should contain the new accessToken.
    if (refreshResponse?.data) {

      // Store the new accessToken to state.
      api.dispatch(setAccessToken({ ...refreshResponse.data }))

      // Attempt to retry the original query that caused the 403
      // with the new accessToken in the header.

      response = await baseQueryWithAccessToken(args, api, extraOptions)
    } else {
      // If the response is Forbidden 403 for the refreshToken as well,
      // the user will have to log in again.
      if (refreshResponse?.error?.status === 403)
        refreshResponse.error.data.message = 'Your login has expired. Please log in again'

      return refreshResponse
    }
  }
  return response
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    'Recipes',
    'Users',
    'Favorites',
    'Follows',
    'Following',
    'Likes',
    'Dislikes',
    'Interactions',
    'Comments'
  ],
  endpoints: builder => ({
    getAllRecipes: builder.query({
      query: ({ searchTerm,  filterOptionTerms, timeTerm, caloriesTerm, nutrientInputsTerms, ingridientsNumberTerm, mealTypeOptionTerms, excludedChipArrayTerms, cuisineTypeTerms, dishTypeTerms }) => {
        console.log('searchTerm:', searchTerm, filterOptionTerms, timeTerm, caloriesTerm, nutrientInputsTerms, ingridientsNumberTerm, mealTypeOptionTerms, excludedChipArrayTerms, cuisineTypeTerms, dishTypeTerms)
        const valuesToCheck = [searchTerm,  filterOptionTerms, timeTerm, caloriesTerm, nutrientInputsTerms, ingridientsNumberTerm, mealTypeOptionTerms, excludedChipArrayTerms, cuisineTypeTerms, dishTypeTerms ]

        const hasNonEmptyValue = valuesToCheck.some(value => {
          if (Array.isArray(value)) {
            return value.length > 0
          }
          if (typeof value === 'object' && value !== null) {
            const nonEmptyProperties = Object.values(value).filter(prop => !!prop)
            return nonEmptyProperties.length > 0
          }
          return !!value
        })

        //Adding random value to search term if there is no filter set. Without at least one value the api call will not return recipes
        if(!hasNonEmptyValue) {
          searchTerm = 'recommended'
        }
        console.log(hasNonEmptyValue)
        return {
          url: '/recipes',
          params: { search: searchTerm, healthFilters: filterOptionTerms, time: timeTerm, calories: caloriesTerm, nutrients: JSON.stringify(nutrientInputsTerms),
            ingr: ingridientsNumberTerm, mealTypeOptions: mealTypeOptionTerms, excludedFilters: excludedChipArrayTerms, cuisineTypeOptions: cuisineTypeTerms,
            dishOptions: dishTypeTerms },
        }
      },
    }),
    getNextPage: builder.query({
      query: (link) => ({
        url: '/recipes/link',
        params: { link: link }
      })
    }),
    confirmEmail: builder.query({
      query: (emailToken) => ({
        url: `register/${emailToken}`
      })
    }),
    getRecipe : builder.query({
      query: (id) => ({
        url: '/recipes/id',
        params: { id: id },
        transformResponse: (response) => {
          if (response.status === 404) {
            // Handle 404 error here and return a custom error object
            return { error: 'API Recipe not found' }
          }
          return response.json()
        },
      })
    })

  })
})

export const { useGetAllRecipesQuery, useGetNextPageQuery, useGetRecipeQuery, useConfirmEmailQuery } = apiSlice
