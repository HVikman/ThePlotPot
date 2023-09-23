import React from 'react'
import { Container, Alert, Button } from 'react-bootstrap'

const ErrorComponent = ({ message, onRetry }) => {
  return (
    <Container className="mt-5">
      <Alert variant="danger">
        <Alert.Heading>Oh snap! An error occurred.</Alert.Heading>
        <p>{message || 'Something went wrong. Please try again later.'}</p>
        {onRetry && <Button variant="primary" onClick={onRetry}>Retry</Button>}
      </Alert>
    </Container>
  )
}

export default ErrorComponent