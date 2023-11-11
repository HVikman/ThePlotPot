import './CookieConsentPopup.css'
import { Button } from 'react-bootstrap'
import { lazy, Suspense } from 'react'
const PrivacyPolicyModal = lazy(() => import('./PrivacyPolicy'))

const CookieConsentPopup = ({ onConsent }) => {
  return (
    <div className="popup">
      <div>
        <span>We use cookies to ensure the functionality of our website, to maintain your session and to enhance website security. This includes the use of Google reCAPTCHA for spam prevention, which may use cookies and other data for its operation.
  Learn more in our </span> <Suspense fallback={<div>Loading...</div>}> <PrivacyPolicyModal />
        </Suspense>
      </div>
      <Button variant='secondary' onClick={onConsent}>Okay</Button>
    </div>
  )
}

export default CookieConsentPopup