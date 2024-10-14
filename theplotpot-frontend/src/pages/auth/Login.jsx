import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@apollo/client'
import { LOGIN_MUTATION } from '../../api/queries'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Form, Button, Container, Alert, InputGroup } from 'react-bootstrap'
import { useNotifications } from '../../context/NotificationsContext'
import { Link } from 'react-router-dom'
import { KeyFill } from 'react-bootstrap-icons'
import { useDarkMode } from '../../context/DarkModeContext'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
})

const Login = () => {
  const { isDarkMode } = useDarkMode()
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
        console.log(data.login)
        setLoginError(data.login.message)
      }
    },
    onError: (error) => {
      addNotification(`Something went wrong: ${error.message}`,2000,'error')
    },
  })


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      honeypot: ''
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      if (values.honeypot) {
        console.log('Bot detected')
        return
      }
      login({ variables: values })
    },
  })
  if(isAuthenticated){navigate('/'); return <p>You are already logged in.</p>}
  return (
    <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
      <Form onSubmit={formik.handleSubmit} className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <Form.Group controlId="formBasicEmail" className='mt-2 custom-form'>
          <Form.Label>Email address</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              @
            </InputGroup.Text>
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
            <InputGroup.Text>
              <KeyFill /> {/* Icon for the password field */}
            </InputGroup.Text>
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
          Login
        </Button>
      </Form>
      {loginError && <Alert variant="danger" className="mt-3">{loginError}</Alert>}
      <div className="mt-3">
        No account yet? <Link to="/signup">Sign up here</Link>
      </div>
    </Container>
  )
}

export default Login
