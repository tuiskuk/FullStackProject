import express from 'express'
import commentController from '../controllers/commentController.js'
const commentRouter = express.Router()

commentRouter.get('/', commentController.getCommentsForRecipe)
commentRouter.post('/comment', commentController.addComment)
commentRouter.delete('/comment', commentController.deleteComment)
commentRouter.post('/comment/reply', commentController.addReply)
commentRouter.post('/comment/like', commentController.likeComment)
commentRouter.post('/comment/dislike', commentController.dislikeComment)

export default commentRouter