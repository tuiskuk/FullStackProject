import React from 'react'
import { useState } from 'react'
import { Typography, Grid, Card, CardContent, Button, InputAdornment, OutlinedInput } from '@mui/material'
import { useAddCommentMutation, /*useDeleteCommentMutation, */ useGetCommentsForRecipeQuery, useAddReplyMutation } from '../services/commentSlice'

const CommentSection = ({ recipeId, userId }) => {
  const { data: commentData, isLoading, isError, refetch } = useGetCommentsForRecipeQuery({ recipeId }, { refetchOnMountOrArgChange: true })
  const [addComment] = useAddCommentMutation()
  const [userComment, setUserComment] = useState('')

  const handleSubmitComment = async () => {
    if (userComment.trim() !== '') {
      try {
        await addComment({ recipeId, userId, text: userComment })
        setUserComment('')
        refetch()
      } catch (error) {
        console.error('Adding comment failed: ', error)
      }
    }
  }
  const CommentComponent = ({ comment, indentLevel = 0, userId }) => {
    const [addReply] = useAddReplyMutation()

    const CommentCard = ({ comment }) => {
      const [showReply, setShowReply] = useState(false)
      const [reply, setReply] = useState('')

      const handleReplyToggle = () => {
        setShowReply((state) => !state)
        setReply('')
      }

      const handleSubmitReply = async (commentId) => {
        try {
          console.log('Reply:', reply)
          await addReply({ commentId, userId, text: reply })
          setReply('')
          setShowReply(false)
          refetch()
        } catch (error) {
          console.error('Adding reply failed: ', error)
        }
      }

      return (
        <>
          <Typography
            key={comment._id}
            variant="body1"
            style={{
              border: '1px solid #bdbdbd',
              borderRadius: '4px',
              padding: '10px 14px',
              marginBottom: '8px',
              minHeight: '38px',
              height: 'auto',
              display: 'flex',
              alignItems: 'center',
              wordWrap: 'break-word',
              marginLeft: `${indentLevel * 20}px`,
            }}
          >
            {comment.text} {comment.createdAt} {comment.user}
            <Button color="primary" onClick={handleReplyToggle}>
              {showReply ? 'Cancel' : 'Reply'}
            </Button>
          </Typography>
          {showReply && (
            <OutlinedInput
              multiline
              fullWidth
              placeholder="Add your reply"
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <Button variant="contained" color="primary" onClick={() => handleSubmitReply(comment._id)}>
                    Submit
                  </Button>
                </InputAdornment>
              }
            />
          )}
        </>
      )
    }

    const renderReplies = (replies, level) => {
      return (
        <div className="reply-box">
          {replies.map((reply) => (
            <div key={reply._id} style={{ marginLeft: `${level * 20}px` }}>
              <CommentCard comment={reply} />
              {reply.replies.length > 0 && renderReplies(reply.replies, level + 1)}
            </div>
          ))}
        </div>
      )
    }

    return (
      <div>
        <CommentCard comment={comment} />
        {comment.replies.length > 0 && renderReplies(comment.replies, indentLevel + 1)}
      </div>
    )
  }

  return (
    <Grid container spacing={2} paddingTop={2}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Comments:</Typography>
            <br></br>
            {!isLoading && !isError && commentData && commentData.length > 0 ? (
              commentData.map((comment) => <CommentComponent key={comment._id} comment={comment} userId={userId}/>)
            ) : (
              <Typography>No comments found.</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Comment recipe</Typography>
            <br></br>
            <OutlinedInput
              multiline
              fullWidth
              placeholder="Add your comment"
              value={userComment}
              onChange={(event) => setUserComment(event.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitComment}
                  >
                    Add
                  </Button>
                </InputAdornment>
              }
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CommentSection