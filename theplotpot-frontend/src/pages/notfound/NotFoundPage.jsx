import React from 'react'
import { Container, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import './NotFoundPage.css'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <Container className="text-center mt-5 textcontainer">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist. It might have been moved or deleted.</p>
      <Button variant="secondary" onClick={() => navigate('/')}>
        Go to Homepage
      </Button>
    </Container>
  )
}

export default NotFoundPage