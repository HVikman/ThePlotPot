import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@apollo/client'
import { LOGIN_MUTATION } from '../../api/queries'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Form, Button, Container, Alert } from 'react-bootstrap'
import { useNotifications } from '../../components/NotificationsContext'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
})

const Login = () => {
  const { addNotification } = useNotifications()
  const [loginError, setLoginError] = useState(null)
  const { user, setUser } = useAuth()
  const isAuthenticated = !!user
  const navigate = useNavigate()
  const [login] = useMutation(LOGIN_MUTATION, {
    update: (cache, { data }) => {
      if (data.login.success) {
        setUser(data.login.user)
        addNotification(`Welcome back ${data.login.user.username}`)
        navigate('/')
      } else {
        setLoginError('Wrong username/password.')
      }
    },
    onError: (error) => {
      addNotification(`Something went wrong: ${error}`,2000,'error')
    },
  })


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      login({ variables: values })
    },
  })
  if(isAuthenticated){navigate('/'); return <p>You are already logged in.</p>}
  return (
    <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group controlId="formBasicEmail" className='mt-2'>
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

        <Form.Group controlId="formBasicPassword" className='mt-4'>
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

        <Button variant="secondary" className='mt-2' type="submit">
          Login
        </Button>
      </Form>
      {loginError && <Alert variant="danger" className="mt-3">{loginError}</Alert>}
    </Container>
  )
}

export default Login
