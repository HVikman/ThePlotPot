import { useState } from 'react'
import CommentCard from './CommentCard'
import AddCommentForm from './AddComment'
import { useAuth } from '../../context/AuthContext'
import { useDarkMode } from '../../context/DarkModeContext'
import { Link } from 'react-router-dom'
import './StoryPage.css'
const Comments = ({ comments: initialComments, chapterId }) => {
  const { user } = useAuth()
  const { isDarkMode } = useDarkMode()
  const isAuthenticated = !!user
  const [comments, setComments] = useState(initialComments)

  const addNewComment = (newComment) => {
    setComments(prevComments => [...prevComments, newComment])
  }
  const deleteComment = (commentId) => {
    setComments(prevComments => prevComments.filter(comment => comment.id !== commentId))
  }

  return (
    <section id="comments" className="comments-section">
      <div className={`comments-panel ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="comments-panel__header">
          <h2>Discussion</h2>
          <p>Share your reactions, theories, and favorite moments with the community.</p>
        </div>

        <div className="comments-panel__list">
          {comments && comments.length > 0 ? (
            comments.map(comment => (
              <CommentCard key={comment.id} comment={comment} user={user} deleteComment={deleteComment} />
            ))
          ) : (
            <p className="comments-panel__empty">
              {isAuthenticated ? (
                'No comments yet — be the first to respond!'
              ) : (
                <>
                  No comments yet.{' '}
                  <Link to="/login">Log in</Link> or <Link to="/signup">join</Link> to add one.
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {isAuthenticated && (
        <AddCommentForm chapterId={chapterId} addNewComment={addNewComment} />
      )}
    </section>
  )
}


export default Comments
