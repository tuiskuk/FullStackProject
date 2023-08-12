import { User } from '../models/user.js'
import { Recipe } from '../models/recipe.js'
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

  const { id } = request.params
  const uploadedFiles = request.files

  const recipe = await Recipe.findById(id)
  if (!recipe) {
    throw new Error('Recipe not found')
  }

  try {
    const uploadPromises = uploadedFiles.map(async (file) => {
      const imagePath = 'http://localhost:3001/images/recipePictures/' + file.filename
      console.log(imagePath, 'uploaded')

      //avoid duplicate recipes
      if(!recipe.images.includes(imagePath)){
        recipe.images.push(imagePath)
      } else {
        console.log('recipe alredy has picture',imagePath)
      }
    })

    // Wait for all promises to resolve
    await Promise.all(uploadPromises)

    await recipe.save()
    console.log('pictures added to recipe:',recipe.images)

    response.status(201).send({ recipeImages: recipe.images })
  } catch(error){
    next(error)
  }
}



export default {
  uploadProfilePicture, uploadRecipePicture
}


