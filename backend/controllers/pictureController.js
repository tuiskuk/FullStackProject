import { User } from '../models/user.js'
import { Recipe } from '../models/recipe.js'
import { imageDeleter, recipePictureDeleter } from '../utils/helperFunctions.js'


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
  const { id } = request.params
  const uploadedFiles = request.files
  console.log(uploadedFiles)

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
      return 'http://localhost:3001/images/recipePictures/' + filename
    })

    recipePictureDeleter(recipe.images)

    // Replace the existing images with the new unique images
    recipe.images = newImagePaths

    await recipe.save()
    console.log('pictures added to recipe:', recipe.images)

    response.status(201).send({ recipeImages: recipe.images })
  } catch (error) {
    next(error)
  }
}




export default {
  uploadProfilePicture, uploadRecipePicture
}


