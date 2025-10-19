import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@apollo/client'
import { SIGNUP_MUTATION } from '../../api/queries'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Form, Button, Container, Alert, InputGroup } from 'react-bootstrap'
import { useNotifications } from '../../context/NotificationsContext'
import { PersonFill, KeyFill } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import { useDarkMode } from '../../context/DarkModeContext'
import { useLoadReCaptcha } from '../../hooks/useLoadReCaptcha'
import { executeRecaptcha } from '../../utils/executeRecaptcha'

const SignupSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const siteKey = process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY

const Signup = () => {
  useLoadReCaptcha()
  const { isDarkMode } = useDarkMode()
  const { addNotification } = useNotifications()
  const [signupError, setSignupError] = useState(null)
  const [signup] = useMutation(SIGNUP_MUTATION, {
    update: (cache, { data }) => {
      if (data.createUser.success) {
        addNotification(`Signup successful: ${data.createUser.user.username}`)
        setUser(data.createUser.user)
        navigate('/')
      } else {
        setSignupError(data.createUser.message)
      }
    },
    onError: (error) => {
      addNotification(`Something went wrong: ${error}`,2000,'error')
    }
  })
  const { user, setUser } = useAuth()
  const isAuthenticated = !!user
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      honeypot: ''
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      if (values.honeypot) {
        console.log('Bot detected')
        return
      }

      let token = null
      if (siteKey){
        try {
          token = await executeRecaptcha()
        } catch (error) {
          console.error('reCAPTCHA verification failed:', error)
          addNotification('Failed to verify you are human. Please try again.', 3000, 'error')
          return
        }}

      try {
        await signup({
          variables: {
            ...values,
            token,
          }
        })
      } catch (error) {
        console.error('Signup failed:', error)
        addNotification?.(error.message || 'Signup failed. Try again.', 3000, 'error')
      }
    },
  })
  if(isAuthenticated){navigate('/'); return <p>You are already logged in.</p>}
  return (
    <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
      <Form onSubmit={formik.handleSubmit} className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <Form.Group controlId="formBasicUsername" className='mt-4 custom-form'>
          <Form.Label>Username</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text ><PersonFill /></InputGroup.Text>
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
          </InputGroup>

        </Form.Group>


        <Form.Group controlId="formBasicEmail" className='mt-4 custom-form'>
          <Form.Label>Email address</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text >@</InputGroup.Text>
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
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className='mt-4 custom-form'>
          <Form.Label>Password</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text ><KeyFill /></InputGroup.Text>
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
          </InputGroup>
        </Form.Group>
        <Form.Control style={{ display: 'none' }} name="honeypot" onChange={formik.handleChange} value={formik.values.honeypot} />
        <Button variant="secondary" className='mt-2' type="submit">
        Signup
        </Button>
      </Form>
      {signupError && <Alert variant="danger" className="mt-3">{signupError}</Alert>}
      <div className="mt-3">
        Already registered? <Link to="/login">Log in here</Link>
      </div>
    </Container>
  )
}

export default Signup