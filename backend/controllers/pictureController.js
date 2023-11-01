import { User } from '../models/user.js'
import { Recipe } from '../models/recipe.js'
import { imageDeleter, recipePictureDeleter } from '../utils/helperFunctions.js'


const uploadProfilePicture = async (request, response, next) => {


  const { userId } = request.params
  const imagePath =  'https://dishcovery-api.onrender.com/images/profilePictures/' + request?.file?.filename


  try {
    const user = await User.findById(userId)


    //delete picture if user already has one
    if(user.profileImage !== null) {
      imageDeleter(user)
    }

    const newUser = await User.findByIdAndUpdate(userId, { profileImage: imagePath } ,{ new: true })


    response.status(201).send({ profileImage: newUser.profileImage })
  } catch(error) {
    next(error)
  }

}

const uploadRecipePicture = async (request, response, next) => {
  const { id } = request.params
  const uploadedFiles = request.files


  const recipe = await Recipe.findById(id)
  if (!recipe) {
    throw new Error('Recipe not found')
  }

  try {
    const uniqueUploadedFiles = uploadedFiles.filter((file, index, self) => {
      const filename = file.filename.split('/').pop()
      const shortFilename = filename.substring(13)
      return self.findIndex(f => {
        const fFilename = f.filename.split('/').pop()
        const fShortFilename = fFilename.substring(13)
        return fShortFilename === shortFilename
      }) === index
    })

    const newImagePaths = uniqueUploadedFiles.map(file => {
      const filename = file.filename.split('/').pop()
      return 'https://dishcovery-api.onrender.com/images/recipePictures/' + filename
    })

    recipePictureDeleter(recipe.images)

    // Replace the existing images with the new unique images
    recipe.images = newImagePaths

    await recipe.save()


    response.status(201).send({ recipeImages: recipe.images })
  } catch (error) {
    next(error)
  }
}




export default {
  uploadProfilePicture, uploadRecipePicture
}


