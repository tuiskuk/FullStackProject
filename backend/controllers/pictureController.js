import { User } from '../models/user.js'
import userCreatedrecipesController from './userCreatedrecipesController.js'

const uploadProfilePicture = async (request, response, next) => {

  console.log(request.params)
  const { userId } = request.params
  const imagePath =  'http://localhost:3001/images/profilePictures/' + request?.file?.filename
  console.log(imagePath)

  try {
    await User.findByIdAndUpdate(userId, {
      profileImage: imagePath }, { new: true })
    response.status(201).send({ succes: 'profilepicture uploaded suuccesfylly' })
  } catch(error) {
    next(error)
  }

}

const uploadRecipePicture = async (request, response, next) => {

  const { recipeId } = request.params
  const uploadedFiles = request.files

  try {
    const uploadPromises = uploadedFiles.map(async (file) => {
      const { filename } = file
      const imagePath = 'http://localhost:3001/images/recipePictures/' + filename
      await userCreatedrecipesController.addImageToRecipe(recipeId, imagePath)
    })

    // Wait for all promises to resolve
    await Promise.all(uploadPromises)
  } catch(error){
    next(error)
  }
}

export default {
  uploadProfilePicture, uploadRecipePicture
}


