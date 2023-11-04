import { useState } from 'react'
import { Container } from 'react-bootstrap'
import CommentCard from './CommentCard'
import AddCommentForm from './AddComment'
import { useAuth } from '../auth/AuthContext'

const Comments = ({ comments: initialComments, chapterId }) => {
  const { user } = useAuth()
  const isAuthenticated = !!user
  const [comments, setComments] = useState(initialComments)

  const addNewComment = (newComment) => {
    setComments(prevComments => [...prevComments, newComment])
  }
  const deleteComment = (commentId) => {
    setComments(prevComments => prevComments.filter(comment => comment.id !== commentId))
  }

  return (

    <Container fluid className='my-4 py-2'>
      <h1>Comments</h1>
      {}
      {comments && comments.length > 0 ? comments.map(comment => (
        <CommentCard key={comment.id} comment={comment} user={user} deleteComment={deleteComment} />
      )): <p>No comments yet, be first to comment!</p>}{isAuthenticated && <AddCommentForm chapterId={chapterId} addNewComment={addNewComment} />}
    </Container>
  )
}

export default Comments
