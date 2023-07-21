import React from 'react'
import { useState } from 'react'
import { Typography, Grid, Card, CardContent, Button, InputAdornment, OutlinedInput } from '@mui/material'
import { /*useAddCommentMutation, useDeleteCommentMutation, */ useGetCommentsForRecipeQuery, /* useAddReplyMutation*/ } from '../services/commentSlice'

const CommentSection = ({ recipeId }) => {
  const { data: commentData, isLoading, isError } = useGetCommentsForRecipeQuery({ recipeId })
  const [userComment, setUserComment] = useState('')
  const [comments, setComments] = useState([])

  const handleSubmitComment = () => {
    if (userComment.trim() !== '') {
      setComments([...comments, userComment])
      setUserComment('')
    }
  }

  return (
    <Grid container spacing={2} paddingTop={2}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Comments:</Typography>
            <br></br>
            {!isLoading && !isError && commentData && commentData.length > 0 ? (
              commentData.map((comment) => <CommentComponent key={comment._id} comment={comment} />)
            ) : (
              <Typography>No comments found.</Typography>
            )}
            {comments.map((comment, index) => (
              <Typography
                key={index}
                variant="body1"
                style={{
                  border: '1px solid #bdbdbd',
                  borderRadius: '4px',
                  padding: '10px 14px', // Adjust padding to match the OutlinedInput
                  marginBottom: '8px',
                  minHeight: '38px',
                  height: 'auto',
                  display: 'flex', // To center the text vertically
                  alignItems: 'center',
                  wordWrap: 'break-word',
                }}
              >
                {comment}
              </Typography>
            ))}
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

const CommentComponent = ({ comment, indentLevel = 0 }) => {
  const renderReplies = (replies, level) => {
    return (
      <div className="reply-box">
        {replies.map((reply) => (
          <div key={reply._id} style={{ marginLeft: `${level * 20}px` }}>
            <Typography
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
              }}
            >
              {reply.text} {reply.createdAt} {reply.user}
            </Typography>
            {reply.replies.length > 0 && renderReplies(reply.replies, level + 1)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <Typography
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
      </Typography>
      {comment.replies.length > 0 && renderReplies(comment.replies, indentLevel + 1)}
    </div>
  )
}

export default CommentSection