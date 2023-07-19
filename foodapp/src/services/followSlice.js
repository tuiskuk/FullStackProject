import { apiSlice } from './apiSlice'

export const followApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    follow: builder.mutation({
      query: ({ currentUserId, targetUserId  }) => {
        console.log(currentUserId, targetUserId)
        return ({
          url: '/users/follow',
          method: 'POST',
          body: { currentUserId, targetUserId  }

        })
      },
      invalidatesTags: ['Follows', 'Users'],
    }),
    unfollow: builder.mutation({
      query: ({ currentUserId, targetUserId  }) => ({
        url: '/users/follow',
        method: 'DELETE',
        body: { currentUserId, targetUserId  }
      }),
      invalidatesTags: ['Follows', 'Users']
    }),
    getAllFollowing: builder.query({
      query: ({ userId, recipeId }) => {
        console.log(recipeId)
        return {
          url: '/users/follow/following',
          params: { userId, recipeId },
        }

      },
      providesTags: ['Following']
    }),
    getAllFollowers: builder.query({
      query: ({ userId }) => {
        return {
          url: '/users/follow/followers',
          params: { userId },
        }

      },
      providesTags: ['Follows']
    })
  }) })

export const {
  useGetAllFollowersQuery,
  useGetAllFollowingQuery,
  useFollowMutation,
  useUnfollowMutation,
} = followApiSlice