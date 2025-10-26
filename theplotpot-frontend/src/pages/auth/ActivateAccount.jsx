import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { Container, Spinner, Alert, Button } from 'react-bootstrap'
import { ACTIVATE_ACCOUNT_MUTATION } from '../../api/queries'
import { useNotifications } from '../../context/NotificationsContext'
import { useAuth } from '../../context/AuthContext'
import { useDarkMode } from '../../context/DarkModeContext'


function ActivateAccount() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  const { refreshUser } = useAuth()
  const { isDarkMode } = useDarkMode()
  const [activationResult, setActivationResult] = useState(null)
  const [tokenError, setTokenError] = useState('')
  const [activateAccount, { loading }] = useMutation(ACTIVATE_ACCOUNT_MUTATION, {
    onCompleted: async ({ activateAccount }) => {
      if (!activateAccount) {
        setActivationResult({ success: false, message: 'Unexpected response from server.' })
        return
      }
      if (activateAccount.success) {
        setActivationResult({ success: true, message: activateAccount.message })
        addNotification(activateAccount.message)
        try {
          await refreshUser?.()
        } catch (error) {
          console.error('Failed to refresh user after activation:', error)
        }
      } else {
        setActivationResult({ success: false, message: activateAccount.message })
      }
    },
    onError: (error) => {
      setActivationResult({ success: false, message: error.message })
    },
  })

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    if (!token) {
      setTokenError('Activation token is missing. Please use the link from your email.')
      return
    }
    activateAccount({ variables: { token } })
  }, [location.search, activateAccount])
  return (
    <Container style={{ maxWidth: '500px', marginTop: '50px' }} className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <h2 className="mb-4">Activate Account</h2>
      {loading && (
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" role="status" />
          <span>Activating your account...</span>
        </div>
      )}
      {tokenError && <Alert variant="danger">{tokenError}</Alert>}
      {activationResult && (
        <Alert variant={activationResult.success ? 'success' : 'danger'}>{activationResult.message}</Alert>
      )}
      <div className="d-flex gap-2 mt-3">
        <Button variant="secondary" onClick={() => navigate('/')}>Go to Home</Button>
        <Button variant="outline-secondary" onClick={() => navigate('/login')}>Go to Login</Button>
      </div>
    </Container>
  )
}

export default ActivateAccount
