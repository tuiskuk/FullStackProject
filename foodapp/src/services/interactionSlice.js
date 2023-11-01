import { apiSlice } from './apiSlice'

export const interactionApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addLikeInteraction: builder.mutation({
      query: ({ recipeId, userId }) => {
        return ({
          url: '/interactions/likes',
          method: 'POST',
          body: { recipeId, userId }
        })
      },
      invalidatesTags: ['Interactions'],
    }),
    removeLikeInteraction: builder.mutation({
      query: ({ recipeId, userId }) => ({
        url: '/interactions/likes',
        method: 'DELETE',
        body: { recipeId, userId }
      }),
      invalidatesTags: ['Interactions']
    }),
    addDislikeInteraction: builder.mutation({
      query: ({ recipeId, userId }) => {
        return ({
          url: '/interactions/dislikes',
          method: 'POST',
          body: { recipeId, userId }
        })
      },
      invalidatesTags: ['Interactions'],
    }),
    removeDislikeInteraction: builder.mutation({
      query: ({ recipeId, userId }) => ({
        url: '/interactions/dislikes',
        method: 'DELETE',
        body: { recipeId, userId }
      }),
      invalidatesTags: ['Interactions']
    }),
    getAllInteractions: builder.query({
      query: ({ recipeId }) => {
        console.log(recipeId)
        return {
          url: '/interactions',
          params: { recipeId },
        }
      },
      providesTags: ['Interactions']
    }),
    createInteraction: builder.mutation({
      query: ({ recipeId, label, image, creator, cuisineType, dishType, healthLabels,
        ingredients, instructions, mealType, recipeYield, totalTime }) => {
        return {
          url: '/interactions',
          method: 'POST',
          body: {
            recipeId, label, image, creator, cuisineType, dishType, healthLabels,
            ingredients, instructions, mealType, recipeYield, totalTime
          },
        }
      },
      invalidatesTags: ['Interactions'],
    }),
    updateInteraction: builder.mutation({
      query: ({ recipeId, label, image, creator, cuisineType, dishType, healthLabels,
        ingredients, instructions, mealType, recipeYield, totalTime }) => {
        return {
          url: '/interactions/all/specificUserCreated',
          method: 'PUT',
          body: {
            recipeId, label, image, creator, cuisineType, dishType, healthLabels,
            ingredients, instructions, mealType, recipeYield, totalTime
          },
        }
      },
      invalidatesTags: ['Interactions'],
    }),
    getAllInteractionRecipes: builder.query({
      query: () => {
        return {
          url: '/interactions/all',
        }
      },
      providedTags: ['Interactions'],
    }),
    getAllUserCreatedInteractions: builder.query({
      query: ({ searchTerm,  filterOptionTerms, timeTerm, ingridientsNumberTerm, mealTypeOptionTerms, excludedChipArrayTerms, cuisineTypeTerms, dishTypeTerms }) => {
        console.log('searchTerm:', searchTerm, filterOptionTerms, timeTerm, ingridientsNumberTerm, mealTypeOptionTerms, excludedChipArrayTerms, cuisineTypeTerms, dishTypeTerms)
        //const valuesToCheck = [searchTerm,  filterOptionTerms, timeTerm, caloriesTerm, nutrientInputsTerms, ingridientsNumberTerm, mealTypeOptionTerms, excludedChipArrayTerms, cuisineTypeTerms, dishTypeTerms ]
        return {
          url: '/interactions/all/userCreated',
          params: { search: searchTerm, healthFilters: filterOptionTerms, time: timeTerm, ingr: ingridientsNumberTerm, mealTypeOptions: mealTypeOptionTerms,
            excludedFilters: excludedChipArrayTerms, cuisineTypeOptions: cuisineTypeTerms, dishOptions: dishTypeTerms },
        }
      },
      providesTags: ['Interactions']
    }),
    getAllSpecificUserCreatedRecipes: builder.query({
      query: ({ userId }) => {
        console.log(userId)
        return {
          url: '/interactions/all/specificUserCreated',
          params: { userId }
        }
      },
      providesTags: ['Interactions']
    }),
    deleteSpecificUserCreatedRecipe: builder.mutation({
      query: ({ userId, recipeId }) => {
        console.log(userId, recipeId)
        return {
          url: '/interactions/all/specificUserCreated',
          method: 'DELETE',
          params: { userId, recipeId }
        }
      },
      invalidatesTags: ['Interactions']
    })
  })
})

export const {
  useAddLikeInteractionMutation,
  useRemoveLikeInteractionMutation,
  useAddDislikeInteractionMutation,
  useRemoveDislikeInteractionMutation,
  useGetAllInteractionsQuery,
  useCreateInteractionMutation,
  useGetAllInteractionRecipesQuery,
  useGetAllUserCreatedInteractionsQuery,
  useGetAllSpecificUserCreatedRecipesQuery,
  useDeleteSpecificUserCreatedRecipeMutation,
  useUpdateInteractionMutation
} = interactionApiSlice