import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { DELETE_COMMENT } from '../../api/queries'
import { useNotifications } from '../../context/NotificationsContext'
import { useDarkMode } from '../../context/DarkModeContext'

const CommentCard = ({ comment, user, deleteComment }) => {
  const { addNotification } = useNotifications()
  const [delComment] = useMutation(DELETE_COMMENT)
  const { isDarkMode } = useDarkMode()
  const confirm = async () => {
    try {
      const { data } = await delComment({
        variables: {
          commentId: comment.id
        }
      })
      console.log(data)
      deleteComment(comment.id)
      addNotification('Comment deleted successfully!', 3000, 'success')
    } catch (error) {
      console.error('There was an error deleting the comment:', error)
      addNotification(error.message, 3000, 'error')
    }
  }


  return (
    <Card className={`comment-card ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="comment-card__body">
        <div className="comment-card__avatar">
          <img
            src={`https://www.gravatar.com/avatar/${comment.user.email}?s=400&d=robohash`}
            alt="User Gravatar"
          />
        </div>
        <div className="comment-card__main">
          <div className="comment-card__header">
            <Card.Title className="mb-0">
              <Link to={`/user/${comment.user.id}`}>{comment.user.username}</Link>
            </Card.Title>
            {user && (
              <div className="comment-card__actions">
                {user.id === comment.user.id && (
                  <Popconfirm
                    title="Delete your comment?"
                    description="Are you sure you want to delete your comment?"
                    onConfirm={confirm}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button variant="outline-danger" size="sm">Delete</Button>
                  </Popconfirm>
                )}

                {user.has_superpowers && (
                  <Popconfirm
                    title="Admin Delete"
                    description="Are you sure you want to delete this user's comment as an admin?"
                    onConfirm={confirm}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button variant="outline-warning" size="sm">Admin delete</Button>
                  </Popconfirm>
                )}
              </div>
            )}
          </div>

          <p className="comment-card__content">{comment.content}</p>
        </div>
      </div>
    </Card>
  )
}


export default CommentCard
