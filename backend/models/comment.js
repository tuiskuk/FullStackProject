import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  recipeId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  ],
  // Add a field to store nested comments (replies)
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    }
  ]
})

export const Comment = mongoose.model('Comment', commentSchema)
