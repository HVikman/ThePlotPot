import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@apollo/client'
import { Container, Form, Button, Alert, InputGroup, Spinner } from 'react-bootstrap'
import { RESET_PASSWORD_MUTATION } from '../../api/queries'
import { useNotifications } from '../../context/NotificationsContext'
import { useDarkMode } from '../../context/DarkModeContext'
const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm your new password'),
})
const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  const { isDarkMode } = useDarkMode()
  const [tokenError, setTokenError] = useState('')
  const [resetResult, setResetResult] = useState(null)
  const token = useMemo(() => new URLSearchParams(location.search).get('token'), [location.search])
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION, {
    onCompleted: ({ resetPassword }) => {
      if (!resetPassword) {
        setResetResult({ success: false, message: 'Unexpected response from server.' })
        return
      }
      setResetResult(resetPassword)
      addNotification(resetPassword.message)
      if (resetPassword.success) {
        setTimeout(() => navigate('/login'), 1500)
      }
    },
    onError: (error) => {
      setResetResult({ success: false, message: error.message })
      addNotification(`Something went wrong: ${error.message}`, 3000, 'error')
    },
  })
  useEffect(() => {
    if (!token) {
      setTokenError('Password reset token is missing. Please use the link from your email.')
    }
  }, [token])
  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      if (!token) {
        return
      }
      await resetPassword({
        variables: {
          token,
          newPassword: values.newPassword,
        },
      })
    },
  })
  return (
    <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
      <Form onSubmit={formik.handleSubmit} className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <h2 className="mb-4">Reset Password</h2>
        {tokenError && <Alert variant="danger">{tokenError}</Alert>}
        <Form.Group controlId="newPassword" className="mt-2 custom-form">
          <Form.Label>New password</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type="password"
              name="newPassword"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.newPassword && formik.errors.newPassword}
              placeholder="Enter new password"
              disabled={!!tokenError}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.newPassword}</Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="confirmPassword" className="mt-2 custom-form">
          <Form.Label>Confirm password</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
              placeholder="Confirm new password"
              disabled={!!tokenError}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.confirmPassword}</Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Button variant="secondary" type="submit" className="mt-2" disabled={loading || !!tokenError}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Updating...
            </>
          ) : (
            'Update Password'
          )}
        </Button>
      </Form>
      {resetResult && (
        <Alert variant={resetResult.success ? 'success' : 'danger'} className="mt-3">
          {resetResult.message}
        </Alert>
      )}
    </Container>
  )
}
export default ResetPassword