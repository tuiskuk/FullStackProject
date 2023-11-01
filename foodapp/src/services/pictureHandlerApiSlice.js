import { apiSlice } from './apiSlice'

export const pictureApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadProfilePicture: builder.mutation({
      query: ({ file, id }) => {
        const formData = new FormData()
        formData.append('profilePicture', file)
        return {
          url: `/uploadProfilePic/${id}`,
          method: 'POST',
          body: formData,
          params: { id }
        }
      },
    }),
    uploadRecipePicture: builder.mutation({
      query: ({ files, id }) => {
        console.log(files)
        const formData = new FormData()
        for (const file of files) {
          formData.append('recipePicture', file)
        }
        return {
          url: `/uploadRecipePic/${id}`,
          method: 'POST',
          body: formData,
          params: { id },
        }
      },
    }),
  }),
})


export const {
  useUploadProfilePictureMutation,
  useUploadRecipePictureMutation
} = pictureApiSlice
