import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@apollo/client'
import { Container, Form, Button, Alert, InputGroup, Spinner } from 'react-bootstrap'
import { REQUEST_PASSWORD_RESET_MUTATION } from '../../api/queries'
import { useNotifications } from '../../context/NotificationsContext'
import { useDarkMode } from '../../context/DarkModeContext'
import { useLoadReCaptcha } from '../../hooks/useLoadReCaptcha'
import { executeRecaptcha } from '../../utils/executeRecaptcha'
const RequestPasswordResetSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
})
const siteKey = process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY
const RequestPasswordReset = () => {
  useLoadReCaptcha()
  const { addNotification } = useNotifications()
  const { isDarkMode } = useDarkMode()
  const [submissionResult, setSubmissionResult] = useState(null)
  const [requestPasswordReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET_MUTATION, {
    onCompleted: ({ requestPasswordReset }) => {
      if (!requestPasswordReset) {
        setSubmissionResult({ success: false, message: 'Unexpected response from server.' })
        return
      }
      setSubmissionResult(requestPasswordReset)
      addNotification(requestPasswordReset.message)
    },
    onError: (error) => {
      setSubmissionResult({ success: false, message: error.message })
      addNotification(`Something went wrong: ${error.message}`, 3000, 'error')
    },
  })
  const formik = useFormik({
    initialValues: {
      email: '',
      honeypot: '',
    },
    validationSchema: RequestPasswordResetSchema,
    onSubmit: async (values) => {
      if (values.honeypot) {
        return
      }
      let captchaToken = null
      if (siteKey) {
        try {
          captchaToken = await executeRecaptcha()
        } catch (error) {
          console.error('reCAPTCHA verification failed:', error)
          addNotification('Failed to verify you are human. Please try again.', 3000, 'error')
          return
        }
      }
      await requestPasswordReset({
        variables: {
          email: values.email,
          token: captchaToken,
        },
      })
    },
  })
  return (
    <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
      <Form onSubmit={formik.handleSubmit} className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <h2 className="mb-4">Forgot Password</h2>
        <Form.Group controlId="resetEmail" className="mt-2 custom-form">
          <Form.Label>Email address</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text>@</InputGroup.Text>
            <Form.Control
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.email && formik.errors.email}
              placeholder="Enter your account email"
            />
            <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Control style={{ display: 'none' }} name="honeypot" onChange={formik.handleChange} value={formik.values.honeypot} />
        <Button variant="secondary" type="submit" className="mt-2" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </Form>
      {submissionResult && (
        <Alert variant={submissionResult.success ? 'success' : 'danger'} className="mt-3">
          {submissionResult.message}
        </Alert>
      )}
    </Container>
  )
}
export default RequestPasswordReset