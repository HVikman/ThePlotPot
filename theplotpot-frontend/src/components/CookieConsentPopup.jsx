import './CookieConsentPopup.css'
import { Button } from 'react-bootstrap'
import { lazy, Suspense } from 'react'
const PrivacyPolicyModal = lazy(() => import('./PrivacyPolicy'))

const CookieConsentPopup = ({ onConsent }) => {
  return (
    <div className="popup">
      <p>We use cookies to ensure the functionality of our website and to maintain your session. <Suspense fallback={<div>Loading...</div>}>
  Learn more in our <PrivacyPolicyModal />.
      </Suspense>.</p>
      <Button variant='secondary' onClick={onConsent}>Okay</Button>
    </div>
  )
}

export default CookieConsentPopup