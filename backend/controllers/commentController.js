import { Comment } from '../models/comment.js'
import { Recipe } from '../models/recipe.js'
import { User } from '../models/user.js'

import mongoose from 'mongoose'

// Add a new comment to a recipe
const addComment = async (request, response, next) => {
  try {
    const { recipeId, userId, text } = request.body

    const userIdObject = new mongoose.Types.ObjectId(userId)

    const [currentUser, recipe] = await Promise.all([
      User.findById(userIdObject),
      Recipe.findOne({ recipeId }),
    ])

    if (!currentUser) {
      return response.status(404).json({ error: 'User not found' })
    }

    if (!recipe) {
      return response.status(404).json({ error: 'Recipe not found' })
    }

    // Create a new comment document
    const newComment = new Comment({
      user: userIdObject,
      text,
      recipeId
    })
    await newComment.save()

    // Push the comment to recipe's comments array
    recipe.comments.push(newComment._id)
    await recipe.save()

    // Push the comment to users's comments array
    currentUser.comments.push(newComment._id)
    await currentUser.save()

    response.status(201).json({ message: 'Comment added successfully' })
  } catch (error) {
    next(error)
  }
}

// Delete a comment
const deleteComment = async (request, response, next) => {
  try {
    const { userId, commentId } = request.body

    const comment = await Comment.findById(commentId)
    if (!comment) {
      return response.status(404).json({ error: 'Comment not found' })
    }

    const userIdObject = new mongoose.Types.ObjectId(userId)
    const user = await User.findById(userIdObject)
    console.log(user)

    if (!comment.user.equals(userIdObject)) {
      return response.status(403).json({ error: 'Deleting comment is not allowed' })
    }

    // Recursive function to delete comment and its replies
    const deleteCommentAndReplies = async (commentId) => {
      try {
        const comment = await Comment.findById(commentId)

        if (!comment) {
          return // Comment not found, terminate recursion
        }

        // Recursively delete the replies
        for (const replyId of comment.replies) {
          await deleteCommentAndReplies(replyId)
        }

        // Delete the comment
        await Comment.deleteOne({ _id: commentId })

        // Remove the comment reference from the parent comment's replies array
        if (comment.parentComment) {
          await Comment.findOneAndUpdate(
            { replies: commentId },
            { $pull: { replies: commentId } }
          )
        }

        // Remove the comment reference from the parent recipe's comments array
        await Recipe.findOneAndUpdate(
          { comments: commentId },
          { $pull: { comments: commentId } }
        )

        // Remove the comment from user's comments array
        console.log(user.comments)
        user.comments = user.comments.filter((comm) => !comm.equals(commentId))

        await user.save()
      } catch (error) {
        next(error)
      }
    }

    // Start recursive deletion
    await deleteCommentAndReplies(commentId)

    response.status(200).json({ message: 'Comment deleted successfully' })
  } catch (error) {
    next(error)
  }
}

// Recursive function to populate replies at each level of nesting
const populateReplies = async (comment) => {
  if (comment.replies.length === 0) {
    return comment
  }

  const populatedReplies = await Comment.populate(comment, {
    path: 'replies',
    populate: [
      {
        path: 'replies',
        model: 'Comment',
      },
      {
        path: 'user', // Assuming 'user' is the field containing the user reference in 'Comment' model
        model: 'User', // Change this to the correct model name if different
        select: 'username profileImage name _id',
      },
    ],
  })

  for (const reply of populatedReplies.replies) {
    await populateReplies(reply)
  }

  return populatedReplies
}


// Get all comments for a specific recipe, including replies
const getCommentsForRecipe = async (request, response, next) => {
  const { recipeId } = request.query
  try {
    // Find the recipe and populate the comments with the actual comment documents, including replies
    const recipe = await Recipe.findOne({ recipeId }).populate({
      path: 'comments',
      populate: {
        path: 'user',
        model: 'User',
        /* select only needed fields */
        select: 'username profileImage name _id',
      },
    })
    if (!recipe) {
      return response.status(204).json({ error: 'Recipe/comments not found' })
    }

    // Populate the replies at each level of nesting
    const populatedComments = await Promise.all(
      recipe.comments.map(async (comment) => await populateReplies(comment))
    )

    // Return the comments for the recipe (including replies)
    response.status(200).json(populatedComments)
  } catch (error) {
    next(error)
  }
}

// Comment on a specific comment (reply to a comment)
const addReply = async (request, response, next) => {
  try {
    const { recipeId, commentId, userId, text } = request.body

    const userIdObject = new mongoose.Types.ObjectId(userId)

    const [currentUser, parentComment] = await Promise.all([
      User.findById(userIdObject),
      Comment.findById(commentId),
    ])

    if (!parentComment) {
      return response.status(404).json({ error: 'Parent comment not found' })
    }

    if(!currentUser) {
      return response.status(404).json({ error: 'User not found' })
    }

    // Create a new comment document for the reply
    const newReply = new Comment({
      user: userId,
      recipeId,
      text,
    })
    await newReply.save()

    // Add the reply's _id to the parent comment's replies array
    parentComment.replies.push(newReply._id)
    await parentComment.save()

    // Push the comment to users's comments array
    currentUser.comments.push(newReply._id)
    await currentUser.save()

    response.status(201).json({ message: 'Reply added successfully' })
  } catch (error) {
    next(error)
  }
}

// Like a comment
const likeComment = async (request, response, next) => {
  try {
    const { commentId, userId } = request.body

    const userIdObject = new mongoose.Types.ObjectId(userId)

    const [currentUser, comment] = await Promise.all([
      User.findById(userIdObject),
      Comment.findById(commentId),
    ])

    if (!currentUser) {
      return response.status(404).json({ error: 'User not found' })
    }

    if (!comment) {
      return response.status(404).json({ error: 'Comment not found' })
    }

    // Check if the user has already liked the comment
    if (comment.likes.includes(userId)) {
      return response.status(400).json({ error: 'You have already liked this comment' })
    }

    // Add the user's _id to the likes array
    comment.likes.push(userId)
    await comment.save()

    response.status(200).json({ message: 'Comment liked successfully' })
  } catch (error) {
    next(error)
  }
}

// RemoveLike
const removeLikeComment = async (request, response, next) => {
  try {
    const { commentId, userId } = request.body

    const userIdObject = new mongoose.Types.ObjectId(userId)

    const [currentUser, comment] = await Promise.all([
      User.findById(userIdObject),
      Comment.findById(commentId),
    ])

    if (!currentUser) {
      return response.status(404).json({ error: 'User not found' })
    }

    if (!comment) {
      return response.status(404).json({ error: 'Comment not found' })
    }

    // Check if the user has not liked the comment
    if (!comment.likes.includes(userId)) {
      return response.status(400).json({ error: 'You have not liked this comment' })
    }

    // Remove the user's _id from the likes array
    comment.likes = comment.likes.filter((like) => !like.equals(userId))
    await comment.save()

    response.status(200).json({ message: 'Like removed successfully' })
  } catch (error) {
    next(error)
  }
}

// Dislike a comment
const dislikeComment = async (request, response, next) => {
  try {
    const { commentId, userId } = request.body

    // Find the comment to be disliked
    const userIdObject = new mongoose.Types.ObjectId(userId)

    const [currentUser, comment] = await Promise.all([
      User.findById(userIdObject),
      Comment.findById(commentId),
    ])

    if (!currentUser) {
      return response.status(404).json({ error: 'User not found' })
    }

    if (!comment) {
      return response.status(404).json({ error: 'Comment not found' })
    }

    // Check if the user has already disliked the comment
    if (comment.dislikes.includes(userId)) {
      return response.status(400).json({ error: 'You have already disliked this comment' })
    }

    // Add the user's _id to the dislikes array
    comment.dislikes.push(userId)
    await comment.save()

    response.status(200).json({ message: 'Comment disliked successfully' })
  } catch (error) {
    next(error)
  }
}

// Remove dislike
const removeDislikeComment = async (request, response, next) => {
  try {
    const { commentId, userId } = request.body

    const userIdObject = new mongoose.Types.ObjectId(userId)

    const [currentUser, comment] = await Promise.all([
      User.findById(userIdObject),
      Comment.findById(commentId),
    ])

    if (!currentUser) {
      return response.status(404).json({ error: 'User not found' })
    }

    if (!comment) {
      return response.status(404).json({ error: 'Comment not found' })
    }

    // Check if the user has not disliked the comment
    if (!comment.dislikes.includes(userId)) {
      return response.status(400).json({ error: 'You have not disliked this comment' })
    }

    // Remove the user's _id from the dislikes array
    comment.dislikes = comment.dislikes.filter((dislike) => !dislike.equals(userId))
    await comment.save()

    response.status(200).json({ message: 'Dislike removed successfully' })
  } catch (error) {
    next(error)
  }
}

const editComment = async (request, response, next) => {
  try {
    const { userId, commentId, text } = request.body

    const userIdObject = new mongoose.Types.ObjectId(userId)

    const [currentUser, comment] = await Promise.all([
      User.findById(userIdObject),
      Comment.findById(commentId),
    ])

    if (!currentUser) {
      return response.status(404).json({ error: 'User not found' })
    }
    if (!comment) {
      return response.status(404).json({ error: 'Comment not found' })
    }

    if (!comment.user.equals(userIdObject)) {
      return response.status(403).json({ error: 'Editing comment is not allowed' })
    }

    // Update the comment text
    comment.text = text
    await comment.save()

    response.status(200).json({ message: 'Comment edited successfully', updatedComment: comment })
  } catch (error) {
    next(error)
  }
}

export default { addComment, deleteComment, getCommentsForRecipe, addReply, likeComment, removeLikeComment, dislikeComment, removeDislikeComment, editComment }