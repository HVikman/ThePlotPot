import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@apollo/client'
import { SIGNUP_MUTATION } from '../../api/queries'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Form, Button, Container, Alert } from 'react-bootstrap'

const SignupSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const Signup = () => {
  const [signup, { error }] = useMutation(SIGNUP_MUTATION)
  const { user } = useAuth()
  const isAuthenticated = !!user
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      const response = await signup({ variables: values })
      console.log(response)
      navigate('/login')
    },
  })
  if(isAuthenticated){navigate('/'); return <p>You are already logged in.</p>}
  return (
    <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.username && formik.errors.username}
            placeholder="Username"
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.username}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.email && formik.errors.email}
            placeholder="Enter email"
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.password && formik.errors.password}
            placeholder="Password"
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
        Signup
        </Button>
      </Form>
      {/* Handle any error messages here */}
      {error && <Alert variant="danger" className="mt-3">{error.message}</Alert>}
    </Container>
  )
}

export default Signup