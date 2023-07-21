import express from 'express'
import pictureController from '../controllers/pictureController.js'
import middleware from '../utils/middleware.js'
const pictureRouter = express.Router()



pictureRouter.post('/uploadProfilePic/:userId',middleware.uploadProfilePicture.single('profilePicture') , pictureController.uploadProfilePicture)
pictureRouter.post('/uploadRecipePic/:recipeId',middleware.uploadRecipePicture.array('recipePicture') , pictureController.uploadRecipePicture)

export default pictureRouter
