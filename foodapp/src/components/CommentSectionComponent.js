import React from 'react'
import { useState } from 'react'

import { Typography, Grid, Card, CardContent, Button, InputAdornment, OutlinedInput, IconButton, CardActions, Avatar } from '@mui/material'
import { useAddCommentMutation, useDeleteCommentMutation, useGetCommentsForRecipeQuery, useAddReplyMutation,
  useLikeCommentMutation, useRemoveLikeCommentMutation, useDislikeCommentMutation, useRemoveDislikeCommentMutation, useEditCommentMutation } from '../services/commentSlice'
import { useCreateInteractionMutation } from '../services/interactionSlice'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Link } from 'react-router-dom'
import WarningDialog from '../dialogs/WarningDialog'
import formatFinnishDate from '../helpers/formatFinnishDate'

const CommentSection = ({ recipeId, userId , interactionData, label, image }) => {
  const { data: commentData, isLoading, isError, refetch } = useGetCommentsForRecipeQuery({ recipeId }, { refetchOnMountOrArgChange: true })
  const [addComment] = useAddCommentMutation()
  const [userComment, setUserComment] = useState('')
  const [ createInteraction ] = useCreateInteractionMutation()
  const [openWarningDialog, setOpenWarningDialog] = useState(false)

  const handleSubmitComment = async () => {
    if (!userId) {
      setOpenWarningDialog(true)
      return
    }

    if (userComment.trim() !== '') {
      console.log(interactionData)
      if(!interactionData) {
        try {
          await createInteraction({ recipeId, label, image })
          console.log('create')
        } catch (error) {
          console.error('Failed to create interaction: ', error)
        }
      }

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
    const [ addReply ] = useAddReplyMutation()
    const [ likeComment ] = useLikeCommentMutation()
    const [ removeLikeComment ] = useRemoveLikeCommentMutation()
    const [ dislikeComment ] = useDislikeCommentMutation()
    const [ removeDislikeComment ] = useRemoveDislikeCommentMutation()
    const [ editComment ] = useEditCommentMutation()
    const [ deleteComment ] = useDeleteCommentMutation()

    const CommentCard = ({ comment }) => {
      console.log(comment)
      const formattedDate = formatFinnishDate(comment.createdAt)
      const [showReply, setShowReply] = useState(false)
      const [showEdit, setShowEdit] = useState(false)
      const [reply, setReply] = useState('')
      const [edit, setEdit] = useState('')
      const isLiked = Boolean(comment.likes.includes(userId))
      const isDisliked = Boolean(comment.dislikes.includes(userId))

      const handleReplyToggle = () => {
        if (!userId) {
          setOpenWarningDialog(true)
          return
        }

        setShowReply((state) => !state)
        setReply('')
      }

      const handleSubmitReply = async (commentId) => {
        try {
          console.log('Reply:', reply)
          await addReply({ recipeId, commentId, userId, text: reply })
          setReply('')
          setShowReply(false)
          refetch()
        } catch (error) {
          console.error('Adding reply failed: ', error)
        }
      }

      const handleLike = async (commentId) => {
        console.log(commentId)
        if (!userId) {
          setOpenWarningDialog(true)
          return
        }

        if (!isLiked) {
          try {
            await likeComment({ commentId, userId })

            //if comment was disliked, remove it from dislikes
            if (isDisliked) {
              try {
                await removeDislikeComment({ commentId, userId })
              } catch (error) {
                console.error('Failed to remove dislike: ', error)
              }
            }
          } catch (error) {
            console.error('Failed to add like: ', error)
          }
        }

        if (isLiked){
          try {
            await removeLikeComment({ commentId, userId })
          } catch (error) {
            console.error('Failed to remove like: ', error)
          }
        }
        refetch()
      }

      const handleDislike = async (commentId) => {
        console.log(commentId)
        if (!userId) {
          setOpenWarningDialog(true)
          return
        }

        if(!interactionData){
          try {
            await createInteraction({ commentId })
            console.log('create')
          } catch (error) {
            console.error('Failed to create interaction: ', error)
          }
        }

        if (!isDisliked) {
          try {
            await dislikeComment({ commentId, userId })

            // If the comment was liked, remove it from likes
            if (isLiked) {
              try {
                await removeLikeComment({ commentId, userId })
              } catch (error) {
                console.error('Failed to remove like: ', error)
              }
            }
          } catch (error) {
            console.error('Failed to add dislike: ', error)
          }
        }

        if (isDisliked){
          try {
            await removeDislikeComment({ commentId, userId })
          } catch (error) {
            console.error('Failed to remove dislike: ', error)
          }
        }
        refetch()
      }

      const toggleEdit = () => {
        setShowEdit((state) => !state)
      }

      const handleEdit = async (commentId) => {
        try {
          await editComment({ userId, commentId, text: edit })
          setEdit('')
          refetch()
        } catch (error) {
          console.error('Failed to edit comment: ', error)
        }
      }

      const handleDelete = async (commentId) => {
        try {
          console.log(userId)
          await deleteComment({ userId, commentId })
          refetch()
        } catch (error) {
          console.error('Failed to delete comment: ', error)
        }
      }

      return (
        <>
          <Card variant="outlined" style={{ marginBottom: '8px' }}>
            <CardContent>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={10}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Avatar src={comment?.user?.profileImage || `https://eu.ui-avatars.com/api/?name=${comment?.user?.username}&size=200`} alt={comment?.user?.name} />
                    </Grid>
                    <Grid item>
                      <Link to={`/users/${comment.user?.id}`} style={{
                        textDecoration: 'none', color: 'black',
                      }}><Typography variant="body1" fontWeight="bold">
                          {comment.user?.name}
                        </Typography></Link>
                      <Typography variant="body2" color="textSecondary">
                        @{comment.user?.username} - {formattedDate}
                      </Typography>
                      <Typography variant="body1">
                        {comment.text}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                {comment.user?.id === userId && (
                  <Grid item>
                    <IconButton onClick={() => toggleEdit()} aria-label="Edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(comment._id)} aria-label="Delete">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </CardContent>
            <CardActions disableSpacing>
              <Grid container alignItems="center" justifyContent="flex-end">
                <Grid item>
                  <IconButton onClick={() => handleLike(comment._id)} aria-label="Like">
                    {isLiked ? <ThumbUpIcon color="primary" /> : <ThumbUpOffAltIcon />}
                  </IconButton>
                  <Typography variant="body2" style={{ marginRight: '8px' }}>
                    {comment.likes ? comment.likes.length : 0}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => handleDislike(comment._id)} aria-label="Dislike">
                    {isDisliked ? <ThumbDownIcon color="error" /> : <ThumbDownOffAltIcon />}
                  </IconButton>
                  <Typography variant="body2" style={{ marginRight: '8px' }}>
                    {comment.dislikes ? comment.dislikes.length : 0}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button color="primary" onClick={handleReplyToggle}>
                    {showReply ? 'Cancel' : 'Reply'}
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
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
              style={{ marginBottom: '8px' }}
            />
          )}
          {showEdit && (
            <OutlinedInput
              multiline
              fullWidth
              placeholder="Edit comment"
              value={edit}
              onChange={(event) => setEdit(event.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <Button variant="contained" color="primary" onClick={() => handleEdit(comment._id)}>
                    Submit
                  </Button>
                </InputAdornment>
              }
              style={{ marginBottom: '8px' }}
            />
          )}
        </>
      )
    }

    const renderReplies = (replies, level) => {
      console.log(replies)
      return (
        <div className="reply-box">
          {replies.map((reply) => {
            console.log(reply)
            return(
              <div key={reply._id} style={{ marginLeft: `${level * 20}px` }}>
                <CommentCard comment={reply} />
                {reply.replies.length > 0 && renderReplies(reply.replies, level + 1)}
              </div>
            )})}
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
            <WarningDialog open={openWarningDialog} onClose={() => setOpenWarningDialog(false)} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CommentSection