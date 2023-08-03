import { User } from '../models/user.js'
import { Recipe } from '../models/recipe.js'
import { imageDeleter } from '../utils/helperFunctions.js'


const addImageToRecipe = async (recipeId, imageUrl, next) => {
  try {
    const recipe = await Recipe.findById(recipeId)
    if (!recipe) {
      throw new Error('Recipe not found')
    }

    // Add the new image URL to the images array
    recipe.images.push(imageUrl)

    // Save the updated recipe
    const updatedRecipe = await recipe.save()

    return updatedRecipe
  } catch (error) {
    next(error)
  }
}

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
      await addImageToRecipe(recipeId, imagePath)
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


