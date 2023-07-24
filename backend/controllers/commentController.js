import { Comment } from '../models/comment.js'
import { Recipe } from '../models/recipe.js'
import { User } from '../models/user.js'

import mongoose from 'mongoose'

// Add a new comment to a recipe
const addComment = async (request, response) => {
  const { recipeId, userId, text } = request.body

  try {
    const userIdObject = new mongoose.Types.ObjectId(userId)
    const currentUser = await User.findById(userIdObject)

    // If either user is not found, return a 404 response with an error message
    if (!currentUser) {
      return response.status(404).json({ error: 'UserId not found' })
    }

    // Create a new comment document
    const newComment = new Comment({
      user: userIdObject,
      text,
    })

    // Save the comment in the database
    await newComment.save()

    // Find the corresponding recipe and push the comment to its comments array
    const recipe = await Recipe.findOne({ recipeId })
    recipe.comments.push(newComment._id)
    await recipe.save()

    response.status(201).json({ message: 'Comment added successfully' })
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Failed to add the comment' })
  }
}

// Delete a comment
const deleteComment = async (request, response) => {
  const { userId, commentId } = request.body

  try {
    // Find the comment to be deleted
    const comment = await Comment.findById(commentId)
    if (!comment) {
      return response.status(404).json({ error: 'Comment not found' })
    }

    const userIdObject = new mongoose.Types.ObjectId(userId)
    if (!comment.user.equals(userIdObject)) {
      return response.status(404).json({ error: 'Deleting comment is not allowed' })
    }

    // Recursive function to delete comment and its replies
    const deleteCommentAndReplies = async (commentId) => {
      // Find the comment to be deleted
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
    }

    // Start recursive deletion
    await deleteCommentAndReplies(commentId)

    response.status(200).json({ message: 'Comment deleted successfully' })
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Failed to delete the comment' })
  }
}

// Recursive function to populate replies at each level of nesting
const populateReplies = async (comment) => {
  if (comment.replies.length === 0) {
    return comment
  }

  const populatedReplies = await Comment.populate(comment, {
    path: 'replies',
    populate: {
      path: 'replies',
      model: 'Comment',
    },
  })

  for (const reply of populatedReplies.replies) {
    await populateReplies(reply)
  }

  return populatedReplies
}


// Get all comments for a specific recipe, including replies
const getCommentsForRecipe = async (req, res) => {
  const { recipeId } = req.query

  try {
    // Find the recipe and populate the comments with the actual comment documents, including replies
    const recipe = await Recipe.findOne({ recipeId }).populate('comments')

    if (!recipe) {
      return res.status(204).json({ error: 'Recipe/comments not found' })
    }

    // Populate the replies at each level of nesting
    const populatedComments = await Promise.all(
      recipe.comments.map(async (comment) => await populateReplies(comment))
    )

    // Return the comments for the recipe (including replies)
    res.status(200).json(populatedComments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to get comments for the recipe' })
  }
}

// Comment on a specific comment (reply to a comment)
const addReply = async (req, res) => {
  const { commentId, userId, text } = req.body

  try {
    // Find the parent comment to which the reply will be added
    const parentComment = await Comment.findById(commentId)
    if (!parentComment) {
      return res.status(404).json({ error: 'Parent comment not found' })
    }

    // Create a new comment document for the reply
    const newReply = new Comment({
      user: userId,
      text,
    })

    // Save the reply in the database
    await newReply.save()

    // Add the reply's _id to the parent comment's replies array
    parentComment.replies.push(newReply._id)
    await parentComment.save()

    res.status(201).json({ message: 'Reply added successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to add the reply' })
  }
}

// Like a comment
const likeComment = async (req, res) => {
  const { commentId, userId } = req.body

  try {
    // Find the comment to be liked
    const comment = await Comment.findById(commentId)

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    // Check if the user has already liked the comment
    if (comment.likes.includes(userId)) {
      return res.status(400).json({ error: 'You have already liked this comment' })
    }

    // Add the user's _id to the likes array
    comment.likes.push(userId)
    await comment.save()

    res.status(200).json({ message: 'Comment liked successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to like the comment' })
  }
}

// RemoveLike
const removeLikeComment = async (req, res) => {
  const { commentId, userId } = req.body

  try {
    // Find the comment to be liked
    const comment = await Comment.findById(commentId)

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    // Check if the user has not liked the comment
    if (!comment.likes.includes(userId)) {
      return res.status(400).json({ error: 'You have not liked this comment' })
    }

    // Add the user's _id to the likes array
    comment.likes = comment.likes.filter((like) => !like.equals(userId))
    await comment.save()

    res.status(200).json({ message: 'Like removed successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to remove like' })
  }
}

// Dislike a comment
const dislikeComment = async (req, res) => {
  const { commentId, userId } = req.body

  try {
    // Find the comment to be disliked
    const comment = await Comment.findById(commentId)

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    // Check if the user has already disliked the comment
    if (comment.dislikes.includes(userId)) {
      return res.status(400).json({ error: 'You have already disliked this comment' })
    }

    // Add the user's _id to the dislikes array
    comment.dislikes.push(userId)
    await comment.save()

    res.status(200).json({ message: 'Comment disliked successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to dislike the comment' })
  }
}

// Remove dislike
const removeDislikeComment = async (req, res) => {
  const { commentId, userId } = req.body

  try {
    // Find the comment to be disliked
    const comment = await Comment.findById(commentId)

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    // Check if the user has not disliked the comment
    if (!comment.dislikes.includes(userId)) {
      return res.status(400).json({ error: 'You have not disliked this comment' })
    }

    // Add the user's _id to the likes array
    comment.dislikes = comment.dislikes.filter((dislike) => !dislike.equals(userId))
    await comment.save()

    res.status(200).json({ message: 'Dislike removed successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to remove dislike' })
  }
}

const editComment = async (req, res) => {
  const { userId, commentId, text } = req.body

  try {
    // Find the comment to be edited
    const comment = await Comment.findById(commentId)

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    const userIdObject = new mongoose.Types.ObjectId(userId)
    if (!comment.user.equals(userIdObject)) {
      return res.status(404).json({ error: 'Editing comment is not allowed' })
    }

    // Update the comment text
    comment.text = text
    await comment.save()

    res.status(200).json({ message: 'Comment edited successfully', updatedComment: comment })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to edit the comment' })
  }
}

export default { addComment, deleteComment, getCommentsForRecipe, addReply, likeComment, removeLikeComment, dislikeComment, removeDislikeComment, editComment }