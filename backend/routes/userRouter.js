import express from 'express'
import userController from '../controllers/userController.js'
import middleware from '../utils/middleware.js'
const userRouter = express.Router()

userRouter.get('/', userController.getUsers)
userRouter.post('/favorites', userController.addFavorite)
userRouter.delete('/favorites', userController.removeFavorite)
userRouter.get('/favorites', userController.getAllFavorites)
userRouter.post('/likes', userController.addLike)
userRouter.delete('/likes', userController.removeLike)
userRouter.get('/dislikes', userController.getAllDislikes)
userRouter.post('/dislikes', userController.addDislike)
userRouter.delete('/dislikes', userController.removeDislike)
userRouter.get('/likes', userController.getAllLikes)
userRouter.post('/follow', userController.addFollow)
userRouter.delete('/follow', userController.removeFollow)
userRouter.post('/', userController.createUser)
userRouter.get('/follow/followers', userController.getAllFollowers)
userRouter.get('/follow/following', userController.getAllFollowing)
userRouter.get('/:userId', userController.getUser)
userRouter.use(middleware.requireAuthentication)
userRouter.get('/favorites/favorite', userController.getFavorite)
userRouter.get('/likes/like', userController.getLike)
userRouter.get('/dislikes/dislike', userController.getDislike)
userRouter.put('/:userId', userController.updateUser)
userRouter.delete('/:userId', userController.deleteUser)


export default userRouter