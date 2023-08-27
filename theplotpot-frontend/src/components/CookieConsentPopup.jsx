import './CookieConsentPopup.css'
const CookieConsentPopup = ({ onConsent }) => {
    return (
      <div className="popup">
        We use cookies to ensure the functionality of our website and to maintain your session. Learn more in our [Privacy Policy].
        <button onClick={onConsent}>Okay</button>
      </div>
    );
  };
  
  export default CookieConsentPopup;