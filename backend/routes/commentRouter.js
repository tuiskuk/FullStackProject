import express from 'express'
import commentController from '../controllers/commentController.js'
const commentRouter = express.Router()

commentRouter.get('/', commentController.getCommentsForRecipe)
commentRouter.post('/comment', commentController.addComment)
commentRouter.delete('/comment', commentController.deleteComment)
commentRouter.post('/comment/reply', commentController.addReply)
commentRouter.post('/comment/like', commentController.likeComment)
commentRouter.delete('/comment/like', commentController.removeLikeComment)
commentRouter.post('/comment/dislike', commentController.dislikeComment)
commentRouter.delete('/comment/dislike', commentController.removeDislikeComment)
commentRouter.put('/comment', commentController.editComment)

export default commentRouter