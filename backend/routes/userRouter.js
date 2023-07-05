import express from 'express'
import userController from '../controllers/userController.js'
const userRouter = express.Router()


userRouter.get('/', userController.getUsers)
userRouter.get('/:userId', userController.getUser)
userRouter.put('/:userId', userController.updateUser)
userRouter.delete('/:userId', userController.deleteUser)
userRouter.post('/', userController.createUser)


export default userRouter