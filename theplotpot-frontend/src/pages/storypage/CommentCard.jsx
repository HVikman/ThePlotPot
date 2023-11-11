import React from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { DELETE_COMMENT } from '../../api/queries'
import { useNotifications } from '../../components/NotificationsContext'

const CommentCard = ({ comment, user, deleteComment }) => {
  const { addNotification } = useNotifications()
  const [delComment] = useMutation(DELETE_COMMENT)

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
    <Card className="mt-3">
      <Card.Body>
        <Row>
          <Col xs={3} md={1}>
            <img
              src={`https://www.gravatar.com/avatar/${comment.user.email}?s=400&d=robohash`}
              className="img-fluid rounded-circle"
              alt="User Gravatar"
            />
          </Col>
          <Col xs={8} md={10}>
            <Card.Title><Link style={{ color: 'inherit', textDecoration: 'inherit' }} to={`/user/${comment.user.id}`}>{comment.user.username}</Link></Card.Title>
            <Card.Text>{comment.content}</Card.Text>
          </Col>
          <Col xs={1} md={1} className="d-flex align-items-start justify-content-end">
            {user && (
              <>
                {user.id === comment.user.id && (
                  <Popconfirm
                    title="Delete your comment?"
                    description="Are you sure you want to delete your comment?"
                    onConfirm={confirm}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button variant="danger">Delete</Button>
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
                    <Button variant="warning">Admin Delete</Button>
                  </Popconfirm>
                )}
              </>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default CommentCard
