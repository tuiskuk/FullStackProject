import { User } from '../models/user.js'
import userCreatedrecipesController from './userCreatedrecipesController.js'
import { imageDeleter } from '../utils/helperFunctions.js'


const uploadProfilePicture = async (request, response, next) => {

  console.log(request.params)
  const { userId } = request.params
  const imagePath =  'http://localhost:3001/images/profilePictures/' + request?.file?.filename


  try {
    const user = await User.findById(userId)
    console.log(user.profileImage)

    //delete picture if user already has one
    if(user.profileImage !== null) {
      imageDeleter(user)
    }


    const newUser = await User.findByIdAndUpdate(userId, { profileImage: imagePath } ,{ new: true })
    console.log(newUser)

    response.status(201).send({ profileImage: newUser.profileImage })
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


