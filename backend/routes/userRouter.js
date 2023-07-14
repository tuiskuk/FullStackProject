import express from 'express'
import userController from '../controllers/userController.js'
import middleware from '../utils/middleware.js'
const userRouter = express.Router()

userRouter.get('/', userController.getUsers)
userRouter.post('/', userController.createUser)
userRouter.use(middleware.requireAuthentication)
userRouter.post('/favorites', userController.addFavorite)
userRouter.delete('/favorites', userController.removeFavorite)
userRouter.get('/favorites', userController.getFavorite)
userRouter.get('/:userId', userController.getUser)
userRouter.put('/:userId', userController.updateUser)
userRouter.delete('/:userId', userController.deleteUser)



export default userRouter